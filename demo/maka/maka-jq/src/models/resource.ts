import _ from 'underscore';
import { baseModel } from "../interfaces/model";
import { baseCollect } from "./base";
import * as resourceData from './resourceList.json';

class ResourceModel implements baseModel{
    id:string;
    name:string;
    type:string;
    url:string;
}

class ResourceCollection extends baseCollect<ResourceModel>{
    listByType:{
        [key: string]:ResourceModel[]
    };
    constructor(){
        super();
        const self = this;
        self.list = [];
        resourceData.list.forEach(resource => {
            self.list.push({
                url:`/img/resource/${resource.type}/${resource.name}`,
                ...resource
            })
        });
        self.listByType = _.groupBy(this.list, 'type');
    }
    getTypes(){
        return _.keys(this.listByType);
    }
    getResourceByType(type:string){
        return this.listByType[type]
    }
}

export {
    ResourceModel,
    ResourceCollection
}