<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';

import { getuseToast } from '@/composables/usarToast';
import { fetchPosision } from '@/composables/useURL';

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const fecha = ref(new Date());
const fechaFormato = ref(null);
const weather = ref(null);

onMounted(async () => {
    bindOutsideClickListener();
    fechaFormato.value = formatoFecha(fecha.value);
    weather.value = await fetchPosision();
    console.log(weather);
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
    <div class="layout-topbar" :style="{ fontFamily: 'Comic Sans MS, cursive' }">
        <div class="layout-topbar-logo">
            <div class="estado-clima">

                <img :src="`http://openweathermap.org/img/wn/${weather ? weather.icon : '01d'}.png`" alt="clima"
                    :style="{ width: '50px', height: '50px' }">
            </div>
            <div class="topbar-icon">

                <h6> {{ weather ? weather.message : 'No hay información disponible' }}</h6>
                <h6>{{ fechaFormato }}</h6>
            </div>

        </div>

        <div class="layout-topbar-menu">
            <div class="topbar-icon">
                <img src="layout/images/ayuda.svg" :style="{ height: '60px' }" />
                <div>Ayuda</div>
            </div>

            <div class="topbar-icon">
                <img src="layout/images/banio.svg" :style="{ height: '60px' }" />
                <div>Ir al baño</div>
            </div>

            <div class="topbar-icon">
                <img src="layout/images/hambre.svg" :style="{ height: '60px' }" />
                <div>Hambre</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    height: 6rem;
    background-color: #FFFFDD;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    z-index: 1000;

}

.topbar-icon h6 {
    margin: 0.5rem 0;
}

.topbar-icon {
    margin: 10px;
}</style>
