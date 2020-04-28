import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch } from 'redux';

import './sortlist.css';

import { CardModel } from '../../models/card'
import { CardState } from '../../interfaces/store';
import { setCurrentPage, pageAction } from '../../store/action/card';

import { desktop as Desktop } from '../desktop/desktop'

interface SortProp {
    pages:Promise<CardModel[]>
    currentPage:CardModel
    realPages:CardModel[]
    setCurrentPage(id:string):pageAction
    setPages():pageAction
}
interface SortItemProp {
    page:CardModel
    current:boolean
    setCurrentPage(id:string):pageAction
}
function SortListItem(props:SortItemProp){
    const page = props.page;
    return (
        <div className="sortlist" 
            data-active={props.current} 
            onClick={() => {
                props.setCurrentPage(page.id)
            }}
        >
            <div className="card">
                <Desktop resources={page.resourseList} pageid={page.id}/>
            </div>
            <div className="name">{page.name}</div>
            <div className="tool">
                <span className="add" title="添加" >+</span>
                <span className="arrawup" title="上移" >↑</span>
                <span className="arrawdown" title="下移" >↓</span>
                <span className="remove" title="删除" >✕</span>
            </div>
        </div>
    )
}
function Sortlist(props:SortProp){
    // const [pages,setPages] = React.useState([])
    React.useEffect(()=>{
        
        if(props.realPages && props.realPages.length > 0){
            return
        }
        props.pages.then((val)=>{
            props.setPages();
        // if(props.pages.length > 0){
            // setPages(props.pages)
            props.setCurrentPage(val[0].id)
            console.log(props);
        // }
            
        })
    },[props.pages])
    // let [pageItem,setpageItem] = React.useState([]);
    // React.useEffect(()=>{
    //     setpageItem(props.realPages && props.realPages.map(page => 
    //         <SortListItem page={page} key={page.id} current={props.currentPage && props.currentPage.id == page.id} setCurrentPage={props.setCurrentPage} />
    //     ))
    // })
    const pageItem = props.realPages && props.realPages.map(page => 
        <SortListItem page={page} key={page.id} current={props.currentPage && props.currentPage.id == page.id} setCurrentPage={props.setCurrentPage} />
    )
    return (
        <div className="sortlist-box">
            {pageItem}
        </div>
    )
}

const mapStateToProps = (state: CardState): { currentPage: CardModel,pages:Promise<CardModel[]> ,realPages:CardModel[]} => ({
    realPages:state.realPages,
    currentPage:state.currentPage,
    pages:state.pages
})

// 将 对应action 插入到组件的 props 中
const mapDispatchToProps = (dispatch: Dispatch,ownProps) => ({
    setCurrentPage: (id:string) => dispatch(setCurrentPage(id)),
    setPages:() => dispatch({type:'initPage'})
})

const SortCom = connect(mapStateToProps, mapDispatchToProps)(Sortlist);

export default SortCom;