import _ from 'underscore'
interface typeAction {
    type?:string,
    userid?:string,
    pageid?:string,
    resType?:string
}

function setActionOpt(opt:{type?:string,userid?:string,pageid?:string,resType?:string}):typeAction{
    const {type = 'reduxaction',userid,pageid,resType} = opt;
    if(!this.actionType){
        this.actionType = {}
    }
    this.actionType = _.extends(this.actionType,{
        type,
        userid,
        pageid,
        resType
    })
    return this.actionType
}

export {
    setActionOpt
}