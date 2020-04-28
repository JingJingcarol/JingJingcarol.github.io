import { ResourceCollection, ResourceModel } from "../../models/resource";

const resourceCollect = new ResourceCollection();

interface resourceAction {
    type:string,
    resTyle:string
}

function getResById(id:string):ResourceModel {
    return resourceCollect.get(id);
}

function setCurrentType(type:string):resourceAction{
    return {
        type:type,
        resTyle:type
    }
}

export {
    resourceAction,
    resourceCollect,
    getResById,
    setCurrentType
}