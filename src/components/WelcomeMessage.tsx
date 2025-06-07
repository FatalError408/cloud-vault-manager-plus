
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Cloud } from "lucide-react";

export function WelcomeMessage() {
  const { user } = useAuth();

  if (!user) return null;

  const firstName = user.name.split(' ')[0];
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Card className="bg-gradient-cloud text-white mb-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-2xl font-bold">
                {greeting}, {firstName}!
              </h2>
            </div>
            <p className="text-blue-100 max-w-md">
              Welcome to your unified cloud storage dashboard. Manage all your files from different cloud services in one place.
            </p>
          </div>
          
          <div className="hidden md:flex space-x-2">
            <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Cloud className="h-4 w-4 mr-2" />
              Connect Service
            </Button>
            <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4 md:hidden flex space-x-2">
          <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Cloud className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
            Start
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
