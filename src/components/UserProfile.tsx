
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Calendar, Shield, Settings, Crown, Star, Trophy, Zap, Cloud, HardDrive, FileText } from "lucide-react";
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

  const userStats = {
    filesUploaded: 127,
    storageUsed: 4.7,
    totalStorage: 15,
    servicesConnected: 3,
    accountLevel: "Free",
    experiencePoints: 350,
    nextLevelXP: 500,
    achievements: [
      { name: "First Upload", icon: FileText, earned: true },
      { name: "Cloud Explorer", icon: Cloud, earned: true },
      { name: "Storage Master", icon: HardDrive, earned: false },
      { name: "Power User", icon: Zap, earned: false },
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Profile Card */}
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={user.photoUrl} alt={user.name} />
                <AvatarFallback className="text-2xl bg-gradient-cloud text-white">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-cloud text-white">
                <Crown className="h-3 w-3 mr-1" />
                {userStats.accountLevel}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl">{user.name}</CardTitle>
              <p className="text-gray-600">{user.email}</p>
              
              {/* XP Progress */}
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Level Progress</span>
                  <span>{userStats.experiencePoints}/{userStats.nextLevelXP} XP</span>
                </div>
                <Progress 
                  value={(userStats.experiencePoints / userStats.nextLevelXP) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-900">{userStats.filesUploaded}</p>
              <p className="text-sm text-blue-600">Files Uploaded</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <HardDrive className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-900">{userStats.storageUsed}GB</p>
              <p className="text-sm text-green-600">Storage Used</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Cloud className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-900">{userStats.servicesConnected}</p>
              <p className="text-sm text-purple-600">Services Connected</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Star className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-900">{userStats.experiencePoints}</p>
              <p className="text-sm text-orange-600">Experience Points</p>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Personal
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Status</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Achievements
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {userStats.achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        achievement.earned
                          ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mx-auto mb-1" />
                      <p className="text-xs font-medium text-center">{achievement.name}</p>
                      {achievement.earned && (
                        <Star className="h-3 w-3 mx-auto mt-1 fill-current" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* Storage Usage */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Storage Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Used Storage</span>
                <span>{userStats.storageUsed} GB of {userStats.totalStorage} GB</span>
              </div>
              <Progress value={(userStats.storageUsed / userStats.totalStorage) * 100} className="h-3" />
              <div className="text-center">
                <Button variant="outline" size="sm">
                  Upgrade Storage
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
            <Button className="bg-gradient-cloud text-white">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
