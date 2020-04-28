import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch } from 'redux';

import './resourcelist.css'
import { ResourceState } from '../../interfaces/store';
import { ResourceModel } from '../../models/resource';
import { cardResource } from '../../interfaces/model';

interface resourcelistProp {
    resources:ResourceModel[]
}

function resourceList(props){
    let [resourceItem,setresourceItem] = React.useState([]);
    const dragStartHandler = React.useCallback((e:React.DragEvent<HTMLDivElement>,r:cardResource) => {
        const posStart = {
            x:e.pageX,
            y:e.pageY
        }
        e.dataTransfer.setData("text",JSON.stringify({id:r.id,posStart}));
        e.dataTransfer.effectAllowed = "move";
    },[props.resources])
    React.useEffect(()=>{
        
        setresourceItem(props.resources && props.resources.map(r => (
            <div className="resource-item g-col-6" draggable="true" key={r.id} onDragStart={(e)=>{
                dragStartHandler(e,r)
            }}>
                <img src={r.url} alt="" />
            </div>
        )))
    },[props.resources])
    return (
        <div className="g-row resource-list">
            {resourceItem}
        </div>
    )
}

const mapStateToProps = (state: ResourceState): { resources: ResourceModel[]} => ({
    resources:state.resources
})

// 将 对应action 插入到组件的 props 中
const mapDispatchToProps = (dispatch: Dispatch,ownProps) => ({
})

const resourceCom = connect(mapStateToProps, mapDispatchToProps)(resourceList);

export default resourceCom;

