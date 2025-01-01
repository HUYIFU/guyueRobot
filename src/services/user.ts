import { injectable } from "inversify";
import { ContactInterface, ContactSelfInterface } from "wechaty/impls";



export interface IUserService {
    saveLoginUser(user: ContactSelfInterface): void;
    getLoginUser(): ContactSelfInterface | null;
    saveUser(user: ContactInterface): void;
    getUser(id: string): ContactInterface | undefined;
    deleteUser(id: string): void;
}

export const IUserService = Symbol.for('IUserService');

@injectable()
export class UserService implements IUserService {
    private userMap = new Map<string, ContactSelfInterface>();
    private loginUser: ContactSelfInterface | null = null;

    // 记录登录用户
    public saveLoginUser(user: ContactSelfInterface) {
        console.log(`User ${user.name()} ${user.id} logged in`)
        this.loginUser = user;
    }

    // 获取登录用户
    public getLoginUser() {
        return this.loginUser;
    }


    // 记录用户和会话，每当消息触发时，首次创建
    public saveUser(user: ContactSelfInterface) {
        this.userMap.set(user.id, user);
    }
    
    // 获取用户和会话
    public getUser(id: string) {
        return this.userMap.get(id);
    }
    
    // 删除用户和会话
    public deleteUser(id: string) {
        this.userMap.delete(id);
    }

}