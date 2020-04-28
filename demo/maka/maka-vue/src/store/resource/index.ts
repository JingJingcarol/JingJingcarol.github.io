import { Module } from 'vuex'
import { ResourceState } from './type'
import { RootState } from '../types'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'

const state: ResourceState = {
  resourceCollection:null,
  resources:[],
  types:[],
  currentType:null
}
const namespaced = true
export const resource: Module<ResourceState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
export default state