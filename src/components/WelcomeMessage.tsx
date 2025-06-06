
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Cloud, Star, Shield } from "lucide-react";

export function WelcomeMessage() {
  const { user } = useAuth();

  if (!user) return null;

  const firstName = user.name.split(' ')[0];
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const quickStats = [
    { label: "Files Managed", value: "127", icon: Star },
    { label: "Storage Used", value: "4.7GB", icon: Cloud },
    { label: "Security Level", value: "High", icon: Shield },
  ];

  return (
    <Card className="bg-gradient-cloud text-white mb-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardContent className="p-6 relative">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-3xl font-bold">
                {greeting}, {firstName}!
              </h2>
            </div>
            <p className="text-blue-100 max-w-2xl text-lg">
              Welcome to your unified cloud storage dashboard. Manage all your files from different cloud services in one secure, intuitive platform.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{stat.value}</span>
                    <span className="text-sm text-blue-100">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
            <Button variant="secondary" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Cloud className="h-4 w-4 mr-2" />
              Connect Service
            </Button>
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Quick Upload
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
