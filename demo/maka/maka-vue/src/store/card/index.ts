import { Module } from 'vuex'
import { CardState } from './type'
import { RootState } from '../types'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { CardModel } from '@/src/models/card'

const state: CardState = {
  pages:[new CardModel({
    id:Math.random().toString(36).substr(2),
    name:'default',
    sort:0
  })],
  currentPage:null,
  editResource:null
}
const namespaced = true
export const card: Module<CardState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
export default state