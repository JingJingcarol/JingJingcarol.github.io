import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch } from 'redux';
import { ResourceState } from '../../interfaces/store';
import { setCurrentType } from '../../store/action/resource';

import './taggroup.css';

interface taggroupProp {
    tags:string[],
    currentTag:string,
    setCurrentTag(tag:string)
}
function taggroup(props:taggroupProp){
    let [tagItem,settagItem] = React.useState([]);
    
    React.useEffect(()=>{
        settagItem(props.tags.map(t => 
            <div 
                className="taggroup-item" 
                key={t} 
                data-active={props.currentTag == t}
                onClick={() => {
                    props.setCurrentTag(t)
                }}
            >{t}</div>
        ))
    },[props.currentTag])
    return (
        <div className="taggroup">
            <div className="taggroup-box">{tagItem}</div>
        </div>
    )
}

const mapStateToProps = (state: ResourceState): { tags: string[],currentTag:string } => ({
    tags:state.types,
    currentTag:state.currentType
})

// 将 对应action 插入到组件的 props 中
const mapDispatchToProps = (dispatch: Dispatch,ownProps) => ({
    setCurrentTag: (type:string) => dispatch(setCurrentType(type)),
})

const taggroupCom = connect(mapStateToProps, mapDispatchToProps)(taggroup);

export default taggroupCom;