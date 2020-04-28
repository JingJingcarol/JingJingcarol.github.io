import { UserModel } from "../../models/user";

import { getUserById,setUserAction } from "../action/user"

function currentUser(state:UserModel, action:setUserAction ): UserModel{
    const id = action.userid || 'user123456'
    return getUserById(id)
}

export default currentUser