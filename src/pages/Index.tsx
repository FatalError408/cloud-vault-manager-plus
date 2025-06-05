
import { useState } from 'react';
import { Header } from "@/components/Header";
import { StorageSidebar } from "@/components/StorageSidebar";
import { FileUploader } from "@/components/FileUploader";
import { FileExplorer } from "@/components/FileExplorer";
import { IntroSection } from "@/components/IntroSection";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { DashboardStats } from "@/components/DashboardStats";
import { UserProfile } from "@/components/UserProfile";
import { QuickActions } from "@/components/QuickActions";
import { SettingsPage } from "@/components/SettingsPage";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { SupabaseStorageProvider } from "@/contexts/SupabaseStorageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Files, User, Settings } from "lucide-react";

const DashboardLayout = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  console.log("DashboardLayout render - user:", user, "isLoading:", isLoading);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-pulse mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-700 font-medium">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Setting up your cloud vault experience</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log("No user, showing intro section");
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <Header />
        <IntroSection />
      </div>
    );
  }
  
  console.log("User found, showing dashboard");
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <StorageSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="files" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <Files className="h-4 w-4" />
                  <span className="hidden sm:inline">Files</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <WelcomeMessage />
                <DashboardStats />
                <QuickActions />
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <FileUploader />
                <FileExplorer />
              </TabsContent>

              <TabsContent value="profile">
                <UserProfile />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsPage />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  console.log("Index component render");
  return (
    <SupabaseAuthProvider>
      <SupabaseStorageProvider>
        <DashboardLayout />
      </SupabaseStorageProvider>
    </SupabaseAuthProvider>
  );
};

export default Index;
