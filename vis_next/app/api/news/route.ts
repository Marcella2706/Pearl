import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'health';
    const max = searchParams.get('max') || '10';
    const lang = searchParams.get('lang') || 'en';
    const country = searchParams.get('country') || 'in';

    const apiKey = process.env.GNEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GNews API key not configured' },
        { status: 500 }
      );
    }

    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&country=${country}&max=${max}&sortby=publishedAt&apikey=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GNews API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch news', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the GNews response to our format
    const articles = data.articles?.map((article: any, index: number) => ({
      title: article.title,
      excerpt: article.description || article.content?.substring(0, 200) + '...',
      category: extractCategory(article.title, article.description),
      timeAgo: getTimeAgo(article.publishedAt),
      url: article.url,
      source: article.source?.name,
      publishedAt: article.publishedAt,
      // Use original image from API, but we'll override in the frontend
      originalImage: article.image,
    })) || [];

    return NextResponse.json({
      success: true,
      articles,
      totalArticles: data.totalArticles || 0,
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to extract category from article content
function extractCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  const categories = {
    'Technology': ['ai', 'artificial intelligence', 'tech', 'digital', 'software', 'app', 'smartphone'],
    'Science': ['research', 'study', 'scientist', 'discovery', 'medical', 'vaccine', 'treatment'],
    'Health': ['health', 'hospital', 'patient', 'disease', 'wellness', 'fitness', 'mental health'],
    'Environment': ['climate', 'environment', 'pollution', 'green', 'renewable', 'sustainability'],
    'Business': ['business', 'economy', 'market', 'financial', 'company', 'startup'],
    'Education': ['education', 'school', 'university', 'student', 'learning'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'Health'; // Default category
}

// Helper function to convert timestamp to "X hours ago" format
function getTimeAgo(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}
