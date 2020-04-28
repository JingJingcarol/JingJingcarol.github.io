import { baseModel } from "../interfaces/model";
import { baseCollect } from './base';


class UserModel implements baseModel {
    id:string;
    name:string;
    avatar:string;
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.avatar = data.avatar
    }
    getavatar():string | HTMLElement | Promise<any>{
        return this.avatar || '';
    }
}

class UserCollection extends baseCollect<UserModel>{
    constructor(){
        super()
        const data = {
            id:'123456',
            name:'admin',
            avatar:'/img/icon8.png'
        };
        this.list=[new UserModel(data)];
    }
}
export {
    UserModel,
    UserCollection
}