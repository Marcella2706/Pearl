import { Bot, User, Copy, Share, Bookmark, Heart, Activity, Shield } from "lucide-react";
import { Button2 } from "../ui/ButtonChatBox";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isAI: boolean;
  timestamp: string;
  type?: "general" | "diagnosis" | "medication" | "emergency";
}

export const ChatMessage = ({ message, isAI, timestamp, type = "general" }: ChatMessageProps) => {
  const getIcon = () => {
    if (!isAI) return <User className="h-4 w-4" />;
    
    switch (type) {
      case "diagnosis":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "medication":
        return <Shield className="h-4 w-4 text-green-500" />;
      case "emergency":
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Bot className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className={cn(
      "flex gap-4 mb-6",
      isAI ? "justify-start" : "justify-end"
    )}>
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 glass rounded-full flex items-center justify-center">
          {getIcon()}
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] space-y-2",
        isAI ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "glass-panel rounded-2xl p-4",
          isAI 
            ? "rounded-tl-md bg-ai-accent/20 border-ai-accent/30" 
            : "rounded-tr-md bg-primary/10 border-primary/30"
        )}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs text-muted-foreground">{timestamp}</span>
          
          {isAI && (
            <div className="flex items-center gap-1 ml-auto">
              <Button2 variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-3 w-3" />
              </Button2>
              <Button2 variant="ghost" size="icon" className="h-6 w-6">
                <Share className="h-3 w-3" />
              </Button2>
              <Button2 variant="ghost" size="icon" className="h-6 w-6">
                <Bookmark className="h-3 w-3" />
              </Button2>
            </div>
          )}
        </div>
      </div>
      
      {!isAI && (
        <div className="flex-shrink-0 w-10 h-10 glass rounded-full flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};