import { UserModel,UserCollection } from "../../models/user";

const userCollect = new UserCollection()
function getUserById(id:string):UserModel {
    return userCollect.get(id);
}

interface setUserAction {
    type:string,
    userid:string
}
function setCurrentUser(id:string):setUserAction{
    return {
        type:id,
        userid:id
    }
}
export {
    getUserById,
    setUserAction,
    setCurrentUser
}