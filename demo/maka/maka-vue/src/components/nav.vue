<template>
    <nav class="g-nav g-gradient">
        <h3>PMAKA</h3>
        <Avatar></Avatar>
    </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Avatar from './avatar.vue'

@Component({
    components:{
        Avatar
    }
})
export default class Nav extends Vue {}
</script>