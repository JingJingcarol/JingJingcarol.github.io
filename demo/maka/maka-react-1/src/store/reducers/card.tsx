import _ from 'underscore';
import { CardModel } from "../../models/card";
import { cardCollect, pageAction, getPageById,changeResOnCurrent,addResOnCurrent, setPages, getPages } from "../action/card";


// cardCollect.getlist();
function  pages(state:CardModel [],action:pageAction):Promise<CardModel[]>{
    // const list = state && state.length > 0 ?  state : cardCollect.list ?  cardCollect.list : [];
    // console.log(action)
    // const currentpageIndex = _.findIndex(list,l => l.id == action.page)
    // console.log(list[currentpageIndex])
    // if(currentpageIndex){
    //     todoaction(list[currentpageIndex],action)
    // }
    // console.log(list[currentpageIndex])
    // return list;
    return cardCollect.getlist();
}

function currentPage(state:CardModel | null,action:pageAction):CardModel| null{
    const currentpagedata = getPageById(action.page) || null
    console.log(action)
    todoaction(currentpagedata,action)
    console.log(currentpagedata)
    return currentpagedata
}
function pageid(state:string,action:pageAction):string{
    return action.page || state || null
}
function realPages():CardModel[]{
    return getPages();
}
function todoaction(currentpage:CardModel,action:pageAction){
    if(action.type == 'changeOneRes'){
        changeResOnCurrent(currentpage,action.crid,action.crdata)
    }else if(action.type == 'addRes'){
        addResOnCurrent(currentpage,action.crdata)
    }else if(action.type == 'initPage'){
        setPages(cardCollect.list)
    }
}
export {
    pageid,
    realPages,
    pages,
    
    currentPage
}