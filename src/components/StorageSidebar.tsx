
import { useStorage } from "@/contexts/SupabaseStorageContext";
import { CloudService } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Archive, Cloud, Database, HardDrive, X, ExternalLink, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function StorageSidebar() {
  const { 
    cloudServices, 
    totalStorage, 
    usedStorage, 
    availableStorage,
    linkService,
    unlinkService,
    isLoading
  } = useStorage();

  // Function to render appropriate icon based on service type
  const renderServiceIcon = (service: CloudService) => {
    switch(service.icon) {
      case 'archive':
        return <Archive className="h-4 w-4 mr-2" />;
      case 'database':
        return <Database className="h-4 w-4 mr-2" />;
      case 'hard-drive':
        return <HardDrive className="h-4 w-4 mr-2" />;
      case 'cloud':
      default:
        return <Cloud className="h-4 w-4 mr-2" />;
    }
  };

  const handleLinkService = async (serviceType: string) => {
    // Simulate OAuth flow - in real implementation this would open OAuth popup
    const mockToken = `mock_token_${Date.now()}`;
    await linkService(serviceType, mockToken);
  };

  if (isLoading) {
    return (
      <div className="w-64 bg-slate-50 border-r p-4 h-full overflow-y-auto flex flex-col">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-slate-50 border-r p-4 h-full overflow-y-auto flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-cloud-blue">Cloud Storage</h2>
      
      {/* Storage Overview Card */}
      <Card className="mb-6 bg-gradient-cloud text-white">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-2">Storage Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used</span>
              <span>{usedStorage.toFixed(2)} GB</span>
            </div>
            <Progress value={totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0} className="h-2 bg-white/20" />
            <div className="flex justify-between text-sm">
              <span>Available</span>
              <span>{availableStorage.toFixed(2)} GB</span>
            </div>
            <div className="flex justify-between text-sm font-medium mt-2">
              <span>Total</span>
              <span>{totalStorage.toFixed(2)} GB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Services List */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-slate-700">Cloud Services</h3>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3 mb-6">
        {cloudServices.map((service) => (
          <Card key={service.id} className={cn(
            "overflow-hidden transition-all duration-200 hover:shadow-md",
            service.isLinked ? "border-l-4" : "opacity-80"
          )}
          style={{ borderLeftColor: service.isLinked ? service.color : "" }}
          >
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {renderServiceIcon(service)}
                  <span className="font-medium">{service.name}</span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full", 
                  service.isLinked ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                )}>
                  {service.isLinked ? "Connected" : "Available"}
                </span>
              </div>
              
              {service.isLinked && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Used: {service.usedStorage.toFixed(2)} GB</span>
                    <span>{service.totalStorage} GB</span>
                  </div>
                  <Progress 
                    value={(service.usedStorage / service.totalStorage) * 100} 
                    className="h-1" 
                  />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-2 pt-0 flex justify-end gap-2">
              {service.isLinked ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => unlinkService(service.id)}
                  className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-3 w-3 mr-1" /> Disconnect
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="h-8 text-xs text-slate-500 hover:text-slate-700"
                  >
                    <a href={service.signUpUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" /> Get Free
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLinkService(service.type)}
                    className="h-8 text-xs"
                    style={{
                      color: service.color,
                      borderColor: service.color,
                    }}
                  >
                    Connect
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-auto space-y-2 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Connected Services</span>
          <span>{cloudServices.filter(s => s.isLinked).length}</span>
        </div>
        <div className="flex justify-between">
          <span>Available Services</span>
          <span>{cloudServices.filter(s => !s.isLinked).length}</span>
        </div>
      </div>
    </div>
  );
}
