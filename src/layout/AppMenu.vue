<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Administración',
        items: [
            {
                label: 'Módulos',
                icon: 'pi pi-fw pi-pencil',
                to: '/modulos'
            },
            {
                label: 'Palabras',
                icon: 'pi pi-fw pi-pencil',
                to: '/palabras'
            }
            
        ]
    },
    {
        label: 'Cuenta',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
            
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound'
            },
        ]
    },
    {
        label: 'informes y reportes',
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-question',
                to: '/documentation'
            },
        ]
    },
    {
        label: 'Juegos',
        items: [
            {
                label: 'Juegos',
                icon: 'pi pi-fw pi-question',
                to: '/juegos'
            },
            
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
