<template>
    <div class="setting" :class="{open:isOpen}">
       <span class="fa fa-cog setting-open" title="展开/收起设置" @click="toggle"></span>
       <div class="setting-box">
           <div class="setting-item" v-for="(oneType,key) in setting" :key="key">
                <label>{{ key }}</label>
                <div class="g-row setting-item-row">
                    <div :class="`g-col-${item.col}`"  v-for="item in oneType" :key="item.key">
                        <SettingButton v-if="item.type=='button'" :item="item"  :disabled="!editResource" @action="item.action"></SettingButton>
                        <SettingItem  
                            v-else 
                            :item="item"  
                            :disabled="!editResource" 
                            :value="getResvalueByKey(item.key)" 
                            @change="onSettingChange"
                        ></SettingItem>
                    </div>
                    
                </div>
            </div>
       </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';
import _ from 'underscore';

import { settingItemType, cardResource } from "../interfaces/model";
import { CardModel } from '../models/card'

import SettingItem from "./settingitem.vue"
import SettingButton from "./settingbutton.vue"

const cardModule = namespace('card')

@Component({
    components:{
        SettingItem,
        SettingButton
    }
})
export default class Setting extends Vue {
    @cardModule.State('currentPage') currentPage:CardModel;
    @cardModule.State('editResource') editResource:string;
    @cardModule.Mutation('changeResOnCurrent') changeResOnCurrent!:Function;

    @Prop() setting:{
        [key:string]:settingItemType[]
    }

    isOpen:boolean = false

    get cardResource():cardResource{
        return this.currentPage && _.find(this.currentPage.resourseList,r => r.id == this.editResource);
    }
    toggle(){
        this.isOpen = !this.isOpen
    }
    getResvalueByKey(key){
        return this.cardResource && eval(`this.cardResource.${key}`)
    }

    onSettingChange(value,key){
        let newSetting = this.cardResource;
        eval(`newSetting.${key} = value`);
        this.changeResOnCurrent({
            id:this.editResource,
            cardRes:newSetting
        })
    }
}
</script>
<style scoped>
.setting{
    position: absolute;
    top: 3rem;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: flex-start;
    transform: translateX(15rem);
    transition: transform 0.5s;
}
.setting.open{
    transform: translateX(0);
}
.setting>.setting-open{
    background: #fafafa;
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    line-height: 1.5rem;
    text-align: center;
    border-radius: 0.8rem 0 0 0.8rem;
    cursor: pointer;
    -webkit-box-shadow: 0 0 4px #666;
    box-shadow: 0 0 4px #666;
    padding-left: 0.3rem;
}
.setting-box{
    background: #fafafa;
    padding: 0.5rem;
    box-shadow: 0 0 4px #666;
    width: 15rem;
}
.setting-box .setting-item-row{
    font-size: 0.8rem;
}
.setting-box .setting-item-col{
    display: flex;
    padding: 0.5rem 0;
    text-align: center;
}

</style>