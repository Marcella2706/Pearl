"use client";
import { useEffect, useState } from "react";
import ExploreHeader from "../explore/_components/explore_Header";
import Link from "next/link";
import { FeaturedCarousel } from "./_components/featurecourosal";
import { ModernNewsCard } from "./_components/modernnewscard";

interface NewsArticle {
  title: string;
  excerpt: string;
  category: string;
  timeAgo: string;
  url?: string;
  source?: string;
  trending?: boolean;
}

const Index = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const staticImages = [
    "/images/doc1.jpeg",
    "/images/doc2.cms",
    "/images/doc3.webp",
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/news?q=health&max=13&country=in&lang=en');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        
        if (data.success && data.articles) {
          setNewsArticles(data.articles);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');
        // Fallback to dummy data
        setNewsArticles(getFallbackNews());
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Fallback news data
  const getFallbackNews = (): NewsArticle[] => [
    {
      title: "Tech Giants Announce Major Privacy Updates",
      excerpt: "Leading technology companies roll out comprehensive privacy features giving users unprecedented control over their personal data and digital footprint.",
      category: "Technology",
      timeAgo: "6 hours ago",
      trending: true,
    },
    {
      title: "Space Exploration Enters New Era of Discovery",
      excerpt: "International space agencies collaborate on ambitious missions to explore distant planets and unlock the mysteries of our cosmic neighborhood.",
      category: "Science",
      timeAgo: "8 hours ago",
      trending: true,
    },
    {
      title: "Healthcare Innovation Leads to Medical Breakthroughs",
      excerpt: "New medical technologies and treatment methods show promising results in clinical trials across multiple disease categories and patient demographics.",
      category: "Health",
      timeAgo: "12 hours ago",
    },
  ];

  // Get carousel items (first 3 articles)
  const carouselItems = newsArticles.slice(0, 3).map((article, index) => ({
    ...article,
    image: staticImages[index % staticImages.length],
  }));

  // Get remaining articles for the grid
  const gridArticles = newsArticles.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ExploreHeader
          title="Jivika News"
          subtitle="Latest Updates"
          logoSrc="/images/logo.png"
          ctaLabel="Chat"
          ctaHref="/chat"
          rightSlot={
            <nav className="flex items-center gap-4 ml-4">
            <Link
              href="/explore"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/appointments"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Doctors
            </Link>
            
            <Link
              href="/news"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              News
            </Link>
            <Link
              href="/chat"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Chat
            </Link>
           
          </nav>
          }
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ExploreHeader
        title="Jivika News"
        subtitle="Latest Updates"
        logoSrc="/images/logo.png"
        ctaLabel="Chat"
        ctaHref="/chat"
        rightSlot={
          <nav className="flex items-center gap-4 ml-4">
            <Link
              href="/explore"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/appointments"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Doctors
            </Link>
            
            <Link
              href="/news"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              News
            </Link>
            <Link
              href="/chat"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Chat
            </Link>
           
          </nav>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        <section className="mb-12">
          {carouselItems.length > 0 && (
            <FeaturedCarousel
              items={carouselItems.map((item) => ({
                ...item,
                image: (item.image as any).src ?? (item.image as unknown as string),
              }))}
            />
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-linear-to-r from-primary to-primary/80 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Latest Health News
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((news, index) => (
              <ModernNewsCard key={index} {...news} delay={60 * index} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-foreground-muted">© 2025 Jivika News. All rights reserved.</span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/chat" className="hover:text-primary transition-colors">Chat</Link>
            <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;