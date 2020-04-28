import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import { user } from './user'
import { card } from './card'
import { resource } from './resource'
import { setting } from './setting'

Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })
const store: StoreOptions<RootState> = {
  modules: {
    user,
    card,
    resource,
    setting
  }
}
export default new Vuex.Store<RootState>(store)
