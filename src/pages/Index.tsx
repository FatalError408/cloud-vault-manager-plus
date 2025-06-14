
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const SimpleHeader = () => (
  <header className="bg-white border-b sticky top-0 z-10">
    <div className="container flex h-14 items-center justify-between">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0077C2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
        <h1 className="font-bold text-lg text-cloud-blue">Cloud Vault Manager</h1>
      </div>
    </div>
  </header>
);

const DashboardLayout = () => {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SimpleHeader />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-2xl mb-4 font-semibold">Sign in to start</h2>
          <button
            onClick={login}
            className="px-6 py-3 text-lg rounded bg-cloud-blue text-white font-bold hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <SimpleHeader />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <div>
            <span className="font-medium">Hi, {user.user_metadata?.full_name || user.email}</span>
          </div>
          <button
            onClick={logout}
            className="bg-red-100 text-red-700 rounded px-3 py-1 text-xs font-semibold hover:bg-red-200"
          >
            Sign Out
          </button>
        </div>
        <main className="flex-1 p-6 flex flex-col items-center justify-center text-gray-600">
          <h2 className="text-2xl font-bold mb-2">Welcome to your Cloud Vault!</h2>
          <p className="mb-6">File drive and categories UI goes here (coming up next...)</p>
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <DashboardLayout />
  );
};

export default Index;
