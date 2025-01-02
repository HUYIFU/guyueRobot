import { ChatCompletionMessageParam } from "openai/resources";
import { systemPrompt } from "../prompt/system";

export type Message = ChatCompletionMessageParam;
export type Conversation = {
  id: string;
  messages: Message[];
};

export type IConversationService = {
  createConversation(id: string): Conversation;
  getConversation(id: string): Conversation | undefined;
  pushQuestionOnConversation(id: string, query: string): Conversation;
  pushAnswerOnConversation(id: string, answer: string): Conversation;
  clearMessagesFromConversation(id: string): void;
};

export const IConversationService = Symbol.for("IConversationService");

export class ConversationService implements IConversationService {
  private conversations: Conversation[] = [];
  readonly defaultSystemMessage: ChatCompletionMessageParam = {
    role: "system",
    content: systemPrompt,
  };
  createConversation(id: string): Conversation {
    const newConversation: Conversation = {
      id,
      messages: [this.defaultSystemMessage],
    };
    this.conversations.push(newConversation);
    return newConversation;
  }
  getConversation(id: string): Conversation | undefined {
    return this.conversations.find((conversation) => conversation.id === id);
  }

  clearMessagesFromConversation(id: string): void {
    const conversation = this.getConversation(id);
    if (conversation) {
      conversation.messages = [this.defaultSystemMessage];
    }
  }

  pushQuestionOnConversation(id: string, query: string): Conversation {
    const conversation = this.getConversation(id);
    if (conversation) {
      conversation.messages.push({ role: "user", content: query });
    }
    return conversation!;
  }

  pushAnswerOnConversation(id: string, answer: string): Conversation {
    const conversation = this.getConversation(id);
    if (conversation) {
      conversation.messages.push({ role: "assistant", content: answer });
    }
    return conversation!;
  }
}
