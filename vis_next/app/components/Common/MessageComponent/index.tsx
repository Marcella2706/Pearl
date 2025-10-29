import React from 'react';
import { Bot, User, Image as ImageIcon } from 'lucide-react';

export interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  imageUrl?: string;
  messageType?: "text" | "image" | "text_with_image";
}

interface MessageComponentProps {
  message: MessageData;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  // Determine message type
  const hasImage = message.imageUrl && message.imageUrl.trim() !== '';
  const hasText = message.content && message.content.trim() !== '';
  
  let actualMessageType = message.messageType;
  if (!actualMessageType) {
    if (hasImage && hasText) {
      actualMessageType = "text_with_image";
    } else if (hasImage) {
      actualMessageType = "image";
    } else {
      actualMessageType = "text";
    }
  }

  const getMessageIcon = () => {
    if (isAssistant) {
      return actualMessageType === "image" || actualMessageType === "text_with_image" 
        ? <ImageIcon className="w-4 h-4 text-accent" />
        : <Bot className="w-4 h-4 text-accent" />;
    } else {
      return actualMessageType === "image" || actualMessageType === "text_with_image"
        ? <ImageIcon className="w-4 h-4 text-foreground" />
        : <User className="w-4 h-4 text-foreground" />;
    }
  };
  const getAvatarBgColor = () => {
    if (isAssistant) {
      return actualMessageType === "image" || actualMessageType === "text_with_image"
        ? "bg-accent/20"
        : "bg-accent/10";
    } else {
      return "bg-foreground/10";
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* AI Avatar - Show on left for AI messages */}
      {isAssistant && (
        <div className={`shrink-0 w-8 h-8 rounded-full ${getAvatarBgColor()} flex items-center justify-center`}>
          {getMessageIcon()}
        </div>
      )}
      
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-accent text-foreground"
            : "bg-card border border-border text-card-foreground"
        }`}
      >
        {message.isThinking ? (
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-sm text-foreground-muted">JIVIKA is thinking...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Image content */}
            {hasImage && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={message.imageUrl}
                  alt="Shared image"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Text content */}
            {hasText && (
              <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className={`shrink-0 w-8 h-8 rounded-full ${getAvatarBgColor()} flex items-center justify-center`}>
          {getMessageIcon()}
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
