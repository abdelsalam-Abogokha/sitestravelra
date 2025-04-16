import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  X, 
  Send, 
  User,
  Bot
} from 'lucide-react';
import { 
  getChatGreeting, 
  getChatMessages, 
  sendChatMessage, 
  generateSessionId 
} from '@/lib/openai';

interface Message {
  id?: number;
  sessionId: string;
  message: string;
  isBot: boolean;
  createdAt?: string;
}

const AiChatWidget = () => {
  const { t, i18n } = useTranslation();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRtl = i18n.language === 'ar';

  // Initialize chat session
  useEffect(() => {
    const initChat = async () => {
      // Generate a new session ID or retrieve from localStorage
      const storedSessionId = localStorage.getItem('chatSessionId');
      const newSessionId = storedSessionId || generateSessionId();
      
      if (!storedSessionId) {
        localStorage.setItem('chatSessionId', newSessionId);
      }
      
      setSessionId(newSessionId);
      
      // Fetch existing messages for the session or show greeting
      try {
        const existingMessages = await getChatMessages(newSessionId);
        
        if (existingMessages && existingMessages.length > 0) {
          setMessages(existingMessages);
        } else {
          // Add greeting message
          const greeting = await getChatGreeting();
          setMessages([{
            sessionId: newSessionId,
            message: greeting,
            isBot: true
          }]);
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        // Default greeting if API fails
        setMessages([{
          sessionId: newSessionId,
          message: 'Hi there! How can I help you with your travel plans today?',
          isBot: true
        }]);
      }
    };
    
    initChat();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // Add user message to state
    const userMessage: Message = {
      sessionId,
      message: messageInput,
      isBot: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    setIsTyping(true);
    
    try {
      // Send message to API
      const response = await sendChatMessage(sessionId, messageInput);
      
      if (response) {
        // Add bot response to state
        setMessages(prev => [...prev, response.botMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        sessionId,
        message: 'Sorry, I encountered an error. Please try again later.',
        isBot: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setChatOpen(!chatOpen)}
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors duration-200"
      >
        {chatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
      
      {chatOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h3 className="font-semibold flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              <span>{t('common.chat')}</span>
            </h3>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-gray-50" id="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-4 ${!msg.isBot && 'justify-end'}`}>
                {msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.isBot ? 'bg-light' : 'bg-primary text-white'
                }`}>
                  <p>{msg.message}</p>
                </div>
                
                {!msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-light max-w-[80%] rounded-lg p-3">
                  <p className="flex space-x-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex">
              <Input
                type="text"
                placeholder={isRtl ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                className="flex-1 border rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded-r-lg hover:bg-primary-dark transition-colors duration-200"
                disabled={isTyping || !messageInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatWidget;
