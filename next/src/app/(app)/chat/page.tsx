"use client";
import { useState } from "react";
import { Sidebar } from "@/components/chatbox/Sidebar";
import { ChatMessage } from "@/components/chatbox/ChatMessage";
import { BackgroundEffects } from "@/components/chatbox/BackgroundEffect";
import { Header } from "@/components/chatbox/Header";
import { Textarea } from "@/components/ui/textarea";
import { Button2 } from "@/components/ui/ButtonChatBox";
import { Camera, Mic, Paperclip, Send } from "lucide-react";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sampleMessages = [
    {
      id: 1,
      message:
        "Hello! I'm your HealthAI Doctor Assistant. How can I help you with your health concerns today?",
      isAI: true,
      timestamp: "Just now",
      type: "general" as const,
    },
    {
      id: 2,
      message:
        "I've been having headaches for the past few days. Should I be concerned?",
      isAI: false,
      timestamp: "2 minutes ago",
    },
    {
      id: 3,
      message:
        "I understand you're experiencing headaches. Let me help you assess this. Can you tell me more about: \n\n• When did they start?\n• How severe are they (1-10)?\n• Any specific triggers?\n• Associated symptoms?\n\nThis will help me provide better guidance.",
      isAI: true,
      timestamp: "1 minute ago",
      type: "diagnosis" as const,
    },
  ];
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* <BackgroundEffects /> */}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen md:ml-0">
          {/* Header */}
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Chat area */}
          <main className="flex-1 flex flex-col p-4 md:p-6 space-y-6">
            {/* Welcome section */}
            <div className="glass-card text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gradient mb-2">
                Welcome to HealthAI Doctor Assistant
              </h2>
              <p className="text-muted-foreground">
                Get personalized health guidance powered by advanced AI
                technology
              </p>
            </div>
            <div className="flex-1 max-w-4xl mx-auto w-full">
              {/* idhar message display horaha hai replace with the actual convo with bot  @vishwas*/}
              <div className="space-y-4 mb-6">
                {sampleMessages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.message}
                    isAI={msg.isAI}
                    timestamp={msg.timestamp}
                    type={msg.type}
                  />
                ))}
              </div>
              {/* Chat input */}
              <div className="fixed bottom-0 left-0 w-full pb-2 bg-transparent">
                <div className="max-w-5xl mx-auto px-2">
                  <div className="glass-card w-full max-w-full mx-auto">
                    <div className="text-xs text-muted-foreground mb-3 text-center px-4">
                      🔒 Your health information is private and secure
                    </div>
                    <div className="relative">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a health question..."
                        className="glass-input min-h-[80px] pr-32 resize-none text-base border-white/30 focus:border-primary/50 w-full"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                        <Button2
                          variant="glass"
                          size="icon"
                          title="Attach file"
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button2>

                        <Button2 variant="glass" size="icon" title="Take photo">
                          <Camera className="h-4 w-4" />
                        </Button2>
                        <Button2
                          variant="glass"
                          size="icon"
                          title={isRecording ? "Stop recording" : "Voice input"}
                          className={isRecording ? "pulse-glow" : ""}
                          onClick={() => setIsRecording(!isRecording)}
                        >
                          <Mic
                            className={`h-4 w-4 ${
                              isRecording ? "text-medical-red" : ""
                            }`}
                          />
                        </Button2>

                        <Button2
                          variant="medical"
                          size="icon"
                          onClick={handleSend}
                          disabled={!message.trim()}
                          title="Send message"
                          className="ml-2"
                        >
                          <Send className="h-4 w-4" />
                        </Button2>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {[
                        "I am having a headace",
                        "My stomace aches",
                        "My lower back hurts",
                        "I have a sore throat",
                      ].map((suggestion) => (
                        <Button2
                          key={suggestion}
                          variant="glass"
                          size="sm"
                          onClick={() => setMessage(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button2>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
