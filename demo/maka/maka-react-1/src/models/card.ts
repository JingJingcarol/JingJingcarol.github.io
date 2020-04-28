import _ from 'underscore';
import * as localforage from "localforage"
import { baseModel,cardResource } from "../interfaces/model";
import { baseCollect } from "./base";



class CardModel implements baseModel {
    id:string;
    name:string;
    resourseList?:cardResource[];
    sort:number;
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.resourseList = data.resourseList;
        this.sort = data.sort;
    }
    setSort(sort:number):void{
        this.sort = sort;
    };
    setPosition(id:string,x:number,y:number):void{
        let one:cardResource = _.find(this.resourseList,(r:cardResource) => r.id == id)[0];
        if(x != undefined){
            one.position.x = x;
        } 
        if(y != undefined){
            one.position.y = y;
        }
    }
}

class CardCollection extends baseCollect<CardModel>{
    async getlist(){
        const self = this;
        await new Promise(succ => {
            localforage.getItem('MAkA-cards',function(err,val){
                if(val){
                    self.list = _.sortBy(val,'sort');
                }
                succ(val);
            });  
            
        })  
        return self.list;
            
    }
    save(data:CardModel[]){
        this.list = _.sortBy(data,'sort');
        localforage.setItem('MAkA-cards',data)
    }
}

export{
    CardModel,
    CardCollection
}