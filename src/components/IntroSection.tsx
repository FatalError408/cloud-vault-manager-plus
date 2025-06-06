
import { Button } from "@/components/ui/button";
import { Cloud, CloudCog, Lock, CloudOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export function IntroSection() {
  const { login } = useAuth();
  
  return (
    <div className="container py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Your Free Cloud <span className="bg-gradient-to-r from-cloud-blue to-blue-400 text-transparent bg-clip-text">Storage</span> Solution
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Combine all your free cloud storage from different providers into one unified experience. Stop paying for storage you don't need!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button size="lg" onClick={() => login()} className="bg-gradient-cloud hover:opacity-90 transition-opacity">
              Get Started for Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="mr-2 p-2 bg-blue-100 rounded-full">
                <Cloud className="h-4 w-4 text-cloud-blue" />
              </div>
              <div>
                <h3 className="font-medium">Unified Storage</h3>
                <p className="text-sm text-gray-500">Access all your files in one place</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-2 p-2 bg-blue-100 rounded-full">
                <CloudCog className="h-4 w-4 text-cloud-blue" />
              </div>
              <div>
                <h3 className="font-medium">Smart Distribution</h3>
                <p className="text-sm text-gray-500">Optimizes file storage automatically</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-2 p-2 bg-blue-100 rounded-full">
                <Lock className="h-4 w-4 text-cloud-blue" />
              </div>
              <div>
                <h3 className="font-medium">Always Secure</h3>
                <p className="text-sm text-gray-500">Your data remains safe and private</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-gradient-cloud h-64 w-64 rounded-full absolute -z-10 blur-3xl opacity-20 top-0 right-0"></div>
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-48 w-48 rounded-full absolute -z-10 blur-3xl opacity-10 bottom-0 left-0"></div>
          
          <div className="relative bg-white rounded-lg shadow-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">Storage Overview</h2>
              <div className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Free Plan</div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Google Drive</span>
                  <span>15 GB</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full w-[20%]"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Dropbox</span>
                  <span>2 GB</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-blue-400 rounded-full w-[30%]"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Mega</span>
                  <span>50 GB</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-red-500 rounded-full w-[10%]"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">OneDrive</span>
                  <span>5 GB</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-blue-600 rounded-full w-[15%]"></div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Available</p>
                    <p className="font-bold text-xl">72 GB</p>
                  </div>
                  <Button className="bg-gradient-cloud hover:opacity-90 transition-opacity">
                    <CloudOff className="h-4 w-4 mr-2" /> Connect Services
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
