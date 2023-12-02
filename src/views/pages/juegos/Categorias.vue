<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { getBaseUrl } from '@/composables/useURL';
import { getuseToast } from '@/composables/usarToast';
import { getresponsiveOptins } from '@/composables/useJuegos';
import { useRouter, useRoute } from 'vue-router';

//variables
const baseUrl = getBaseUrl();
const categorias = ref([]);
const router = useRouter();
const route = useRoute();
const { responsiveOptions } = getresponsiveOptins();
const { mostrarError, mostrarInfo, mostrarExito } = getuseToast(); // Aquí se almacena la lista de módulos
const moduloId = ref(route.params.moduloId);
const numItems = ref(0);
const tipo = ref(null);

const fetchCategorias = async () => {
    try {
        console.log('Entra a buscar categorias' + `${baseUrl}v1/modulos/${moduloId.value}/modulo-categorias/`);

        const response = await axios.get(`${baseUrl}v1/modulos/${moduloId.value}/modulo-categorias/activas/`);
        categorias.value = response.data;

        numItems.value = Object.keys(categorias).length;
        console.log(response);
        console.log('CAntidad de itemns ' + numItems.value);
    } catch (error) {
        console.error('Error con la conexión al backend al obtener los módulos:', error);
        mostrarError('Error ', 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet.');
    }
};
//direcionamiento a las categorias

const BuscarModulo = async () => {
    console.log('Entra a buscarcar categorias');
    try {
        console.log(numItems);
        //obtenemos el nombre de la ctaegoria en la cual esta el usuario
        const response = await axios.get(`${baseUrl}v1/modulos/${moduloId.value}/`);
        console.log(response.status);
        if (response.status === 200) {
            tipo.value = response.data.tipo;
        }
    } catch (error) {
        console.log('La categoria no existe');
        router.replace({ name: '404' });
    }
};
const redirecActividades = (categoriaId) => {
    console.log('ver actividades');
    console.log('Categoria Id' + categoriaId);
    console.log('Tipo de actividad ' + tipo.value);
    //llamamos a la funcion que redirecciona a la vista de actividades segun el tipo de actividad que sea
    if (tipo.value === 'PIC') {
        console.log('Se entra al tipo pictograma');
        router.push({ name: 'ActividaPictogramaJuegos', params: { categoriaId: categoriaId } });
    } else if (tipo.value === 'ORD') {
        router.push({ name: 'ActividadOrdenarOracionesJuegos', params: { categoriaId: categoriaId } });
    } else if (tipo.value === 3) {
        router.push({ name: 'NombreComponenteTipo3', params: { categoriaId: categoriaId } });
    }
    // Agrega más condiciones según los tipos de actividad que tengas
};

const VolverModulos = () => {
    router.push({ name: 'dashboardjuegos' });
};

onMounted(async () => {
    await fetchCategorias();
    await BuscarModulo();
});
</script>

<template>
    <div :style="{ fontFamily: 'Comic Sans MS, cursive' }">
        <div class="col-12">
            <Toast />
            <div>
                <Carousel :value="categorias" :circular="true" :numVisible="3" :numScroll="3" :pt="{
                    indicatorButton: { class: 'border-round-lg', style: 'height: 25px' },
                    nextButtonIcon: { style: 'height: 100px; width: 100px;' },
                    previousButtonIcon: { style: 'height: 100px; width: 100px' },
                }" circular :d_circucircular="true"
                    :nextButtonProps="{ style: '  height: 75px; width: 75px; color: #000000' }" :prevButtonProps="{
                        style: ' height: 75px; width: 75px; color: #000000'
                    }" :responsiveOptions="responsiveOptions" :style="{ fontFamily: 'Comic Sans MS, cursive' }">
                    <template #item="slotProps">
                        <div class="carousel-container">
                            <div class="mb-3">
                                <img :src="slotProps.data.imagen" :alt="slotProps.data.nombre" class="imgRedonda"
                                    @click="redirecActividades(slotProps.data.id)" />
                            </div>
                            <div>
                                <h4 class="mb-1">{{ slotProps.data.nombre }}</h4>
                            </div>
                        </div>
                    </template>
                </Carousel>
                <div class="flex justify-content-center">
                    <a outlined class="transparent-button" name="volver" @click="VolverModulos">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="60" height="60" fill="none">
                            <rect class="cls-1" x="14.85" y="12.8" width="333.19" height="332.82" rx="165.57" />
                            <path class="cls-2"
                                d="M180,309.26h0A169,169,0,0,1,12,158.42a170.43,170.43,0,0,0-1,18.18h0a169,169,0,0,0,169,169h0a169,169,0,0,0,169-169h0a170.43,170.43,0,0,0-1-18.18A169,169,0,0,1,180,309.26Z" />
                            <path
                                d="M257.35,342.83,221.57,356.5c-83.13,14.7-158.71-17.22-199.52-90.17C2.91,232.39-3.64,194.4,1.9,153.87,9.46,103.21,34.14,62.68,77,32.29c63.48-45.59,157.7-43.06,217.16,8.61C395.9,129.05,376.75,280.52,257.35,342.83ZM20,134.11c-27.71,115,54.41,217.33,171.81,211.25,9.57-.51,17.63,0,26.7-2.53,56.43-16.72,95.73-52.18,116.39-106.89C347,204,349,172.61,341,140.7,299.16-25,68.91-28,20,134.11Z" />
                            <path class="cls-3"
                                d="M221,127.36c21.29,0,63.34-7.72,67.49,22.14,3.12,24.71,3.12,44.78,0,60.74-4.67,24.2-48.8,19.57-67,19a4.38,4.38,0,0,0-4.15,3.61c-2.08,20.59-14.54,49.42-41,44.79C140.57,271,60.1,210.76,70,170.6c8.31-32.43,118.37-135.39,141.73-65.38q4.68,13.91,6.23,20.08A3.51,3.51,0,0,0,221,127.36ZM205.46,139.2c-3.11-18.53-5.19-48.39-32.18-43.25-22.85,4.64-58.67,38.1-75.28,56.63-10.9,12.36-18.17,26.77-9.35,39.13,10.91,15.44,95,107.08,111.1,52.51a173,173,0,0,0,5.2-26.77c0-2.06,2.07-3.09,3.63-3.09,16.61.52,33.23.52,49.84.52,9.86,0,15.05-5.15,16.61-15.45a197.28,197.28,0,0,0-.52-46.33c-1-7.21-5.19-11.33-12.46-11.33l-53,.52C207,142.29,205.46,141.26,205.46,139.2Z" />
                            <path class="cls-4"
                                d="M266.06,140.74l-54.28.51c-2.13,0-3.72-1-3.72-3.11-3.2-18.7-5.33-48.81-33-43.62C151.65,99.19,114.93,133,97.9,151.64c-11.17,12.46-18.62,27-9.58,39.47,11.18,15.57,97.39,108,113.88,53a171.77,171.77,0,0,0,5.32-27c0-2.08,2.13-3.12,3.73-3.12,17,.52,34.06.52,51.08.52,10.11,0,15.44-5.19,17-15.57a196,196,0,0,0-.53-46.74C277.77,144.89,273.51,140.74,266.06,140.74Z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.imgRedonda {
    width: 250px;
    height: 250px;
    border-radius: 150px;
    border: 10px solid #666;
    cursor: pointer;
}

.imgRedonda:hover {
    transform: scale(1.2);
    /* Hace que la imagen se agrande a 1.2 veces su tamaño original cuando el ratón pasa por encima */
    transition: transform 0.3s ease-in-out;
    /* Añade una transición suave al cambio de tamaño */
}

.carousel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;

    transition: all 0.3s ease-in-out;
}

.rounded-button {
    border-radius: 50%;
}

.transparent-button {
    background-color: transparent;
    border-color: transparent;
    cursor: pointer;
}

.transparent-button:hover {
    animation: bounce 1s infinite;
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-30px);
    }

    60% {
        transform: translateY(-15px);
    }
}

.cls-1 {
    fill: #009cfe;
}

.cls-2 {
    fill: #1f7dc1;
}

.cls-3 {
    fill: #000102;
}

.cls-4 {
    fill: #fff;
}

.loader {
    width: 48px;
    height: 48px;
    border: 5px solid #000000;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}
</style>
