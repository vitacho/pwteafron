<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { getBaseUrl } from '@/composables/useURL';
import { getuseToast } from '@/composables/usarToast'; 
import { getresponsiveOptins } from '@/composables/useJuegos';

import { useRouter, useRoute } from 'vue-router';

//variables 
const baseUrl = getBaseUrl();
const pictogramas = ref([]);
const router = useRouter();
const route = useRoute();
const { responsiveOptions } = getresponsiveOptins(); 
const { mostrarError, mostrarInfo, mostrarExito } = getuseToast();// Aquí se almacena la lista de módulos
const categoriaId = ref(route.params.categoriaId);
const numItems = ref(0);


const fetchActividades = async () => {
   try {
      const response = await axios.get(`${baseUrl}v1/actividades/pictograma/${categoriaId.value}/`);
      console.log(response);
      if (response.status === 200) {
         pictogramas.value = response.data;
      }
   } catch (error) {
      // router.replace({ name: '404' });
      pictogramas.value = {};
      mostrarError('Error ', 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet.');
   }
};
//direcionamiento a las pictogramas

const BuscarCatagorias = async () => {

   console.log("Entra a buscarcar pictogramas");
   try {

      //obtenemos el nombre de la ctaegoria en la cual esta el usuario
      const response = await axios.get(`${baseUrl}v1/modulos/${moduloId.value}/`);
      console.log(response.status);
      if (response.status === 200) {


      }
   } catch (error) {

      console.log('La categoria no existe');
      router.replace({ name: '404' });



   }
};



onMounted(async () => {
   await fetchActividades();
   //await BuscarCatagorias();
});

</script>

<template>
   <div  :style="{ fontFamily: 'Comic Sans MS, cursive' }">
      <div >
         <div class="col-12">
            <Toast />
            <div>
               <Carousel :value="pictogramas" :numVisible="3" :numScroll="3" :pt="{
                  indicatorButton: { class: 'border-round-lg', style: 'height: 25px' },
                  nextButtonIcon: { style: 'height: 100px; width: 100px; font-size: 2rem;' },
                  previousButtonIcon: { style: 'height: 100px; width: 100px; font-size: 2rem; ' },
               }" :responsiveOptions="responsiveOptions" :style="{ fontFamily: 'Comic Sans MS, cursive' }">

                  <template #item="slotProps">
                     <div class="text-center py-5 px-3">
                        <div class="mb-3">
                           <img :src="slotProps.data.imagen_pictograma" :alt="slotProps.data.nombre" class="imgRectangulo"
                              @click="redirecActividades(slotProps.data.id)" />
                        </div>
                        <div>
                           <h4 class="mb-1">{{ slotProps.data.nombre }}</h4>
                        </div>
                     </div>
                  </template>
               </Carousel>
            </div>
         </div>
      </div>

   </div>
</template>
<style  scoped>
.imgRectangulo {
   width: 250px;
   height: auto;

   border: 10px solid #666;
}
.imgRectangulo:hover {
   transform: scale(1.2);
   /* Hace que la imagen se agrande a 1.2 veces su tamaño original cuando el ratón pasa por encima */
   transition: transform 0.3s ease-in-out;
   /* Añade una transición suave al cambio de tamaño */
}

.grid {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   grid-gap: 1rem;
   padding: 1rem;
}


.carousel-container {
   display: flex;
   justify-content: center;
   align-items: center;
}
</style>
