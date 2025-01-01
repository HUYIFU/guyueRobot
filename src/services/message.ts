import { inject, injectable } from "inversify";
import { MessageInterface } from "wechaty/impls";
import { IUserService } from "./user";
import { Conversation, IConversationService } from "./conversation";
import OpenAI from "openai";
import { config } from 'dotenv';


export interface IMessageService {
    handleReceiveMessage(imMessage:MessageInterface): Promise<void>;
    sendMessage(conversation: Conversation, message: MessageInterface): Promise<void>;
}

config();



const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = 'gpt-4o'


async function getGptTextAnswer(question: string): Promise<string> {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: question }],
    model,
  });
  return chatCompletion.choices[0].message.content || "gpt error";
}

// async function getGptImageAnswer(question: string): Promise<string> {
//   const imageResponse = await client.images.generate({
//     prompt: question + DrawPrompt, // 你希望生成的图像描述
//     n: 1, // 生成 1 张图像
//     size: "1024x1024", // 设置图像的大小
//   });
//   console.log("imageResponse", imageResponse.data[0]);
//   const imageUrl = imageResponse.data[0].url; // 获取生成的图像 URL
//   return imageUrl || "";
// }


export const IMessageService = Symbol.for('IMessageService');

@injectable()
export class MessageService {
    private userService: IUserService;
    private conversationService: IConversationService;
    constructor(@inject(IUserService) userService: IUserService,@inject(IConversationService) conversationService: IConversationService) {
        this.userService = userService
        this.conversationService = conversationService
    }


    public async handleReceiveMessage(imMessage:MessageInterface) {
        const talker = imMessage.talker();
        this.userService.saveUser(talker);
        const text = imMessage.text();
        console.log("talker", JSON.stringify(talker));
        console.log("text", text)
        // 没有消息和发送者，直接返回
        if (!text || !talker) return
        
        const conversation = this.conversationService.getConversation(talker.id);
        if (!conversation && text === 'start') {
           this.conversationService.createConversation(talker.id)        
           imMessage.say("开启gpt对话了，开始对话吧");
        } else if (conversation) {
           const updatedConversation = this.conversationService.pushQuestionOnConversation(talker.id, text);
           this.sendMessage(updatedConversation, imMessage);
        }

              // let isEmit = false;
      // for (const word of emitWords) {
      //   if (text.startsWith(word)) {
      //     isEmit = true;
      //   }
      // }
      // if (!isEmit) {
      //   return;
      // }
      // const query = omitEmitWords(emitWords, text);
      // // 策略模式
      // if (query.includes("画")) {
      //   const url = await getGptImageAnswer(query);
      //   const fileBox = FileBox.fromUrl(url);
      //   console.log("start", fileBox);
      //   message.say(fileBox);
      // } else {
      //   const answer = await getGptTextAnswer(query);
      //   console.log("message", message.text());
      //   message.say(answer);
      // }
    }

    public async sendMessage(conversation: Conversation, message: MessageInterface): Promise<void> {
        const chatCompletion = await client.chat.completions.create({
            messages: conversation.messages,
            model,
          });
        const gptReply = chatCompletion.choices[0].message.content;
        message.say(chatCompletion.choices[0].message.content || "gpt error");
        // 把模型的回复也存下来
        if (gptReply) {
            this.conversationService.pushAnswerOnConversation(conversation.id, gptReply);
        }
    }
}