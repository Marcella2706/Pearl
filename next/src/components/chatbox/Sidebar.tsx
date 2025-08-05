import { Home, MessageCircle, Upload, History, BookOpen, Phone, Moon, Sun, HelpCircle } from "lucide-react";
import {Button2} from "../ui/ButtonChatBox"
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { icon: Home, label: "Home", href: "/", active: true },
  { icon: MessageCircle, label: "Consult a Doctor", href: "/consult" },
  { icon: History, label: "Chat History", href: "/history" },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-72 glass-panel transform transition-transform duration-300 ease-in-out z-50",
        "md:translate-x-0 md:static md:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 h-full flex flex-col">
          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 px-3">
              Navigation
            </h2>
            
            {navigationItems.map((item) => (
              <Button2
                key={item.label}
                variant={item.active ? "medical" : "ghost"}
                className="w-full justify-start glass hover:glass"
                onClick={onClose}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button2>
            ))}
          </nav>

          {/* Emergency Section */}
          
        </div>
      </aside>
    </>
  );
};