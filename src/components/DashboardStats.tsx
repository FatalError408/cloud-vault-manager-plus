
import { useStorage } from "@/contexts/SupabaseStorageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Cloud, HardDrive, TrendingUp, Users, FileText, Image, Video, Archive } from "lucide-react";

export function DashboardStats() {
  const { 
    cloudServices, 
    totalStorage, 
    usedStorage, 
    availableStorage,
    categories 
  } = useStorage();

  const connectedServices = cloudServices.filter(service => service.isLinked).length;
  const storagePercentage = totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0;
  
  const totalFiles = categories.reduce((acc, category) => acc + category.files.length, 0);
  
  const fileTypes = [
    { 
      name: 'Documents', 
      count: categories.find(c => c.id === 'documents')?.files.length || 0,
      icon: FileText,
      color: 'text-blue-600'
    },
    { 
      name: 'Images', 
      count: categories.find(c => c.id === 'images')?.files.length || 0,
      icon: Image,
      color: 'text-green-600'
    },
    { 
      name: 'Videos', 
      count: categories.find(c => c.id === 'videos')?.files.length || 0,
      icon: Video,
      color: 'text-purple-600'
    },
    { 
      name: 'Archives', 
      count: categories.find(c => c.id === 'archives')?.files.length || 0,
      icon: Archive,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            Connected Services
          </CardTitle>
          <Cloud className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{connectedServices}</div>
          <p className="text-xs text-blue-600 mt-1">
            of {cloudServices.length} available
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Storage Used
          </CardTitle>
          <HardDrive className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            {usedStorage.toFixed(1)} GB
          </div>
          <div className="mt-2">
            <Progress value={storagePercentage} className="h-2" />
            <p className="text-xs text-green-600 mt-1">
              {availableStorage.toFixed(1)} GB available
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">
            Total Files
          </CardTitle>
          <FileText className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{totalFiles}</div>
          <p className="text-xs text-purple-600 mt-1">
            Across all services
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">
            Storage Efficiency
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">
            {storagePercentage < 30 ? 'Excellent' : storagePercentage < 70 ? 'Good' : 'Full'}
          </div>
          <p className="text-xs text-orange-600 mt-1">
            {storagePercentage.toFixed(1)}% utilized
          </p>
        </CardContent>
      </Card>

      {/* File Type Breakdown */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">File Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fileTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div key={type.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <IconComponent className={`h-5 w-5 ${type.color}`} />
                  <div>
                    <p className="font-medium text-sm">{type.name}</p>
                    <p className="text-xs text-gray-600">{type.count} files</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
