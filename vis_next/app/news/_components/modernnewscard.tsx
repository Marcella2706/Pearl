import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, ExternalLink } from "lucide-react";

interface ModernNewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  timeAgo: string;
  image?: string;
  trending?: boolean;
  delay?: number;
  size?: "default" | "large";
  url?: string;
  source?: string;
}

export const ModernNewsCard = ({ 
  title, 
  excerpt, 
  category, 
  timeAgo, 
  image,
  trending = false,
  delay = 0,
  size = "default",
  url,
  source
}: ModernNewsCardProps) => {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (url) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {children}
        </a>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card 
        className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-500 hover:shadow-(--shadow-lg) hover:-translate-y-1 cursor-pointer animate-fade-in"
        style={{ animationDelay: `${delay}ms` }}
      >
      {image ? (
        <div className={`relative overflow-hidden ${size === "large" ? "h-80" : "h-56"}`}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
       
          <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
          
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <Badge 
              className="bg-white/20 backdrop-blur-md text-white border-white/30 shadow-lg"
            >
              {category}
            </Badge>
            {trending && (
              <div className="flex items-center gap-1 bg-accent/90 backdrop-blur-md text-accent-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className={`font-bold text-white mb-2 ${
              size === "large" ? "text-3xl" : "text-xl"
            }`}>
              {title}
            </h3>
            <p className="text-white/90 text-sm line-clamp-2 mb-3">
              {excerpt}
            </p>
            <div className="flex items-center justify-between text-white/80 text-xs">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{timeAgo}</span>
                {source && <span className="ml-2">• {source}</span>}
              </div>
              {url && (
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Badge 
              variant="secondary"
              className="bg-linear-to-r from-primary/10 to-accent/10 text-primary border-primary/20"
            >
              {category}
            </Badge>
            {trending && (
              <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            )}
          </div>
          
          <h3 className={`font-bold text-card-foreground mb-3 group-hover:bg-linear-to-r group-hover:from-primary group-hover:to-primary/80 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 ${
            size === "large" ? "text-2xl" : "text-lg"
          }`}>
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{timeAgo}</span>
              {source && <span className="ml-2">• {source}</span>}
            </div>
            {url && (
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      )}
    </Card>
    </CardWrapper>
  );
};
