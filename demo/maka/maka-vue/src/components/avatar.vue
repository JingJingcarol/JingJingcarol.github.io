<template>
    <div class="g-avatar">
        <img :src="avatar">`
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation, Getter, State,namespace } from 'vuex-class';
import {UserModel} from '../models/user'

const userModule = namespace('user')

@Component
export default class Avatar extends Vue {
    @userModule.State('currentUser') currentUser:UserModel
    get avatar():string{
        return this.currentUser.getavatar();
    }
}
</script>