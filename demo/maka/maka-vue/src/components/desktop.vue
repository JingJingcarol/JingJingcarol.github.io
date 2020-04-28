<template>
    <div class="desktop" @dragover="ondragover($event)"  @drop="ondrop($event)" ref="desk" :style="sizestyle">
        <div class="drophere" v-show="showHere">拖放到这里</div>
        <div class="desktop-box" v-if="contentPage">
            <editResourceItem 
                v-for="resource in contentPage.resourseList" 
                :key="resource.id" 
                :resource = "resource"
                :dragable = "dragable"
            ></editResourceItem>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue,Prop } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';
import _ from 'underscore';

import { CardModel } from '../models/card'
import { cardResource } from '../interfaces/model'

import editResourceItem from './editresourceitem.vue'



const cardModule = namespace('card')


@Component({
    components:{
        editResourceItem
    }
})
export default class DeskTop extends Vue {
    @cardModule.Mutation('addResOnCurrent') addResOnCurrent!:Function;
    @cardModule.Mutation('changeResOnCurrent') changeResOnCurrent!:Function;

    @Prop() contentPage:CardModel;
    @Prop() dragable:boolean;

    showHere:boolean = false;
    setting = {
        width:375,
        height:667
    }
    get sizestyle(){
        return `width:${this.setting.width}px;height:${this.setting.height}px`
    }
    ondragover(e:DragEvent){
        e.preventDefault();
        this.showHere = true;
    }
    
    ondrop(e:DragEvent){
        this.showHere = false;
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
        const desk:any = this.$refs.desk;
        const top:number = e.pageY - desk.offsetTop;
        const left:number = e.pageX - desk.offsetLeft - this.setting.width / 2;
        const position = {
            x:left,
            y:top
        }
        if(type == 'self'){
            const rSetting:cardResource = _.find(this.contentPage.resourseList,c => c.id == rdata.cardRId);
            rSetting.position.y += e.pageY - rdata.posStart.y;
            rSetting.position.x += e.pageX - rdata.posStart.x;
            this.changeResOnCurrent({
                id:rdata.cardRId,
                cardRes:rSetting
            })
        }else{
            const cardRId:string = Math.random().toString(36).substr(2);
            const cardSetting:cardResource = {
                id:cardRId,
                resourceid:rdata.id,
                position,
                rotate:0,
                width:this.setting.width,
                height:null,
                zIndex:1
            }
            this.addResOnCurrent(cardSetting)
        }
    }
    
}
</script>
<style scoped>
.desktop{
    box-shadow: 0 0 10px #aaa;
    background: #fff;
    margin: auto;
    position: relative;
}
.drophere{
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px dashed;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,.3);
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    z-index: 1000;
    pointer-events: none;
}

</style>