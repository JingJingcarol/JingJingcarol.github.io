import { UserModel } from "../models/user";
import { CardModel } from "../models/card";
import { ResourceModel } from "../models/resource";

interface UserState {
    currentUser:UserModel
}

interface CardState {
    pageid:string,
    pages:Promise<CardModel[]>,
    currentPage:CardModel,
    realPages:CardModel[]
}

interface ResourceState {
    types:string[];
    resources:ResourceModel[];
    currentType:string
}
export {
    UserState,
    CardState,
    ResourceState
}