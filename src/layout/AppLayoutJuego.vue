<script setup>
import { computed, watch, ref } from 'vue';
import AppTopbar from './AppTopbarJuego.vue';
//import AppFooter from './AppFooter.vue';
//import AppSidebar from './AppSidebar.vue';
//import AppConfig from './AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';




</script>

<template>
    
    <div class="layout-wrapper" :style="{backgroundColor: 'EDF5FA'}" >
        <app-topbar></app-topbar>
        <div class="layout-main-container">
          
            <div class="layout-content">
                <router-view></router-view>
            </div>
            
        </div>
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped></style>
