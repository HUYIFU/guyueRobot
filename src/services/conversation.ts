import { ChatCompletionMessageParam } from "openai/resources";

export type Message = ChatCompletionMessageParam
export type Conversation = {
  id: string;
  messages: Message[]
}

export type IConversationService = {
  createConversation(id: string): Conversation;
  getConversation(id: string): Conversation | undefined;
  pushQuestionOnConversation(id: string, query: string): Conversation;
  pushAnswerOnConversation(id: string, answer: string): Conversation;
}

export const IConversationService = Symbol.for('IConversationService');

export class ConversationService implements IConversationService {
  private conversations: Conversation[] = [];
  createConversation(id: string): Conversation {
    const newConversation: Conversation = {
      id,
      messages: []
    };
    this.conversations.push(newConversation);
    return newConversation;
  }
  getConversation(id: string): Conversation | undefined {
    return this.conversations.find(conversation => conversation.id === id);
  }

  pushQuestionOnConversation(id: string, query: string): Conversation {
    const conversation = this.getConversation(id);
    if (conversation) {
      conversation.messages.push({ role: 'user', content: query });
    }
    return conversation!;
  }

  pushAnswerOnConversation(id: string, answer: string): Conversation {
    const conversation = this.getConversation(id);
    if (conversation) {
      conversation.messages.push({ role: 'assistant', content: answer });
    }
    return conversation!;
  }
}