import { Container } from "inversify";
import { IUserService, UserService } from "./services/user";
import { IMessageService, MessageService } from "./services/message";
import { IConversationService, ConversationService } from "./services/conversation";



const container = new Container({defaultScope: 'Singleton'});
container.bind<IUserService>(IUserService).to(UserService);
container.bind<IMessageService>(IMessageService).to(MessageService);
container.bind<IConversationService>(IConversationService).to(ConversationService);


export { container };