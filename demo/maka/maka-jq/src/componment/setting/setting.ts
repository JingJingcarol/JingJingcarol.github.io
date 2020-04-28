import _ from 'underscore';
import { component } from "../../interfaces/componment";
import './setting.css'
import { cardResource } from "../../interfaces/model";
interface settingItemType {
    name?:string,
    key:string,
    type?:string,
    col?:number,
    defaultValue?:any,
    action?:Function
}
interface settingType {
    [key:string]:settingItemType[]
}
class setting implements component{
    elem:HTMLElement;
    current:cardResource;
    data:settingType;
    changeAction:Function;
    map:{
        [key:string]:settingItemType
    } = {};
    constructor(opt:{
        changeAction?:Function
    } = {}){
        if(opt.changeAction){
            this.changeAction = opt.changeAction;
        }
    }
    render(data:settingType){
        this.elem = document.createElement('div');
        $(this.elem).addClass('setting').append('<span class="fa fa-cog setting-open" title="展开/收起设置"></span><div class="setting-box"></div>');
        this.data = data;
        for(let i in data){
            const one:JQuery<HTMLElement> = $(`<div class="setting-item">
                <label>${i}</label>
                <div class="g-row setting-item-row">
                </div>
            </div>`)
            for(let j:number = 0,len:number = data[i].length;j < len;j++){
                const oneSetting = data[i][j];
                const {col = 12,name = '',type = 'text',key,defaultValue} = oneSetting;
                const coldom:JQuery<HTMLElement> = $(`<div class="g-col-${col} setting-item-col"></div>`);
                switch(type){
                    case 'button':
                        coldom.append(`<button id="${key}" disabled>${name}</button>`)
                        break;
                    default :
                        coldom.append(`<label for="${key}">${name}</label>
                        <input type="${type}" id="${key}" disabled value="${defaultValue}">`)
                }
                one.find('.g-row').append(coldom)
                this.map[key] = oneSetting;
            }
            $(this.elem).find('.setting-box').append(one);
        }
        this.bind();
        return this.elem;
    }
    bind(){
        const self = this;
        let timer = null;
        $(self.elem).on('click','.setting-open',function(){
            $(self.elem).toggleClass('open');
        })
        $(self.elem).on('input','input',function(e){
            clearTimeout(timer);
            timer = setTimeout(() => {
                const key = $(this).attr('id');
                const val = $(this).val();
                eval(`self.current.${key} = val`);
                if(self.changeAction){
                    self.changeAction(self.current)
                }
                
            },500)
            
            
        })
        $(self.elem).on('click','button',function(e){
            const key = $(this).attr('id');
            const item = self.map[key]
            if(item.action){
                item.action(self.current);
            }
        })
    }
    setCurrent(crdata:cardResource){
        this.current = crdata;
        $(this.elem).find('[disabled]').prop('disabled',false);
        $(this.elem).find('input').each((i,item) => {
            var key = $(item).attr('id');
            $(item).val(eval(`crdata.${key}`));
        })
    }
}

export default setting;