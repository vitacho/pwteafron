<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { getBaseUrl } from '@/composables/useURL';
import { getuseToast } from '@/composables/usarToast';
import { useRouter } from 'vue-router';
import { getresponsiveOptins } from '@/composables/useJuegos';
const { responsiveOptions } = getresponsiveOptins();

//variables 
const baseUrl = getBaseUrl();
const modulos = ref([]);
const { mostrarError, mostrarInfo, mostrarExito } = getuseToast();// Aquí se almacena la lista de módulos
const router = useRouter();

const fetchModulos = async () => {
   try {
      const response = await axios.get(`${baseUrl}v1/modulos/`);
      modulos.value = response.data;
   } catch (error) {
      console.error('Error con la conexión al backend al obtener los módulos:', error);
      mostrarError('Error ', 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet.');
   }
};
//direcionamiento a las categorias
const redirecCategorias = (id) => {
   //redicionar a la pagina anterior que corresponde a la lista de categorias utilizando categoriaId

   try {
      console.log(id);
      router.push({ name: 'CategoriasJuegos', params: { moduloId: id } });

   } catch (error) {
      mostrarError('Error ', 'Al encontrar la ruta');
   }
};



onMounted(() => {
   fetchModulos();
});

</script>

<template>
   <div  :style="{ fontFamily: 'Comic Sans MS, cursive' }">

      <div class="col-12">
         <Toast />
         <div  >
            <Carousel :value="modulos" :numVisible="3" :numScroll="3" :pt="{
               indicatorButton: { class: 'border-round-lg', style: 'height: 25px' },
               nextButtonIcon: { style: 'height: 100px; width: 100px; font-size: 2rem;' },
               previousButtonIcon: { style: 'height: 100px; width: 100px; font-size: 2rem; ' },
            }" :responsiveOptions="responsiveOptions" :style="{ fontFamily: 'Comic Sans MS, cursive' }"
               >

               <template #item="slotProps">
                  <div class="carousel-container">
                  
                     <div class="mb-3">
                        <img :src="slotProps.data.imagen" :alt="slotProps.data.nombre" class="imgRedonda"
                           @click="redirecCategorias(slotProps.data.id)" />
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
</template>
<style  scoped>
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

}.carousel-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: 100%;
   width: 100%;
   padding: 1rem;
   border-radius: 0.5rem;
   cursor: pointer;
   transition: all 0.3s ease-in-out;
}




</style>
