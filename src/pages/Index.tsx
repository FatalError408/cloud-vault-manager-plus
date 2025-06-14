
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { IntroSection } from "@/components/IntroSection";

const Dashboard = ({ user, logout }: { user: any; logout: () => Promise<void> }) => (
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
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
};

export default Index;

