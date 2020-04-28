import { Module } from 'vuex'
import { SettingModel } from './type'
import { RootState } from '../types'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'

const state: SettingModel = {
  settingResId:null
}
const namespaced = true
export const setting: Module<SettingModel, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
export default state