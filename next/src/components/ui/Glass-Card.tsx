import { cn } from "../../lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "primary";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative backdrop-blur-glass border border-glass-border rounded-2xl transition-all duration-300",
          {
            "bg-glass-secondary shadow-soft hover:shadow-glass": variant === "default",
            "bg-glass-secondary shadow-soft hover:shadow-elegant hover:scale-105 cursor-pointer": variant === "hover",
            "bg-glass-primary shadow-glass border-primary/20": variant === "primary"
          },
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };