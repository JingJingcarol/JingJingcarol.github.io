import _ from 'underscore';
import { collection, baseModel } from "../interfaces/model";

class baseCollect<T> implements collection<T>{
    list:T[];
    get(id:string){
        return _.find(this.list,l => l.id == id);
    }
    add(data:T){
        this.list.push(data);
        return true;
    }
    del(id:string){
        this.list = _.without(this.list,_.find(this.list,l => l.id == id));
        return true
    }
    mod(id:string,data:T){
        this.list[_.findIndex(this.list,l => l.id == id)] = data;
        return true;
    }
}
export {
    baseCollect
}