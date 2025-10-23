import { Star } from "lucide-react";

const StarRating = ({ rating = 4.4, starSize = 18 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-0.5">
      <span className="text-base font-bold text-foreground mr-2">{rating.toFixed(1)}</span>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={starSize} className="text-primary fill-primary" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star size={starSize} className="text-primary fill-primary" />
          <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: '50%' }}>
            <Star size={starSize} className="text-accent fill-accent" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={starSize} className="text-foreground-muted fill-foreground-muted" />
      ))}
    </div>
  );
};
export default StarRating;