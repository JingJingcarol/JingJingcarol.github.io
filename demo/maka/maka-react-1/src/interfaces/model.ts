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
    zIndex:number
}

export {
    baseModel,
    collection,
    cardResource
}