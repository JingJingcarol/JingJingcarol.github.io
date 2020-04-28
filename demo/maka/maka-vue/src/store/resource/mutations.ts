import { MutationTree } from 'vuex'
import { ResourceState } from './type'

export const mutations: MutationTree<ResourceState> = {
  setResources(state,resources){
    state.resourceCollection = resources
  },
  setTypes(state,types){
    state.types = types;
  },
  setCurrentType(state,currentType){
    state.currentType = currentType;
    state.resources = state.resourceCollection.getResourceByType(currentType);
  }
}