import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  title: string;
  excerpt: string;
  category: string;
  timeAgo: string;
  image: string;
}

interface FeaturedCarouselProps {
  items: CarouselItem[];
}

export const FeaturedCarousel = ({ items }: FeaturedCarouselProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative h-[500px] rounded-2xl overflow-hidden group">
      {items.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <Badge className="mb-4 bg-primary/90 backdrop-blur-md text-primary-foreground border-0 shadow-lg">
              {item.category}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
              {item.title}
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              {item.excerpt}
            </p>
            <div className="flex items-center text-white/80">
              <Clock className="w-4 h-4 mr-2" />
              <span>{item.timeAgo}</span>
            </div>
          </div>
        </div>
      ))}

   
      <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          onClick={prev}
          className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={next}
          className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </Button>
      </div>


      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === current 
                ? "w-8 bg-white" 
                : "w-1.5 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
