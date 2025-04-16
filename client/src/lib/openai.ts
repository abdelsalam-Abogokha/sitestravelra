import { apiRequest } from "./queryClient";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

interface ChatMessage {
  sessionId: string;
  message: string;
  isBot: boolean;
}

interface ChatResponse {
  userMessage: ChatMessage;
  botMessage: ChatMessage;
  error?: string;
}

// Get chat greeting message
export async function getChatGreeting(): Promise<string> {
  try {
    const response = await apiRequest("GET", "/api/ai-chat-settings", undefined);
    const data = await response.json();
    return data.greetingMessage || "Hi there! How can I help you with your travel plans today?";
  } catch (error) {
    console.error("Failed to get chat greeting:", error);
    return "Hi there! How can I help you with your travel plans today?";
  }
}

// Get chat messages by session
export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const response = await apiRequest("GET", `/api/ai-chat-messages/${sessionId}`, undefined);
    return await response.json();
  } catch (error) {
    console.error("Failed to get chat messages:", error);
    return [];
  }
}

// Send message to chat
export async function sendChatMessage(sessionId: string, message: string): Promise<ChatResponse | null> {
  try {
    const response = await apiRequest("POST", "/api/ai-chat-messages", {
      sessionId,
      message,
      isBot: false
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to send chat message:", error);
    return null;
  }
}

// Generate a unique session ID
export function generateSessionId(): string {
  return `session_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}
