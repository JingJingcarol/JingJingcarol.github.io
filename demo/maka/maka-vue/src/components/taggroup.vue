<template>
    <div class="taggroup">
        <div class="taggroup-box">
            <div class="taggroup-item" 
                v-for="type in types" 
                :key="type" 
                :class="{active:currentType==type}" 
                @click="colType(type)"
            >{{type}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';

const resourceModule = namespace('resource')

@Component
export default class TagGroup extends Vue {
   @resourceModule.State('types') types:string[];
   @resourceModule.State('currentType') currentType:string[];

   @resourceModule.Mutation('setCurrentType') setCurrentType!:Function;
   
   colType(type){
       this.setCurrentType(type)
   }
}
</script>
<style scoped>
.taggroup{
    
    overflow: auto;
    min-height: 3rem;
}
.taggroup-box{
    display: flex;
    line-height: 2;
    border-bottom: 1px solid #ccc;
    padding: 0 0.5rem;
}
.taggroup-item{
    padding: 0 1rem;
    border: 1px solid #ccc;
    border-radius: 4px 4px 0 0;
    margin: 0.5rem -1px 0px;
    border-bottom: 0;
    background: #fff;
    white-space: nowrap;
}
.taggroup-item.active{
    transform: scale(1.2);
    transform-origin: bottom right;
    margin-bottom: -1px;
    margin-left: 0.5rem;
    color: var(--maincolor);
    border-color: var(--maincolor);
}
</style>