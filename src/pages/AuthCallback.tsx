
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cloudStorageService } from '@/lib/cloud-storage-service';
import { toast } from '@/components/ui/use-toast';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const pendingConnection = localStorage.getItem('pending_cloud_connection');

      if (error) {
        console.error('OAuth error:', error);
        toast({
          title: "Connection failed",
          description: "Failed to connect to the cloud service",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      if (code && pendingConnection) {
        try {
          await cloudStorageService.handleOAuthCallback(pendingConnection, code);
          localStorage.removeItem('pending_cloud_connection');
          
          toast({
            title: "Successfully connected!",
            description: `Your ${pendingConnection} account has been linked`,
          });
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          toast({
            title: "Connection failed",
            description: "Failed to complete the connection",
            variant: "destructive"
          });
        }
      }

      navigate('/');
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Completing connection...</p>
      </div>
    </div>
  );
}
