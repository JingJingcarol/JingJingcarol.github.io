import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider } from 'react-redux';

import "./css/global.css";
import {
    userStore,
    cardStore,
    resourceStore
} from './store'

import { Nav,Sortlist, Taggroup,ResourceList,DeskTop} from './components';


const App = () => {
    return (
        <>
        <Provider store={ userStore }>
            <Nav/>
        </Provider>
        
        <div className="main">
            <div className="left">
                <Provider store={ cardStore }>
                    <Sortlist/>
                </Provider>
                <div className="list-btns">
                    <button className="g-btn" id="save">保存</button>
                </div>
            </div>
            <div className="content">
                <div className="contentbox">
                    <div className="mark"></div>
                    <Provider store={ cardStore }>
                        <DeskTop />
                    </Provider>
                    
                </div>
            </div>
            <div className="right">   
                <Provider store={ resourceStore }>
                    <Taggroup/>
                    <div className="resourcebox"> 
                        <ResourceList />   
                    </div>
                </Provider>
            </div>
        </div>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));