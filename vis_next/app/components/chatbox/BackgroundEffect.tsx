export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-background via-card to-background" />
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full floating-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
  
      <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-primary/5" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-accent/5" />
    </div>
  );
};