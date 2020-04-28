import { component } from "../../interfaces/componment";
import "./taggroup.css"

interface tagsType {
    title:string;
    href:string;
}
interface tagsSetting {
    toggle:Function;
}
class tagGroup implements component {
    elem:HTMLElement;
    data:tagsType[];
    current:tagsType;
    render(data:tagsType[],opt?:tagsSetting){
        this.data = data;
        this.elem = document.createElement('div');
        $(this.elem).addClass('taggroup');
        $(this.elem).append('<div class="taggroup-box"></div>');
        for(let i:number = 0,len:number = data.length;i < len;i++){
            $(this.elem).find('.taggroup-box').append(`<div class="taggroup-item">${data[i].title}</div>`);
        }
        this.bind(opt);
        $(this.elem).find('.taggroup-item').eq(0).click();
        return this.elem;
    }
    bind(opt:tagsSetting){
        const self = this;
        $(self.elem).on('click','.taggroup-item',function(){
            $(this).addClass('active').siblings().removeClass('active');
            const index:number = $(this).index();
            self.current = self.data[index];
            opt.toggle(self.current);
        })
    }
}

export default tagGroup;