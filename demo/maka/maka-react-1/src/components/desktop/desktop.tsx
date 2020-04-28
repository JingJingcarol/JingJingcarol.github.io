import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch } from 'redux';
import _ from 'underscore'

import './desktop.css'
import { CardState } from '../../interfaces/store';
import { cardResource } from '../../interfaces/model';
import { resourceCollect} from "../../store/action/resource";
import { pageAction } from '../../store/action/card';

interface desktopProp {
    pageid:string,
    resources:cardResource[],
    changeResOnCurrent?(pageid:string,id:string,cardRes:cardResource):pageAction,
    addResOnCurrent?(pageid:string,cardRes:cardResource):pageAction
}

interface editResourceItem {
    resource:cardResource
}
function EditResourceItem(props:editResourceItem){
    const oneResource = resourceCollect.get(props.resource.resourceid)
    let  [posStart,setPosStart] = React.useState({
        x:0,
        y:0
    })
    const [translate,setTranslate] = React.useState({
        x:0,
        y:0
    })
    function dragStartHandler(e:React.DragEvent<HTMLDivElement>){
        posStart = {
            x:e.pageX,
            y:e.pageY
        }
        e.dataTransfer.setData("text",JSON.stringify({id:props.resource.id,cardRId:props.resource.id,posStart}));
        e.dataTransfer.setData('type','self');
        e.dataTransfer.effectAllowed = "move";
    }
    function dragHandler(e:React.DragEvent<HTMLDivElement>){
        const left = e.pageX - posStart.x;
        const top = e.pageY - posStart.y;
        setTranslate({
            x:left,
            y:top
        })
    }
    function dragEndHandler(e:React.DragEvent<HTMLDivElement>){
        setTranslate({
            x:0,
            y:0
        })
    }
    return (
        <div className="resource-item" draggable="true" 
            key={props.resource.id} 
            onDragStart={dragStartHandler}
            onDrag={dragHandler}
            onDragEnd={dragEndHandler}
            style={{
                width:`${props.resource.width}px`,
                height:`${props.resource.height}px`,
                top:`${props.resource.position.y}px`,
                left:`${props.resource.position.x}px`,
                transform:`rotate(${props.resource.rotate}deg) translate(${translate.x}px,${translate.y}px)`
            }}
        >
            <img src={oneResource.url} alt="" />
            <span className="remove">✕</span>
        </div>
    )
}

function desktop(props:desktopProp){
    // let [resourceItem,setresourceItem] = React.useState([]);
    let [isdrop,setIsdrog]= React.useState(false);
    let setting ={
        width:375,
        height:667
    }
    const desk:any = React.useRef(null)
    // React.useEffect(()=>{
    //     setresourceItem(props.resources && props.resources.map(r => (
    //         <EditResourceItem resource={r} key={r.id}/>
    //     )))
    // },[props.resources])
    let resourceItem = props.resources && props.resources.map(r => (
        <EditResourceItem resource={r} key={r.id}/>
    ))
    function dragoverHandler(e:React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        setIsdrog(true);
    }
    function dropHandler(e:React.DragEvent<HTMLDivElement>){
        setIsdrog(false);
        const rid:string = e.dataTransfer.getData("text");
        const type:string = e.dataTransfer.getData("type");
        const rdata:{
            id:string,
            cardRId:string,
            posStart:{
                x:number,
                y:number
            }
        } =  JSON.parse(rid);
        const top:number = e.pageY - desk.current.offsetTop;
        const left:number = e.pageX - desk.current.offsetLeft - setting.width / 2;
        const position = {
            x:left,
            y:top
        }
        if(type == 'self'){
            const rSetting:cardResource = _.find(props.resources,c => c.id == rdata.cardRId);
            rSetting.position.y += e.pageY - rdata.posStart.y;
            rSetting.position.x += e.pageX - rdata.posStart.x;
            props.changeResOnCurrent(props.pageid,rdata.cardRId,rSetting)
        }else{
            const cardRId:string = Math.random().toString(36).substr(2);
            const cardSetting:cardResource = {
                id:cardRId,
                resourceid:rdata.id,
                position,
                rotate:0,
                width:setting.width,
                height:null,
                zIndex:1
            }
            props.addResOnCurrent(props.pageid,cardSetting)
        }
    }
    return (
        <div className="desktop" onDragOver={dragoverHandler} onDrop={dropHandler} ref={desk}>
            <div className="drophere" 
                style={isdrop?{display:'flex'}:{display:'none'}}
            >拖放到这里</div>
            <div className="desktop-box">
                { resourceItem }
            </div>
        </div>
    )
}

const mapStateToProps = (state: CardState): { pageid:string,resources: cardResource[]} => ({
    pageid:state.pageid,
    resources:state.currentPage && state.currentPage.resourseList
})

// 将 对应action 插入到组件的 props 中
const mapDispatchToProps = (dispatch: Dispatch,ownProps) => ({
    changeResOnCurrent:(pageid:string,id:string,cardRes:cardResource) => dispatch({type:'changeOneRes',crid:id,crdata:cardRes,page:pageid}),
    addResOnCurrent:(pageid:string,cardRes:cardResource) =>dispatch({type:'addRes',crdata:cardRes,page:pageid})
})

const desktopCom = connect(mapStateToProps, mapDispatchToProps)(desktop);

export default desktopCom;

export {
    desktop
}