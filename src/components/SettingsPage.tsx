
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2, 
  Lock,
  Eye,
  Mail,
  Smartphone,
  Monitor
} from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    fileUploads: true,
    storageAlerts: true,
    security: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityTracking: false,
    dataCollection: false
  });

  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
    animations: true
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                English (US)
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Button variant="outline" className="w-full justify-start">
                UTC-8 (Pacific Time)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Get notified instantly</p>
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">File Upload Notifications</p>
                <p className="text-sm text-gray-500">Get notified when files are uploaded</p>
              </div>
              <Switch
                checked={notifications.fileUploads}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, fileUploads: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Storage Alerts</p>
                <p className="text-sm text-gray-500">Warnings when storage is full</p>
              </div>
              <Switch
                checked={notifications.storageAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, storageAlerts: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-gray-500">Make your profile visible to others</p>
                </div>
              </div>
              <Switch
                checked={privacy.profileVisible}
                onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisible: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Activity Tracking</p>
                <p className="text-sm text-gray-500">Allow tracking for analytics</p>
              </div>
              <Switch
                checked={privacy.activityTracking}
                onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, activityTracking: checked }))}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Two-Factor Authentication
                <Badge variant="secondary" className="ml-auto">
                  Recommended
                </Badge>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Monitor className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch to dark theme</p>
                </div>
              </div>
              <Switch
                checked={appearance.darkMode}
                onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, darkMode: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compact View</p>
                <p className="text-sm text-gray-500">Reduce spacing and padding</p>
              </div>
              <Switch
                checked={appearance.compactView}
                onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, compactView: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Animations</p>
                <p className="text-sm text-gray-500">Enable smooth transitions</p>
              </div>
              <Switch
                checked={appearance.animations}
                onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, animations: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Your Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Account deletion is permanent and cannot be undone. All your data will be permanently removed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
