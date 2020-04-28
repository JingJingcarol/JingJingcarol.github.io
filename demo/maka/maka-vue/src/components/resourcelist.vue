<template>
    <div class="g-row resource-list">
       <ResourceItem v-for="resource in resources" :key="resource.id" :resdata="resource" classList="g-col-6"></ResourceItem>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';
import ResourceItem from './resourceItem.vue'
import { ResourceModel} from '../models/resource'

const resourceModule = namespace('resource')

@Component({
    components:{
        ResourceItem
    }
})
export default class ResourceList extends Vue {
    @resourceModule.State('resources') resources:ResourceModel[];
}
</script>
<style scoped>
.resource-list .resource-item{
    height: 10rem;
    padding: 0.5rem;
    text-align: center;
    cursor: grab;
}
</style>