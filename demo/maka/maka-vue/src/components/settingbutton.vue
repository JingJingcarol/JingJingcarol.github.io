<template>
    <div class="setting-item-col">
        <button :disabled="disabled" @click="onclick" v-html="item.name"></button>
    </div>
</template>

<script lang="ts">
import { Component, Vue,Prop } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';
import { settingItemType } from "../interfaces/model";

@Component
export default class SettingButton extends Vue {
    @Prop() item:settingItemType;
    @Prop() disabled:boolean;

    onclick(){
        this.$emit('action')
    }
    
}
</script>
<style scoped>
.setting-box .setting-item-col button{
    margin: auto;
    cursor: pointer;
}
.setting-box .setting-item-col button:disabled{
    opacity: .5;
}
</style>