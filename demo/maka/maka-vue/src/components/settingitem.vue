<template>
    <div class="setting-item-col">
        <label :for="item.key">{{ item.name }}</label>
        <input :type="item.type" v-model="currentValue" :disabled="disabled">
    </div>
</template>

<script lang="ts">
import { Component, Vue,Prop } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';
import { settingItemType } from "../interfaces/model";

@Component
export default class SettingItem extends Vue {
    @Prop() item:settingItemType;
    @Prop() value:number | string;
    @Prop() disabled:boolean;

    get currentValue():number | string{
        return this.value || this.item.defaultValue
    };
    set currentValue(value){
        this.$emit('change',Number(value),this.item.key)
    }
    
}
</script>
<style scoped>
.setting-box .setting-item-col label{
    white-space: nowrap;
    margin: 0 0.5rem;
}
.setting-box .setting-item-col input{
    border: 1px solid #ccc;
    max-width: 100%;
    min-width: 0px;
    border-radius: 2px;
}
.setting-box .setting-item-col input:disabled{
    opacity: .5;
}
</style>