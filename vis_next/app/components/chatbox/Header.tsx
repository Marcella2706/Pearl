import { Bell, Settings, User, Menu } from "lucide-react";
import { Button2 } from "./buttonChat";

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className="bg-background/95 backdrop-blur-xl border-b border-border w-full sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button2 variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button2>
          
          <div className="flex items-center space-x-3">
            <img 
              src="" 
              alt="HealthAI Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">
                HealthAI Doctor Assistant
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Your trusted AI health companion
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button2 variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
              2
            </span>
          </Button2>
          
          <Button2 variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button2>
          
          <Button2 variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button2>
        </div>
      </div>
    </header>
  );
};