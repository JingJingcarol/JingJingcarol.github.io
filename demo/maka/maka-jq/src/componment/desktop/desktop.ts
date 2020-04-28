import _ from 'underscore';
import { component } from "../../interfaces/componment";
import './desktop.css'
import { resourceItem } from "../resourcelist/resourcelist";
import { cardResource } from "../../interfaces/model";
import { ResourceCollection, ResourceModel } from '../../models/resource';
import sortlist from '../sortlist/sortlist';


class desktop implements component {
    elem:HTMLElement;
    data:cardResource[] = [];
    setting:{
        width:number,
        height:number
    };
    cardDom:resourceItem[] = [];
    resources:ResourceCollection = new ResourceCollection();
    pageid:string;
    pagesort:sortlist;
    settingResAction:Function;
    constructor(opt:{pageid:string,pagesort:sortlist,settingResAction?:Function}){
        this.pageid = opt.pageid;
        this.pagesort = opt.pagesort;
        if(opt.settingResAction){
            this.settingResAction = opt.settingResAction;
        }
    }
    render(data?:cardResource[]){
        this.setting = {
            width:375,
            height:667
        }
        this.elem = document.createElement('div');
        $(this.elem).addClass('desktop');
        $(this.elem).append('<div class="drophere">拖放到这里</div><div class="desktop-box"></div>');
        if(data){
            this.update(data);
        }
        this.bind();
        return this.elem;
    }
    update(data:cardResource[],id?:string){
        if(id){
            this.pageid = id;
        }
        this.data = data || [];
        this.cardDom = [];
        $(this.elem).find('.desktop-box').empty();;
        if(data){
            
            for(let i:number = 0,len:number = data.length;i < len;i++){
                this.drawOneResource(data[i]);
            }
        }
        
    }
    drawOneResource(item:cardResource){
        const rItem:resourceItem = new resourceItem({
            editable:true
        });
        const rdata:ResourceModel = this.resources.get(item.resourceid);
        
        const rItemDom:HTMLElement = rItem.render(rdata,{
            cardSetting:item,
            action:(el:HTMLElement) => {
                this.chooseRes(el)
            },
            removeAction:(el:HTMLElement) => {
                this.removeRes(el)
            }
        });
        $(this.elem).find('.desktop-box').append(rItemDom);               
        this.cardDom.push(rItem);
        return rItemDom;
    }
    updateOneResource(crdata:cardResource){
        const rItem = _.find(this.cardDom,c => c.cardRId == crdata.id);
        rItem.updated(crdata);
        this.data[_.indexOf(this.data,l => l.id == crdata.id)] = crdata;
        this.pagesort.updatePage(this.pageid,this.data)
    }
    chooseRes(el:HTMLElement){
        const crid:string = $(el).attr('_cardRId');
        if(!crid) {
            return
        }
        $(el).addClass('active').siblings().removeClass('active');
        if(this.settingResAction){
            const crdata:cardResource = _.find(this.data,d => d.id == crid);
            this.settingResAction(crdata);
        }
    }
    removeRes(el:HTMLElement){
        const crid:string = $(el).attr('_cardRId');
        if(!crid) {
            return
        }
        const crdata:cardResource = _.find(this.data,d => d.id == crid);
        this.data = _.without(this.data,crdata);
        const cItem:resourceItem = _.find(this.cardDom,d => d.cardRId == crid);
        this.cardDom = _.without(this.cardDom,cItem);
        $(el).remove();
        this.pagesort.updatePage(this.pageid,this.data)
    }
    zIndexarrow(crdata:cardResource,type:string){
        const currentIndex:number = _.indexOf(this.data,crdata);
        const currentData = this.data[currentIndex];
        const rDom = _.find(this.cardDom,c => c.cardRId == crdata.id);
        this.data.splice(currentIndex,1);
        switch(type){
            case 'up':
                this.data.splice(currentIndex + 1,0,currentData)
                $(rDom.elem).insertAfter($(rDom.elem).next())
                break;
            case 'down':
                this.data.splice(currentIndex-1,0,currentData)
                
                $(rDom.elem).insertBefore($(rDom.elem).prev())
                break;
            case 'top':
                this.data.push(currentData);
                $(this.elem).find('.desktop-box').append(rDom.elem);
                break;
            case 'bottom':
                this.data.unshift(currentData)
                $(this.elem).find('.desktop-box').prepend(rDom.elem);
                break;
        }
        this.pagesort.updatePage(this.pageid,this.data)
    }
    bind(){
        const self = this;
        $(this.elem).on('dragover',function(e){
            e.preventDefault();
            $(self.elem).find('.drophere').css('display','flex')
        })
        // $(this.elem).on('dragenter',function(e){
        //     e.preventDefault();
        //     e.originalEvent.dataTransfer.dropEffect = "move";
        // })
        $(this.elem).on('drop',function(e){
            const rid:string = e.originalEvent.dataTransfer.getData("text");
            
            
            const rdata:{
                id:string,
                cardRId:string,
                type:string,
                posStart:{
                    x:number,
                    y:number
                }
            } =  JSON.parse(rid);
            const top:number = e.pageY - self.elem.offsetTop;
            const left:number = e.pageX - self.elem.offsetLeft - self.setting.width / 2;
            const position = {
                x:left,
                y:top
            }
            let activeDom = null;
            if(rdata.type == 'copy'){
                
                const cardRId:string = Math.random().toString(36).substr(2);
                const cardSetting:cardResource = {
                    id:cardRId,
                    resourceid:rdata.id,
                    position,
                    rotate:0,
                    width:self.setting.width,
                    height:null,
                    zIndex:1
                }
                activeDom = self.drawOneResource(cardSetting)      
                cardSetting.height = $(activeDom).height();     
                self.data.push(cardSetting);
            }else{
                const rItem:resourceItem = _.find(self.cardDom,c => c.cardRId == rdata.cardRId);
                const rSetting:cardResource = _.find(self.data,c => c.id == rdata.cardRId);
                rSetting.position.y += e.pageY - rdata.posStart.y;
                rSetting.position.x += e.pageX - rdata.posStart.x;
                rItem.updated(rSetting);
                activeDom = rItem.elem;
            }
            self.chooseRes(activeDom);
            $(self.elem).find('.drophere').hide();
            self.pagesort.updatePage(self.pageid,self.data)
        })
    }
}

export default desktop;