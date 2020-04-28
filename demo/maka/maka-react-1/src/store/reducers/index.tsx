import { combineReducers } from 'redux'
import currentUser from './user'
import { pageid,pages,currentPage,realPages } from './card';
import {types,resources,currentType} from './resource'


// const reducers = combineReducers({
//     currentUser,
//     pages,
//     currentPage,
//     types,
//     resources,
//     currentType
//  });
const userReducer = combineReducers({
    currentUser
})
const cardReducer = combineReducers({
    pageid,
    pages,
    
    currentPage,
    realPages,
})
const resourceRedecer = combineReducers({
    types,
    resources,
    currentType
})
// export default reducers;

export {
    userReducer,
    cardReducer,
    resourceRedecer
}