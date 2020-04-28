<template>
  <div id="root">
    <Nav></Nav>
    <div class="main">
      <div class="left">
        <Sortlist></Sortlist>
        <div class="list-btns">
          <button class="g-btn" id="save" @click="save">保存</button>
        </div>
      </div>
      <div class="content">
        <div class="contentbox">
          <div class="mark"></div>
          <DeskTop :contentPage="currentPage" :dragable="true"></DeskTop>
        </div>
        <Setting :setting="settingopt"></Setting>
      </div>
      <div class="right">
        <TagGroup></TagGroup>
        <div class="resourcebox">
          <ResourceList></ResourceList>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';
import { success }from 'toastr';

import Nav from './components/nav.vue';
import Sortlist from './components/sortlist.vue'
import TagGroup from './components/taggroup.vue'
import ResourceList from './components/resourcelist.vue'
import DeskTop from './components/desktop.vue'
import Setting from './components/setting.vue'

import { UserCollection } from './models/user';
import { CardCollection,CardModel } from './models/card';
import { ResourceCollection } from './models/resource';
import { cardResource } from './interfaces/model'

const cardModule = namespace('card')

@Component({
  components: {
    Nav,
    Sortlist,
    TagGroup,
    ResourceList,
    DeskTop,
    Setting
  },
})
export default class App extends Vue {
  @cardModule.State('pages') pages:CardModel[];
  @cardModule.State('currentPage') currentPage:CardModel;

  @Mutation('user/setCurrentUser') public setCurrentUser!: Function

  @Mutation('card/setPages') public setPages!: Function
  @Mutation('card/setCurrentPage') public setCurrentPage!:Function
  @Mutation('card/arrowEditResOnCurrent') public arrowEditResOnCurrent!:Function

  @Mutation('resource/setResources') public setResources!:Function
  @Mutation('resource/setTypes') public setTypes!:Function
  @Mutation('resource/setCurrentType') public setCurrentType!:Function

  @Mutation('setting/setSetting') public setSetting!:Function

  settingopt:Object;
  pagesdata:CardCollection;
  created() {
    this.setCurrentUser(new UserCollection().get('123456') )
    this.pagesdata = new CardCollection()
    this.pagesdata.getlist(list =>{
      list && this.setPages(list); 
      list && this.setCurrentPage(list[0]);

    });
    const resources = new ResourceCollection();
    const types = resources.getTypes();
    this.setResources(resources);
    this.setTypes(types);
    this.setCurrentType(types[0]);

    this.settingopt = {
      '大小':[{
          name:'宽度',
          key:'width',
          type:'number',
          col:6
      },{
          name:'高度',
          key:'height',
          type:'number',
          col:6
      }],
      '位置':[{
          name:'x',
          key:'position.x',
          type:'number',
          col:6
      },{
          name:'y',
          key:'position.y',
          type:'number',
          col:6
      }],
      '变换':[{
          name:'旋转',
          key:'rotate',
          type:'number',
          col:6
      }],
      '层次':[{
          name:'<span title="上移一层" class="fa fa-arrow-up"></span>',
          key:'z-index-up',
          type:'button',
          col:3,
          action:() => {
            this.arrowEditResOnCurrent('up')
          }
      },{
          name:'<span title="下移一层" class="fa fa-arrow-down"></span>',
          key:'z-index-down',
          type:'button',
          col:3,
          action:() => {
            this.arrowEditResOnCurrent('down')
          }
      },{
          name:'<span title="置于顶层" class="fa fa-arrow-circle-up"></span>',
          key:'z-index-top',
          type:'button',
          col:3,
          action:() => {
            this.arrowEditResOnCurrent('top')
          }
      },{
          name:'<span title="置于底层" class="fa fa-arrow-circle-down"></span>',
          key:'z-index-bottom',
          type:'button',
          col:3,
          action:() => {
            this.arrowEditResOnCurrent('bottom')
          }
      }]
    }
  }

  save(){
    this.pagesdata.save(this.pages);
    success('保存成功！')
  }
}
</script>


