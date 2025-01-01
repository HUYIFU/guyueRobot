// index.js

import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import { WechatyBuilder } from "wechaty";
import { FileBox } from "file-box";
import OpenAI from "openai";
import { omitEmitWords } from "./utils";
import { DrawPrompt } from "./prompt/draw";
import qrcodeTerminal from 'qrcode-terminal'
import { ChatCompletionMessageParam } from "openai/resources";
import { IUserService, UserService } from "./services/user";
import { container } from "./container";
import { IMessageService, MessageService } from "./services/message";

export type Message = ChatCompletionMessageParam
export type Conversation = {
  userId: string;
  messages: Message[]
}

const wechaty = WechatyBuilder.build(); // get a Wechaty instance


// 创建 Koa 实例
const app = new Koa();

// 创建 Router 实例
const router = new Router();

// 使用 bodyParser 中间件
app.use(bodyParser());

// 定义一个简单的路由
router.get("/", (ctx) => {
  ctx.body = "Hello, Koa!";
});

// 定义一个 POST 路由
router.post("/data", (ctx) => {
  const { name, age } = ctx.request.body as any; // 从请求体中获取数据
  ctx.body = `Received data: ${name}, ${age}`;
});

// 将路由注册到 Koa 实例
app.use(router.routes()).use(router.allowedMethods());

const emitWords = ["古月", "hi"];
 

// 启动服务器
const PORT = 3000;



const userService = container.get<IUserService>(IUserService);
const messageService = container.get<IMessageService>(IMessageService);
  

app.listen(PORT, () => {
  wechaty
    .on("scan", (qrcode, status) => {
      qrcodeTerminal.generate(qrcode, { small: true });
    })
    .on("login", (user) => {
      userService.saveLoginUser(user)
    })
    .on("message", async (message) => {
      messageService.handleReceiveMessage(message)
    });

  wechaty.start();
  console.log(`Server running on http://localhost:${PORT}`);
});
