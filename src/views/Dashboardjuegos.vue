<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { getBaseUrl } from '@/composables/useURL';
import { getuseToast } from '@/composables/usarToast';
import { useRouter } from 'vue-router';


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

const responsiveOptions = ref([
   {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
   },
   {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
   },
   {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
   },
   {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
   }
]);


onMounted(() => {
   fetchModulos();
});

</script>

<template>
   <div class="grid" :style="{ fontFamily: 'Comic Sans MS, cursive' }">
      <div class="grid p-fluid">
         <div class="col-12">
            <Toast />
            <div>
               <Carousel :value="modulos" :numVisible="3" :numScroll="3" :pt="{
                  indicatorButton: { class: 'border-round-lg', style: 'height: 25px' },
                  nextButtonIcon: { style: 'height: 100px; width: 100px; font-size: 2rem;' },
                  previousButtonIcon: { style: 'height: 100px; width: 100px; font-size: 2rem; ' },
               }" :responsiveOptions="responsiveOptions" :style="{ fontFamily: 'Comic Sans MS, cursive' }">

                  <template #item="slotProps">
                     <div class="text-center py-5 px-3">
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

   </div>
</template>
<style  scoped>
.imgRedonda {
   width: 250px;
   height: 250px;
   border-radius: 150px;
   border: 10px solid #666;
}

.grid {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   grid-gap: 1rem;
   padding: 1rem;
}

.p-carousel .p-carousel-prev-icon,
.p-carousel .p-carousel-next-icon {
   color: #c92d2d;
   /* Cambia el color de las flechas */
   background-color: #000;
   /* Cambia el color de fondo de las flechas */
   border-radius: 50%;
   /* Hace que las flechas sean redondas */
   width: 30px;
   /* Cambia el ancho de las flechas */
   height: 30px;
   /* Cambia la altura de las flechas */
}
</style>
