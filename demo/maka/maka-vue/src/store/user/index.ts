import { Module } from 'vuex'
import { UserState } from './type'
import { RootState } from '../types'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'

const state: UserState = {
  currentUser:null 
}
const namespaced = true
export const user: Module<UserState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
export default state