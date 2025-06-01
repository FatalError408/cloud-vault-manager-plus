
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, Settings, BarChart3, Shield, Link } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Upload Files",
      description: "Add new files to your cloud storage",
      icon: Upload,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Upload files")
    },
    {
      title: "Create Folder",
      description: "Organize your files with new folders",
      icon: FolderPlus,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Create folder")
    },
    {
      title: "Connect Service",
      description: "Link a new cloud storage provider",
      icon: Link,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => console.log("Connect service")
    },
    {
      title: "View Analytics",
      description: "See storage usage and insights",
      icon: BarChart3,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => console.log("View analytics")
    },
    {
      title: "Security Settings",
      description: "Manage your account security",
      icon: Shield,
      color: "bg-red-500 hover:bg-red-600",
      action: () => console.log("Security settings")
    },
    {
      title: "Preferences",
      description: "Customize your experience",
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => console.log("Preferences")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
                onClick={action.action}
              >
                <div className={`p-2 rounded-full text-white ${action.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
