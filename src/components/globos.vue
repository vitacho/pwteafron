<script setup>
const randon = () => {
    return Math.floor(Math.random() * 1);
};
</script>
<template>
    <div class="globos flex align-items-center">
        <img class="globo" :style="{ 'animation-duration': '5s', 'animation-delay': 0 + 's', left: '10%' }"
            src="layout/images/globos/2.svg" alt="Globo 1" />
        <img class="globo" :style="{ 'animation-duration': '6s', 'animation-delay': randon() + 's', left: '20%' }"
            src="layout/images/globos/3.svg" alt="Globo 2" />
        <img class="globo" :style="{ 'animation-duration': '7s', 'animation-delay': randon() + 's', left: '30%' }"
            src="layout/images/globos/4.svg" alt="Globo 3" />
        <img class="globo" :style="{ 'animation-duration': '6s', 'animation-delay': randon() + 's', left: ' 40%' }"
            src="layout/images/globos/5.svg" alt="Globo 4" />
        <img class="globo" :style="{ 'animation-duration': '8s', 'animation-delay': randon() + 's', left: '50%' }"
            src="layout/images/globos/2.svg" alt="Globo 5" />
        <img class="globo" :style="{ 'animation-duration': '4s', 'animation-delay': randon() + 's', left: '60%' }"
            src="layout/images/globos/3.svg" alt="Globo 6" />
        <img class="globo" :style="{ 'animation-duration': '7s', 'animation-delay': randon() + 's', left: '70%' }"
            src="layout/images/globos/4.svg" alt="Globo 7" />
        <img class="globo" :style="{ 'animation-duration': '4s', 'animation-delay': randon() + 's', left: ' 80%' }"
            src="layout/images/globos/5.svg" alt="Globo 8" />
        <img class="globo" :style="{ 'animation-duration': '5s', 'animation-delay': randon() + 's', left: ' 90%' }"
            src="layout/images/globos/6.svg" alt="Globo 9" />
        <img class="globo" :style="{ 'animation-duration': '8s', 'animation-delay': randon() + 's', left: ' 0%' }"
            src="layout/images/globos/6.svg" alt="Globo 9" />
    </div>
</template>
<style scoped>
.globos {
    position: relative;
    height: 100vh;
    overflow: hidden;
}

.globo {
    position: absolute;
    bottom: 0;
    animation: subir infinite ease-in-out;
    width: 250px;
}

@keyframes subir {
    0% {
        bottom: 0;
    }

    100% {
        bottom: 100vh;
    }
}
</style>