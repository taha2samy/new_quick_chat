
import { GoogleGenAI, Chat, Content } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

/**
 * In-memory cache for chat sessions.
 * Each channelId gets its own persistent chat session to maintain conversation context.
 * @type {Record<string, Chat>}
 */
const chatSessions: Record<string, Chat> = {};

/**
 * Retrieves or creates a chat session for a given channel.
 * This ensures that conversation history is maintained separately for each channel.
 * @param {string} channelId - The unique identifier for the channel.
 * @param {Content[]} history - The initial history to start the chat with if a session doesn't exist.
 * @returns {Chat} The chat session instance.
 */
function getChatSession(channelId: string, history: Content[]): Chat {
  if (!chatSessions[channelId]) {
    console.log(`Creating new chat session for channel ${channelId}`);
    chatSessions[channelId] = ai.chats.create({
      model,
      history,
      config: {
        systemInstruction: "You are a helpful and friendly chatbot in a chat application. Your responses should be concise and conversational, suitable for a chat environment. Format your responses using markdown where appropriate (e.g., code blocks, lists, bold text).",
      }
    });
  }
  return chatSessions[channelId];
}

/**
 * Sends a message to the Google Gemini API for a specific channel's chat session.
 * @param {string} message - The user's message content.
 * @param {Content[]} history - The current conversation history.
 * @param {string} channelId - The ID of the channel where the message is being sent.
 * @returns {Promise<string>} A promise that resolves with the bot's text response.
 * @throws {Error} Throws an error if the API call fails.
 */
export async function sendMessage(message: string, history: Content[], channelId: string): Promise<string> {
  // Use the provided channelId to get/create a persistent session for that channel.
  const chat = getChatSession(channelId, history);
  
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error(`Error sending message to Gemini for channel ${channelId}:`, error);
    // In case of an error, we reset the chat session for this specific channel
    // to allow for a fresh start on the next message.
    delete chatSessions[channelId];
    throw new Error("Failed to get a response from the AI.");
  }
}
