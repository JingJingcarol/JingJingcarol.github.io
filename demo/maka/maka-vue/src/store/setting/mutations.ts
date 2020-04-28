import { MutationTree } from 'vuex'
import { SettingModel } from './type'

export const mutations: MutationTree<SettingModel> = {
  setSetting(state,setting){
    state.settingResId = setting;
  }
}