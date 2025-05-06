
import { useState } from 'react';
import { Header } from "@/components/Header";
import { StorageSidebar } from "@/components/StorageSidebar";
import { FileUploader } from "@/components/FileUploader";
import { FileExplorer } from "@/components/FileExplorer";
import { IntroSection } from "@/components/IntroSection";
import { useAuth } from "@/contexts/AuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { StorageProvider } from "@/contexts/StorageContext";

const DashboardLayout = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <IntroSection />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <StorageSidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <FileUploader />
          <FileExplorer />
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <StorageProvider>
        <DashboardLayout />
      </StorageProvider>
    </AuthProvider>
  );
};

export default Index;
