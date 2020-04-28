import { component } from "../../interfaces/componment";
import { ResourceModel } from "../../models/resource";
import "./resourcelist.css"
import { cardResource } from "../../interfaces/model";

interface rItemSetting {
    classlist?:string,
    cardSetting?:cardResource,
    action?:Function,
    removeAction?:Function
}
class resourceItem implements component{
    elem:HTMLElement;
    data:ResourceModel;
    cardRId:string;
    setting:cardResource;
    editable:boolean = false;
    constructor(opt:{
        editable?:boolean
    } = {}){
        if(opt.editable){
            this.editable = true;
        }
    }
    render(data:ResourceModel,opt:rItemSetting = {
        classlist:''
    }){
        const {classlist = '',cardSetting} = opt;
        this.data = data;
        this.elem = document.createElement('div');
        $(this.elem).addClass(`${classlist} resource-item`).attr({draggable:true});
        $(this.elem).append(`<img src="${data.url}">`);
        if(this.editable){
            $(this.elem).append('<span class="remove">✕</span>')
        }
        if(cardSetting){
            this.setting = cardSetting;
            this.cardRId = cardSetting.id;
            $(this.elem).attr('_cardRId',this.cardRId)
            this.setStyle(cardSetting);
        }
        this.bind(opt);
        return this.elem
    }
    updated(setting:cardResource){
        this.setting = setting;
        this.setStyle(setting);
        
    }
    setStyle(setting:cardResource){
        const {position,rotate,width,height,zIndex} = setting;
        $(this.elem).css({
            width:`${width}px`,
            height:`${height}px`,
            top:`${position.y}px`,
            left:`${position.x}px`,
            transform:`rotate(${rotate}deg)`,
            'z-index':zIndex
        })
    }
    bind(opt:rItemSetting = {}){
        const self = this;
        let posStart = null;
        $(self.elem).on('dragstart',function(e){
            let type:string = 'copy';
            if($(this).parents('.desktop').length > 0){
                type = 'self'
            }
            posStart = {
                x:e.pageX,
                y:e.pageY
            }
            e.originalEvent.dataTransfer.setData("text",JSON.stringify({id:self.data.id,type,cardRId:self.cardRId,posStart}));
            e.originalEvent.dataTransfer.effectAllowed = "move";
        })
        // $(self.elem).on('mousedown','img',function(e){
        //     if($(this).parents('.desktop').length > 0){
        //         e.preventDefault();
        //     }
        // })
        // $(self.elem).on('dragstart','img',function(e){
        //     if($(this).parents('.desktop').length > 0){
        //         e.preventDefault();
        //     }
            
        // })
        $(self.elem).on('drag',function(e){
            // e.preventDefault();
            if($(this).parents('.desktop').length == 0){
                return
            }
            // const rid = e.originalEvent.dataTransfer.getData("text");    
            // const rdata =  JSON.parse(rid);
            const left = e.pageX - posStart.x;
            const top = e.pageY - posStart.y;
            $(this).css({
                // background:'rgba(255,0,0,.3)',
                transform:`rotate(${self.setting.rotate}deg) translate(${left}px,${top}px)`
            })
        })
        $(self.elem).on('click',function(){
            if($(this).parents('.desktop').length == 0){
                return
            }
            if(opt.action){
                opt.action(this);
            }
        })
        $(self.elem).on('click','.remove',function(e){
            e.stopPropagation();
            if($(this).parents('.desktop').length == 0){
                return
            }
            if(opt.removeAction){
                opt.removeAction($(this).parents('.resource-item'));
            }
        })
    }
}
class resourcelist implements component{
    elem:HTMLElement;
    data:ResourceModel[];
    render(data:ResourceModel[]){
        this.elem = document.createElement('div');
        $(this.elem).addClass('g-row resource-list')
        const list  = data;
        this.data = list;
        
        for(let i = 0,len = list.length;i < len;i++){
            const one = new resourceItem();
            $(this.elem).append(one.render(list[i],{
                classlist:'g-col-6'
            }))
        }
        return this.elem;
    }
}

export {
    resourceItem,
    resourcelist
};