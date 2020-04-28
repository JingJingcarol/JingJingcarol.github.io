import { MutationTree } from 'vuex'
import { CardState } from './type'
import { CardModel } from '@/src/models/card'
import _ from 'underscore';

function comSetCurrentPage(state,page){
  state.currentPage = page
}
function comAddPage(state,sort){
  state.pages.push(new CardModel({
    id:Math.random().toString(36).substr(2),
    resourseList:[],
    name:'new page',
    sort:sort
  }))
}
export const mutations: MutationTree<CardState> = {
  setPages(state,pages){
    state.pages = pages
  },
  setCurrentPage(state,page){
    comSetCurrentPage(state,page)
  },
  addPage(state,sort){
    comAddPage(state,sort)
  },
  delPage(state,pageid){
    const index = _.findIndex(state.pages,c => c.id == pageid);
    state.pages = _.without(state.pages,state.pages[index]);
    if(state.pages[index-1]){
      comSetCurrentPage(state,state.pages[index-1])
     
    }else if(state.pages[index]){
      comSetCurrentPage(state,state.pages[index])
     
    }else{
      comAddPage(state,0)
      comSetCurrentPage(state,state.pages[0])
    }
  },
  changeOneSort(state,{id,sort}){
    const index = _.findIndex(state.pages,c => c.id == id);
    state.pages[index].sort = sort;
  },
  addResOnCurrent(state,cardRes){
    state.currentPage.resourseList.push(cardRes)
  },
  changeResOnCurrent(state,{id,cardRes}){
    const index = _.findIndex(state.currentPage.resourseList,c => c.id == id);
    _.extend(state.currentPage.resourseList[index],cardRes);
  },
  setEditResOnCurrent(state,id){
    state.editResource = id;
  },
  arrowEditResOnCurrent(state,type){
    const resourseList = state.currentPage.resourseList;
    const index = _.findIndex(resourseList,c => c.id == state.editResource);
    const edit = resourseList[index];
    resourseList.splice(index,1);
    switch(type){
      case 'up':
        resourseList.splice(index + 1,0,edit)
        break;
      case 'down':
        resourseList.splice(index - 1,0,edit)
        break;
      case 'top':
        resourseList.push(edit);
        break;
      case 'bottom':
        resourseList.unshift(edit)
        break;
    }
  },
  delEditResOnCurrent(state,cardRes){
    state.currentPage.resourseList = _.without(state.currentPage.resourseList,cardRes)
  }
}