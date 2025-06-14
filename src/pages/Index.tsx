
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { IntroSection } from "@/components/IntroSection";
import React from "react";

// Utility for boundary error fallback
function ErrorBoundary({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <pre className="bg-red-100 text-red-700 p-4 rounded">{error}</pre>
      <button
        className="mt-8 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => window.location.reload()}
      >
        Reload page
      </button>
    </div>
  );
}

const Dashboard = ({
  user,
  logout
}: {
  user: any;
  logout: () => Promise<void>;
}) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <div>
          <span className="font-medium">
            Hi, {user.user_metadata?.full_name || user.email}
          </span>
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

const Index = () => {
  const { user, isLoading, login, logout } = useAuth();
  const [err, setErr] = React.useState<string | null>(null);

  // Log key states to console for inspection
  React.useEffect(() => {
    console.log("[Index] isLoading:", isLoading, "user:", user);
  }, [isLoading, user]);

  try {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-gray-400">Loading...</span>
        </div>
      );
    }

    if (err) {
      return <ErrorBoundary error={err} />;
    }

    if (!user) {
      return (
        <>
          <Header />
          <IntroSection />
        </>
      );
    }

    return <Dashboard user={user} logout={logout} />;
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message + "\n" + (e.stack || "")
        : String(e);
    setErr(msg);
    // Show fallback
    return <ErrorBoundary error={msg} />;
  }
};

export default Index;

