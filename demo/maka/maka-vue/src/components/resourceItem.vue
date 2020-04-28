<template>
    <div class="resource-item" 
        :class="classList" 
        draggable="true" 
        :style="realStyle" 
        @dragstart="ondragstart($event)" 
        @drag="ondrag($event)"
        @dragend="ondragend($event)"
        @click="onclick($event)"
    > 
       <img :src="resdata.url" alt="">
       <span class="remove" v-if="editable" @click="remove($event)">✕</span>
    </div>
</template>

<script lang="ts">
import { Component, Vue,Prop } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';

import { cardResource } from '../interfaces/model'
import { ResourceModel} from '../models/resource'

interface position {
    x:number,
    y:number
}

@Component
export default class ResourceItem extends Vue {
    @Prop() resdata:ResourceModel;
    @Prop() editable:boolean;
    @Prop() classList:string;
    @Prop() setting:cardResource;

    posStart:position = {
        x:0,
        y:0
    }
    get realStyle(){
        return this.setting ? 
        `
            top:${this.setting.position.y}px;
            left:${this.setting.position.x}px;
            width:${this.setting.width}px;
            height:${this.setting.height}px;
            transform:rotate(${this.setting.rotate}deg) translate(${this.setting.translate.x}px,${this.setting.translate.y}px);
            z-index:${this.setting.zIndex}
        ` : ''
    }
    ondragstart(e:DragEvent){
        this.posStart = {
            x:e.pageX,
            y:e.pageY
        }
        e.dataTransfer.setData("text",JSON.stringify({id:this.resdata.id,cardRId:this.setting && this.setting.id,posStart:this.posStart}));
        e.dataTransfer.effectAllowed = "move";
        this.$emit('resdragstart',e);
    }
    ondrag(e:DragEvent){
        this.$emit('resdrag',e,this.posStart)
    }
    ondragend(e:DragEvent){
        this.$emit('resdragend',e,this.posStart)
    }
    onclick(e:MouseEvent){
        this.$emit('resclick',e)
    }
    remove(e:MouseEvent){
        this.$emit('resremove',e)
    }
}
</script>
<style scoped>
.resource-item img{
    max-width: 100%;
    max-height:100%;
    box-shadow: 0 0 4px #ccc;
}
.desktop .resource-item{
    width: 100%;
    position: absolute;
    text-align: center;
    cursor: grabbing;
}
.desktop .resource-item img{
    box-shadow: none;
    display: block;
    height: 100%;
    width: 100%;
    /* pointer-events: none; */
}
.desktop .resource-item.active{
    border:1px solid var(--maincolor)
}

.desktop .resource-item .remove{
    position: absolute;
    background: #999;
    width: 1.2rem;
    height: 1.2rem;
    font-size: 0.5rem;
    color: #fff;
    border-radius: 50%;
    line-height: 1.2rem;
    top: -0.6rem;
    right: -0.6rem;
    display: none;
    cursor: pointer;
    z-index: 1000;
}
.desktop .resource-item.active .remove{
    display: block;
}
</style>