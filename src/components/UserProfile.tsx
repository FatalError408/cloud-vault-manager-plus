
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield, Settings, Crown } from "lucide-react";
import { useState } from "react";

export function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const joinDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.photoUrl} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <Badge variant="secondary" className="bg-gradient-cloud text-white">
              <Crown className="h-3 w-3 mr-1" />
              Free Plan User
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              Email Address
            </div>
            <p className="font-medium">{user.email}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Member Since
            </div>
            <p className="font-medium">{joinDate}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              Account Type
            </div>
            <p className="font-medium">Personal Account</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2" />
              Security Status
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Verified
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Features</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Cloud Storage Integration</p>
                <p className="text-sm text-gray-600">Connect multiple cloud services</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Available
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">File Management</p>
                <p className="text-sm text-gray-600">Upload, organize, and manage files</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Available
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Storage Analytics</p>
                <p className="text-sm text-gray-600">Monitor usage across services</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Available
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Advanced Sync</p>
                <p className="text-sm text-gray-600">Premium synchronization features</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Pro Feature
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-center">
          <Button variant="outline" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
