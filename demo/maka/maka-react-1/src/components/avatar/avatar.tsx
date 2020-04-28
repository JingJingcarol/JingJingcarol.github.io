import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch } from 'redux';

import { UserModel } from "../../models/user";
import { setCurrentUser, setUserAction } from "../../store/action/user"
import { UserState } from "../../interfaces/store"

interface AvaProps {
    currentUser:UserModel,
    setCurrentUser(id:string):setUserAction
}
function Avatar(props:AvaProps){
    
    // React.useEffect(()=>{
    //     console.log(props)
    // },[])
    return (
        <div className="g-avatar">
            <img src={props.currentUser.avatar}/>
        </div>
    )
}

const mapStateToProps = (state: UserState): { currentUser: UserModel } => ({
    currentUser:state.currentUser
})

// 将 对应action 插入到组件的 props 中
const mapDispatchToProps = (dispatch: Dispatch,ownProps) => ({
    setCurrentUser: () => dispatch(setCurrentUser(ownProps.id)),
})

const AvatarCom = connect(mapStateToProps, mapDispatchToProps)(Avatar);
export default AvatarCom;