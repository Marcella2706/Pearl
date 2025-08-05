import { GlassCard } from "@/components/ui/Glass-Card";
import { Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const WellnessHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={"/assets/hero.png"}
        />
        <div className="absolute inset-0 bg-gradient-hero/80" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12 mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your Journey to
              <span className="bg-gradient-to-r from-rose-500 via-red-600 to-red-800 bg-clip-text text-transparent block">
                Wellness Starts Here
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover personalized health solutions, expert guidance, and a
              supportive community to help you achieve your wellness goals with
              confidence and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-xl shadow-elegant hover:shadow-glass transition-all duration-300"
              >
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-xl bg-glass-secondary backdrop-blur-glass border-glass-border hover:bg-glass-primary transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </GlassCard>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard variant="hover" className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Care</h3>
              <p className="text-muted-foreground">
                Tailored wellness plans designed specifically for your unique
                health journey and lifestyle.
              </p>
            </GlassCard>

            <GlassCard variant="hover" className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trusted Experts</h3>
              <p className="text-muted-foreground">
                Connect with certified health professionals who understand your
                wellness goals.
              </p>
            </GlassCard>

            <GlassCard variant="hover" className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Supportive Community
              </h3>
              <p className="text-muted-foreground">
                Join a caring community of individuals on similar wellness
                journeys as yours.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
