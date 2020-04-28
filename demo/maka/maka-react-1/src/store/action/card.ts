import _ from 'underscore';
import { CardCollection,CardModel } from "../../models/card";

import { cardResource } from '../../interfaces/model';

const cardCollect = new CardCollection();

let pages:CardModel[] = [];

interface pageAction {
    type:string,
    page:string,
    crid?:string,
    crdata?:cardResource
}
function setPages(realpages:CardModel[]){
    pages = realpages;
}
function getPages():CardModel[]{
    return pages;
}
function getPageById(id:string):CardModel {
    // return cardCollect.get(id);
    return _.find(pages,(p:CardModel) => p.id == id)
}

function setCurrentPage(id:string):pageAction{
    return {
        type:id,
        page:id
    }
}

function changeResOnCurrent(page:CardModel,id:string,cardRes:cardResource){
    const index = _.findIndex(page.resourseList,c => c.id == id);
    _.extend(page.resourseList[index],cardRes);
}
function addResOnCurrent(page:CardModel,cardRes:cardResource){
    page.resourseList.push(cardRes)
}
export {
    pageAction,
    cardCollect,
    getPages,
    setPages,
    getPageById,
    setCurrentPage,
    changeResOnCurrent,
    addResOnCurrent
}