
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log("No user, showing intro section");
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <IntroSection />
      </div>
    );
  }
  
  console.log("User found, showing dashboard");
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <StorageSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <Files className="h-4 w-4" />
                  <span className="hidden sm:inline">Files</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
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
