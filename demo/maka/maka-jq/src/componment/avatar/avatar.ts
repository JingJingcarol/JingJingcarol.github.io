import { component } from "../../interfaces/componment";
import { UserCollection, UserModel } from "../../models/user";


class avatar implements component {
    elem:HTMLElement;
    render(data?:string){
        this.elem = document.createElement('div');
        const currentUser:UserModel = new UserCollection().get(data || '123456');
        // const imgUrl = require(`..${currentUser.getavatar()}`);
        
        $(this.elem).addClass('g-avatar').append(`<img src="${currentUser.getavatar()}">`);
        return this.elem;
    }
}

export default avatar;