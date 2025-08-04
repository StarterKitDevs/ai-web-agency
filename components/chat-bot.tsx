'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const quickReplies = [
  "What's included?",
  "How long does it take?",
  "Can I make changes?",
  "What about hosting?",
  "Do you offer support?"
];

const botResponses: Record<string, string> = {
  "what's included": "Every website includes responsive design, SSL certificate, SEO optimization, contact forms, and 1 year of hosting. You also get the source code and can make unlimited changes.",
  "how long does it take": "Most websites are completed and live within 13 minutes on average. Complex e-commerce sites might take up to 20 minutes.",
  "can i make changes": "Absolutely! You get the complete source code and can make unlimited changes. We also offer revision packages if you need professional help.",
  "what about hosting": "Premium hosting is included for the first year with global CDN, SSL certificate, and 99.9% uptime guarantee. Renewal is just $120/year.",
  "do you offer support": "Yes! You get 30 days of free support for any technical issues. We also offer ongoing maintenance packages starting at $50/month.",
  "default": "I'm here to help! You can ask me about our process, pricing, features, or anything else about getting your website built."
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm here to help you understand our AI website building process. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== 'default' && input.includes(key)) {
        return response;
      }
    }
    
    return botResponses.default;
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 z-40"
        size="sm"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-2xl z-30 animate-in slide-in-from-bottom-2 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-sm">AI Assistant</CardTitle>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-muted'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-3 w-3 text-white" />
                        ) : (
                          <Bot className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="p-3 border-t">
              <div className="flex flex-wrap gap-1 mb-3">
                {quickReplies.map((reply) => (
                  <Badge
                    key={reply}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      handleSendMessage(inputValue);
                    }
                  }}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => inputValue.trim() && handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
} 