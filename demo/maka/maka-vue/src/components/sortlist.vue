<template>
    <div class="sortlist-box">
        <div 
            v-for="(page,index) in sortPages" 
            :key="page.id" class="sortlist" 
            :class="{active:currentPage && currentPage.id==page.id}" 
            @click="colCurrent(page)"
        >
            <div class="card">
                <DeskTop :contentPage="page"></DeskTop>
            </div>
            <div class="name">{{page.name}}</div>
            <div class="tool">
                <span class="add" title="添加" @click.stop="add(index)">+</span>
                <span class="arrawup" title="上移" @click.stop="arraw(page.id,index)">↑</span>
                <span class="arrawdown" title="下移" @click.stop="arraw(page.id,index,true)">↓</span>
                <span class="remove" title="删除" @click.stop="remove(page.id)">✕</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';
import { CardModel } from '../models/card'
import _ from 'underscore';

import DeskTop from './desktop.vue'

const cardModule = namespace('card')

@Component({
    components:{
        DeskTop
    }
})
export default class Sortlist extends Vue {
    @cardModule.State('pages') pages:CardModel[];
    @cardModule.State('currentPage') currentPage:CardModel;

    @cardModule.Mutation('addPage') addPage!:Function;
    @cardModule.Mutation('setCurrentPage') setCurrentPage!:Function;
    @cardModule.Mutation('changeOneSort') changeOneSort!:Function;
    @cardModule.Mutation('delPage') delPage!:Function;
    
    get sortPages():CardModel[]{
        return _.sortBy(this.pages,'sort')
    }
    colCurrent(page:CardModel){
        this.setCurrentPage(page)
    }
    add(index:number){
        const sort = this.calSort(index,index+1)
        this.addPage(sort)
    }
    arraw(id:string,index:number,next?:boolean){
        const curindex = next ? index + 1 : index - 1
        const nextInt = next ? index + 2 : index - 2;
        const sort = this.calSort(curindex,nextInt,!next)
        this.changeOneSort({id,sort})
    }
    calSort(id:number,next:number,prev?:boolean):number{
        const currentdata:CardModel = this.pages[id];
        const nextdata:CardModel = this.pages[next];
        const currentSort:number = currentdata.sort;
        const nextSort:number = nextdata ? nextdata.sort : prev ? currentSort - 2 : currentSort + 2;
        return (currentSort + nextSort) / 2;

    }
    remove(id){
        this.delPage(id)
    }
}
</script>
<style scoped>
.sortlist-box{
    flex:1 1 auto;
    overflow: auto;
}
.sortlist{
    padding: 1rem;
    text-align: center;
    margin: 0.5rem;
    position: relative;
}
.sortlist.active{
    border:2px solid var(--maincolor)
}
.sortlist .card{
    width: 93.75px;
    height:166.75px;
    box-shadow: 0 0 8px #ccc;
    margin: 0.5px 0;
    overflow: hidden;
}
.sortlist .card  .desktop{
    transform: scale(0.25);
    transform-origin: top left;
}
.sortlist .name{
    cursor: text;
}
.tool{
    position: absolute;
    left: 0;
    top: 0;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;  
    z-index: 10;
    pointer-events: none;
}
.tool span{
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    background: var(--maincolor);
    border-radius: 50%;
    color: #fff;
    line-height: 1.5rem;
    margin: 0.2rem;
    cursor: pointer;
    pointer-events: all;
}
.sortlist:hover .tool{
    display: flex;
}
.sortlist:first-child .arrawup,.sortlist:last-child .arrawdown{
    display: none;
}

</style>