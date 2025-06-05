
import { useState } from 'react';
import { useStorage } from '@/contexts/SupabaseStorageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash, FileIcon, FileText, Image, Video, Music, Archive } from 'lucide-react';

export function FileExplorer() {
  const { categories, cloudServices, deleteFile } = useStorage();
  const [activeTab, setActiveTab] = useState(categories[0]?.id || '');

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (type.startsWith('video/')) return <Video className="h-6 w-6" />;
    if (type.startsWith('audio/')) return <Music className="h-6 w-6" />;
    if (type.includes('zip') || type.includes('compressed')) return <Archive className="h-6 w-6" />;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return <FileText className="h-6 w-6" />;
    }
    return <FileIcon className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const getServiceColor = (serviceId: string): string => {
    const service = cloudServices.find(s => s.id === serviceId);
    return service?.color || '#666';
  };

  const handleDownload = (fileName: string) => {
    alert(`Downloading ${fileName} (simulated)`);
  };

  const handleDelete = (fileId: string, categoryId: string) => {
    deleteFile(fileId, categoryId);
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Files Explorer</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex overflow-x-auto mb-4">
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="min-w-fit"
            >
              {category.name}
              {category.files.length > 0 && (
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-primary/10">
                  {category.files.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            {category.files.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FileIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No files in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.files.map(file => (
                  <Card key={file.id} className="overflow-hidden flex flex-col">
                    <div className="p-3 flex-1">
                      <div className="flex items-start">
                        <div className="p-2 mr-3 bg-gray-100 rounded">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate" title={file.name}>
                            {file.name}
                          </h4>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          <p className="text-xs mt-1">
                            <span 
                              className="inline-block h-2 w-2 rounded-full mr-1"
                              style={{ backgroundColor: getServiceColor(file.serviceId) }}
                            ></span>
                            <span className="text-gray-500">
                              {cloudServices.find(s => s.id === file.serviceId)?.name}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => handleDownload(file.name)}
                      >
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(file.id, category.id)}
                      >
                        <Trash className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
