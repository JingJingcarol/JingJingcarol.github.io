import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'

import {
    userReducer,
    cardReducer,
    resourceRedecer
} from './reducers'; 
const userStore = createStore(userReducer, composeWithDevTools())
const cardStore = createStore(cardReducer, composeWithDevTools())
const resourceStore = createStore(resourceRedecer, composeWithDevTools())
export {
    userStore,
    cardStore,
    resourceStore
} 