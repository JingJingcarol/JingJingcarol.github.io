interface baseModel {
    id:string
}

interface collection<T>{
    list:T[];
    add(data:T):boolean | string;
    del(id:string):boolean | string;
    mod(id:string,data:T):boolean | string;
    get(id:string):T;
}

interface cardResource extends baseModel{
    resourceid:string;
    position:{
        x:number,
        y:number
    };
    rotate:number;
    width:number;
    height:number;
    zIndex:number;
    translate?:{
        x:number,
        y:number
    }
}

interface settingItemType {
    name?:string,
    key:string,
    type?:string,
    col?:number,
    defaultValue?:any,
    action?:Function
    value?:any
}

export {
    baseModel,
    collection,
    cardResource,
    settingItemType
}