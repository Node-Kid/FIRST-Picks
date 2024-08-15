import { User } from "./User";

class UserManager {
    userList: User[];
    instance: undefined | UserManager;
    constructor() {
        this.userList = [];
        this.instance = undefined;
    }

    getInstance(): UserManager {
        if(this.instance == undefined) {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    addUser(user: User) {
        this.userList.push(user);
    }
}

export { UserManager }