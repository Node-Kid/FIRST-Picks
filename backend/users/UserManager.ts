import { UUID } from "crypto";
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
    getUserByID(id: UUID): User | undefined {
        return this.userList.find(user => user.userid == id);
    }
}

export { UserManager }