<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();


</script>

<template>
    <div class="layout-footer">
        <!-- poner imagen <img :src="logoUrl" alt="Logo" height="20" class="mr-2" />  -->
        
        <span class="font-medium ml-2">Hecho 2023</span>
    </div>
</template>
<style lang="scss" scoped></style>
