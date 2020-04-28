import { MutationTree } from 'vuex'
import { UserState } from './type'

export const mutations: MutationTree<UserState> = {
  saveUserInfo(state, userInfo) {
    state = Object.assign(state, userInfo)
  },
  setCurrentUser(state,currentUser){
    state.currentUser = currentUser
  }
}