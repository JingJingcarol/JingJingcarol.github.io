<template>
    <ResourceItem 
        :resdata="getResourceById(resource.resourceid)"
        :editable="true"
        :setting="realsetting"
        :class="{active:editResource == resource.id}"
        @resdragstart="onresdragstart"
        @resdrag="onresdrag"
        @resdragend="onresdragend"
        @resclick="onresclick"
        @resremove="onresremove"
    ></ResourceItem>
</template>

<script lang="ts">
import { Component, Vue ,Prop} from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';

import { cardResource } from '../interfaces/model'
import { ResourceModel,ResourceCollection } from "../models/resource"

import ResourceItem from './resourceItem.vue'

const resourceModule = namespace('resource')
const cardModule = namespace('card')

@Component({
    components:{
        ResourceItem
    }
})
export default class editResourceItem extends Vue {
    @cardModule.State('editResource') editResource:string;
    @cardModule.Mutation('setEditResOnCurrent') setEditResOnCurrent!:Function;
    @cardModule.Mutation('delEditResOnCurrent') delEditResOnCurrent!:Function;

    @resourceModule.State('resourceCollection') resourceCollection:ResourceCollection;
    @Prop() resource:cardResource
    @Prop() dragable:boolean

    translate = {
        x:0,
        y:0
    }
    get zindex():number{
        return this.editResource == this.resource.id ? 2 : 1
    }
    get realsetting(){
        return {
            translate:this.translate,
            ...this.resource,
            zIndex:this.zindex,
        }
    }

    getResourceById(id:string):ResourceModel{
        return this.resourceCollection.get(id)
    }

    onresdragstart(e:DragEvent){
        e.dataTransfer.setData('type','self');
        this.setEditResOnCurrent(this.resource.id)
    }
    onresdrag(e:DragEvent,posStart){
        if(!this.dragable){
            return
        }
        const left = e.pageX - posStart.x;
        const top = e.pageY - posStart.y;
        this.translate = {
            x:left,
            y:top
        }
    }
    onresdragend(e:DragEvent){
        if(!this.dragable){
            return
        }
        this.translate = {
            x:0,
            y:0
        }
    }
    onresclick(e:MouseEvent){
        if(!this.dragable){
            return
        }
        this.setEditResOnCurrent(this.resource.id)
        
    }
    onresremove(e:MouseEvent){
        this.delEditResOnCurrent(this.resource)
    }
}
</script>