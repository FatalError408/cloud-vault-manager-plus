
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LogOut, User, Github, Shield, Settings, Cloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { user, login, logout, isLoading } = useAuth();
  
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Cloud className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cloud Vault Manager
              </h1>
              <p className="text-xs text-gray-500 leading-none">Unified Cloud Storage</p>
            </div>
          </div>
          {window.location.hostname !== 'localhost' && (
            <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
              <Shield className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/fatalerror408/cloud-vault-manager-plus" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <Github className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">GitHub</span>
          </a>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 w-12 rounded-full p-0 ring-2 ring-blue-100 hover:ring-blue-200 transition-all">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <div className="flex items-center justify-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    {user.lastLoginDate && (
                      <p className="text-xs text-gray-500">
                        Active since {new Date(user.lastLoginDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-50">
                  <User className="h-4 w-4 mr-3 text-blue-600" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-purple-50">
                  <Settings className="h-4 w-4 mr-3 text-purple-600" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50">
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => login()} 
              disabled={isLoading}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-3 h-12 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              {!isLoading && (
                <span className="font-medium">Get Started Free</span>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
