<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';

import { getuseToast } from '@/composables/usarToast';

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const fecha = ref(new Date());
const fechaFormato = ref(null);

onMounted(() => {
    bindOutsideClickListener();
    fechaFormato.value = formatoFecha(fecha.value);
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const formatoFecha = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleString('es-EC', options);
};

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar" :style="{ backgroundColor: '#FFFFDD',fontFamily: 'Comic Sans MS, cursive'}">
        <div class="layout-topbar-logo">
            <img src="layout/images/Sol.svg" alt="sol" />
            <h5 :style="{fuente}"> Hoy esta nublado </h5>
            
            <h5>
                {{ fechaFormato }}
            </h5>
        </div>
        

        <div class="layout-topbar-menu">
            <div class="topbar-icon">
                <img src="icon1.png" />
                <div>Texto 1</div>
            </div>

            <div class="topbar-icon">
                <img src="icon2.png" />
                <div>Texto 2</div>
            </div>

            <div class="topbar-icon">
                <img src="icon3.png" />
                <div>Texto 3</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>
