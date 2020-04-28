import { CardModel } from "../../models/card";
import { resourceCollect, resourceAction, getResById } from "../action/resource";
import { ResourceModel } from "../../models/resource";

function  types():string[]{
    return resourceCollect.getTypes()
}
function resources(state:ResourceModel[],action:resourceAction):ResourceModel[]{
    const type = action.resTyle || resourceCollect.getTypes()[0] ;
    return resourceCollect.getResourceByType(type);
}
function currentType(state:string | null,action:resourceAction):string| null{
    return action.resTyle || resourceCollect.getTypes()[0] 
}
export {
    types,
    resources,
    currentType
}