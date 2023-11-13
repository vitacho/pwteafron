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
const { mostrarError, mostrarInfo, mostrarExito } = getuseToast();// Aquí se almacena la lista de módulos
const moduloId = ref(route.params.moduloId);
const numItems = ref(0);
const tipo = ref(null);

const fetchCategorias = async () => {
   try {
      console.log("Entra a buscarcar categorias" + `${baseUrl}v1/modulos/${moduloId.value}/modulo-categorias/`);
      const response = await axios.get(`${baseUrl}v1/modulos/${moduloId.value}/modulo-categorias/`);
      categorias.value = response.data;

      numItems.value = Object.keys(categorias).length;
      console.log(response)
      console.log("CAntidad de itemns " + numItems.value);

   } catch (error) {
      console.error('Error con la conexión al backend al obtener los módulos:', error);
      mostrarError('Error ', 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet.');
   }
};
//direcionamiento a las categorias

const BuscarModulo = async () => {

   console.log("Entra a buscarcar categorias");
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
   } else if (tipo.value === "DIB") {
      router.push({ name: 'NombreComponenteTipo2', params: { categoriaId: categoriaId } });
   } else if (tipo.value === 3) {
      router.push({ name: 'NombreComponenteTipo3', params: { categoriaId: categoriaId } });
   }
   // Agrega más condiciones según los tipos de actividad que tengas
};

onMounted(async () => {
   await fetchCategorias();
   await BuscarModulo();
});

</script>

<template>
   <div :style="{ fontFamily: 'Comic Sans MS, cursive' }">

      <div class="col-12">
         <h6>hola 
            {{ route.params.moduloId }}
         </h6>
         <Toast />
         <div>
            <Carousel :value="categorias" :numVisible="3" :numScroll="3" :pt="{
               indicatorButton: { class: 'border-round-lg', style: 'height: 25px' },
               nextButtonIcon: { style: 'height: 100px; width: 100px; font-size: 2rem;' },
               previousButtonIcon: { style: 'height: 100px; width: 100px; font-size: 2rem; ' },
            }" :responsiveOptions="responsiveOptions" :style="{ fontFamily: 'Comic Sans MS, cursive' }">

               <template #item="slotProps">
                  <div class="carousel-container">
                     hola
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
   cursor: pointer;
   transition: all 0.3s ease-in-out;
}

</style>
