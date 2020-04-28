import _ from 'underscore';
import { component } from "../../interfaces/componment";
import { CardCollection, CardModel } from "../../models/card";
import "./sortlist.css";
import desktop from "../desktop/desktop";
import { cardResource } from "../../interfaces/model";
// import "toastr/build/toastr.min.css"
import { success }from 'toastr';

class sortlist implements component{
    elem:HTMLElement;
    data:CardModel[];
    pages:{
        [key:string]:desktop
    } = {};
    desk:desktop;
    current:string;
    collection:CardCollection;
    constructor(opt?:{
        desk?:desktop
    }){
        if(opt && opt.desk){
            this.setDesk(opt.desk)
        }
    }
    render(data:CardCollection){
        this.elem = document.createElement('div');
        $(this.elem).addClass('sortlist-box')
        this.collection = data;
       
        const list:CardModel[] = data.list || [new CardModel({
            id:Math.random().toString(36).substr(2),
            name:'default',
            sort:0
        })]
        this.data = list;
        for(let i:number = 0,len:number = list.length;i < len;i++){
            this.drawOne(list[i]);
        }
        this.bind();
        setTimeout(() => {
            $(this.elem).find('.sortlist').eq(0).click();
        }, 200);
        
        return this.elem
    }
    drawOne(data:CardModel){
        $(this.elem).append(`<div class="sortlist" _id="${data.id}">
            <div class="card"></div>
            <div class="name">${data.name}</div>
            <div class="tool">
                <span class="add" title="添加">+</span>
                <span class="arrawup" title="上移">↑</span>
                <span class="arrawdown" title="下移">↓</span>
                <span class="remove" title="删除">✕</span>
            </div>
        </div>`);
        // if(list[i].resourseList){
            const onepage:desktop = new desktop({pageid:data.id,pagesort:this});
            $(this.elem).find('.card').append(onepage.render(data.resourseList));
            this.pages[data.id] = onepage;
        // }
    }
    setDesk(desk:desktop){
        this.desk = desk;
    }
    updatePage(pageid:string,data:cardResource[]){
        const currentdata:CardModel = _.find(this.data,d => d.id == pageid);
        currentdata.resourseList = data;
        this.pages[pageid].update(data);
    }
    add(id?:string,next?:string){
        const newid:string = Math.random().toString(36).substr(2)
        const newOne:CardModel = new CardModel({
            id:newid,
            name:`new page`,
            sort:id ? this.calSort(id,next) : 0
        })
        this.drawOne(newOne);
        this.data.push(newOne);
        $(this.elem).find(`.sortlist[_id="${newid}"]`).click();
    }
    calSort(id:string,next:string,prev?:boolean):number{
        const currentdata:CardModel = _.find(this.data,(d:CardModel) => d.id == id);
        const nextdata:CardModel = next && _.find(this.data,(d:CardModel) => d.id == next);
        const currentSort:number = currentdata.sort;
        const nextSort:number = nextdata ? nextdata.sort : prev ? currentSort - 2 : currentSort + 2;
        return (currentSort + nextSort) / 2;

    }
    arraw(el:HTMLElement,next?:boolean){
        const one = $(el).parents('.sortlist');
        const id:string = one.attr('_id');
        const nextdom:JQuery<HTMLElement> = next ? one.next() : one.prev();
        const nextid:string = nextdom.length > 0 ? one.prev().attr('_id') : null;
        const newsort:number = this.calSort(id,nextid);
        const currentdata:CardModel = _.find(this.data,(d:CardModel) => d.id == id);
        currentdata.sort = newsort;
        if(next){
            one.insertAfter(nextdom);
        }else{
            one.insertBefore(nextdom);
        }
        
    }
    del(el:HTMLElement){
        const one = $(el).parents('.sortlist');
        const id:string = one.attr('_id');
        const currentdata:CardModel = _.find(this.data,(d:CardModel) => d.id == id);
        this.data = _.without(this.data,currentdata);
        delete this.pages[id];
        
        if(this.data.length == 0){
            this.add();
        }else{
            $(one).prev().length && $(one).prev().click() || $(one).next().click();
        }
        one.remove();
        
    }
    save(){
        this.collection.save(this.data);
        success('保存成功！')
    }
    bind(){
        const self = this;
        $(self.elem).on('click','.sortlist',function(){
            $(this).addClass('active').siblings().removeClass('active');
            const id:string = $(this).attr('_id');
            self.current = id;
            const currentdata:CardModel = _.find(self.data,(d:CardModel) => d.id == id);
            self.desk.update(currentdata.resourseList,id)
        })
        $(self.elem).on('click','.add',function(e){
            e.stopPropagation()
            const id:string = $(this).parents('.sortlist').attr('_id');
            const next:string = $(this).parents('.sortlist').next().length > 0 ? $(this).parents('.sortlist').next().attr('_id') : null;
            self.add(id,next)
        })
        $(self.elem).on('click','.arrawup',function(e){
            e.stopPropagation()
            self.arraw(this)
        })
        $(self.elem).on('click','.arrawdown',function(e){
            e.stopPropagation()
            self.arraw(this,true)
        })
        $(self.elem).on('click','.remove',function(e){
            e.stopPropagation();
            self.del(this)
        })
    }
}

export default sortlist;