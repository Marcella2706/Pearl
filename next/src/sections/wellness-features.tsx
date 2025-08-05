import { Activity, Calendar, MessageCircle, TrendingUp, Clock, Star } from "lucide-react";
import { GlassCard } from "../components/ui/Glass-Card";
import { Button } from "@/components/ui/Button";

export const WellnessFeatures = () => {
  const features = [
    {
      icon: Activity,
      title: "Health Monitoring",
      description: "Track your vital signs, symptoms, and health metrics with our intuitive monitoring tools.",
      color: "text-primary"
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Book consultations with healthcare providers at your convenience with our smart scheduling system.",
      color: "text-primary-glow"
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Get instant support and guidance from our health experts whenever you need assistance.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visualize your health journey with detailed analytics and personalized insights.",
      color: "text-primary-glow"
    },
    {
      icon: Clock,
      title: "Wellness Reminders",
      description: "Stay on track with gentle reminders for medications, appointments, and wellness activities.",
      color: "text-primary"
    },
    {
      icon: Star,
      title: "Premium Care",
      description: "Access premium wellness resources and exclusive content from leading health experts.",
      color: "text-primary-glow"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Wellness
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              At Your Fingertips
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our platform provides everything you need to take control of your health journey, 
            from monitoring to expert guidance and community support.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={index} variant="hover" className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-glass rounded-xl flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="text-center">
          <GlassCard className="inline-block p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ready to Transform Your Health?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Join thousands of users who have already started their wellness journey with us.
            </p>
            <Button size="lg" className="px-8 py-6 text-lg rounded-xl shadow-elegant">
              Get Started Today
            </Button>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};