<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { getBaseUrl } from '@/composables/useURL';
import { getuseToast } from '@/composables/usarToast';
import { getresponsiveOptins } from '@/composables/useJuegos';
import { useRouter, useRoute } from 'vue-router';
import { shuffle } from 'lodash';
import { VueDraggableNext } from 'vue-draggable-next';
import globos from '@/components/globos.vue';

//variables
const baseUrl = getBaseUrl();
const oraciones = ref([]);
const router = useRouter();
const route = useRoute();
const { responsiveOptions } = getresponsiveOptins();
const { mostrarError, mostrarExito } = getuseToast(); // Aquí se almacena la lista de módulos
const categoriaId = ref(route.params.categoriaId);
const numItems = ref(0);
const categorias = ref(null);
const pictogramseleccionado = ref('');
const isLoading = ref(false);
const pictogramaCopia = ref([]);
const estadoVerificado = ref(false); // estado en el cual al entrar a verificar cuando esta inccrecto bloquea para que no entre seguidamente si no cuando se termine de ejecutar
const numActualOracion = ref(0);
const palabras_lista = ref([]);
const oracionActual = ref({});
const Terminado = ref(false);
const palabrasOrdenadas = ref([]);
const palabrasDesordenadas = ref([]);
const draggable = ref(VueDraggableNext);


const fetchActividades = async () => {
   try {
      isLoading.value = true;
      const response = await axios.get(`${baseUrl}v1/actividades/ordenar-oracion/activas/${categoriaId.value}/`);
      console.log(response);
      
      if (response.status === 200) {
         oraciones.value = response.data;
         console.log('Oraciones = ' + oraciones.value.data);
         pictogramaCopia.value = response.data;
         numItems.value = response.data.length;

         //obtenerPictogramasAletorio();
      }
   } catch (error) {
      // router.replace({ name: '404' });
      oraciones.value = {};
      mostrarError('Error ', 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet.');
      console.log(error);
   } finally {
      isLoading.value = false;
   }
};

const fetchoracionActual = async () => {
   try {
      const palabras_originales = [];

      // de toda la lista de oraciones que se obtiene seleccioanmos segun el numero actual de la oracion pasamos al objecto oracionActual
      oracionActual.value = oraciones.value[numActualOracion.value];
      //plabras originales de la oracion con la mayuscula y minsculas correpodientes
      palabras_originales.value = oracionActual.value.oracion.split(' ');

      //obtenemos la lista de palabras de la oracion actual cual tiene la lista de palabras
      palabras_lista.value = await fecthPalabrasActuales(oracionActual.value.palabras);

      //obtenemos la lista de palabras de la oracion actual cual tiene la lista de palabras
      for (let i = 0; i < palabras_lista.value.length; i++) {
         console.log('----' + i + '----');
         console.log('Palabras antes del remplazo = ' + palabras_lista.value[i].texto);
      }

      console.log('antes del for');
      console.log('tamaño de plalabras_lista = ' + palabras_lista.value.length);
      for (let i = 0; i < palabras_originales.value.length; i++) {
         console.log(i);
         //ahora buscamos la palabra en la lista de palabras de la oracion actual
         for (let j = 0; j < palabras_lista.value.length; j++) {
            if (palabras_originales.value[i].toLowerCase() === palabras_lista.value[j].texto.toLowerCase()) {
               //remplazamos el texto
               palabras_lista.value[j].texto = palabras_originales.value[i];
               //agregamos la palabra a la lista de palabras por ordenar
               palabrasOrdenadas.value.push(palabras_lista.value[j]);
            }
         }
      }

      do {
         //desordenamos las palabras
         palabrasDesordenadas.value = shuffle([...palabrasOrdenadas.value]);
         //comparamos si son iguales
         console.log('Palbras desordenadas'+JSON.stringify(palabrasDesordenadas.value));
      } while (arraysReorganizar(palabrasDesordenadas.value, palabrasOrdenadas.value));

         //console.log('Palbras desordenadas'+JSON.stringify(palabrasDesordenadas.value));
   } catch (error) {
      console.error(error);
   }
};

function arraysReorganizar(a, b) {
  // Verifica si cada palabra en 'a' no está en la misma posición que en 'b'
  return a.length === b.length && a.every((val, index) => val.id === b[index].id);
}

function arraysAreEqual(a, b) {
   //se toma el arraya de las palabras ordenadas y se compara con el array de las palabras desordenadas
   //si son iguales retorna true
   //si son diferentes retorna false

   return a.length === b.length && a.every((val, index) => val === b[index]);
};


const checkMove = (evt) => {
   var itenel = evt.clone;
   console.log ('itenel = '+ JSON.stringify(itenel));
   console.log('end');
   console.log(evt.newIndex);
   //console.log('Palabras ordenadas = ' + palabrasOrdenadas.value);
   //console.log('Palabras desordenadas = ' + palabrasDesordenadas.value);
   //console.log('Palabras lista = ' + palabras_lista.value);
};       

const verificarOrden = () => {

   // verificamos si las plabaras ordenadas y desordendas son iguales si son iguales se pasa a la siguiente oracion

   if (arraysAreEqual(palabrasDesordenadas.value, palabrasOrdenadas.value)) {
      //si son iguales se pasa a la siguiente oracion
      console.log('Son iguales');
      //verificamos si es la ultima oracion
      if (numActualOracion.value === numItems.value - 1) {
         //si es la ultima oracion se termina el juego
         console.log('Terminado');
         Terminado.value = true;
         mostrarExito('¡Felicidades!', 'Has completado todas las oraciones.');
         const numero = Math.floor(Math.random() * 4) + 1;
         //reproducimos un sonido de un archivo mp3public/layout/audio/IntentaloDeNuevo
         const audio = new Audio(`layout/audio/Correcto/felicitaciones${numero}.mp3`);

         audio.play();
      } else {
         //si no es la ultima oracion se pasa a la siguiente oracion
         console.log('Siguiente oracion');
         //reproduciomos un audio de felicitaciones por la oracion correcta 
         const numero = Math.floor(Math.random() * 6) + 1;
         const audio = new Audio(`layout/audio/Correcto/SeleccionCorrecta/seleccion${numero}.mp3`);
         audio.play();
         numActualOracion.value = numActualOracion.value + 1;
         // limpiamos las palabras desordenadas y ordenadas
         palabrasDesordenadas.value = [];
         palabrasOrdenadas.value = [];
         palabras_lista.value = [];
         fetchoracionActual();
      }
   } else {
      //si son diferentes se muestra un mensaje de error
      console.log('Son diferentes');
      mostrarError('¡Ups!', 'Las palabras no están en el orden correcto.');
   }

   //si son diferentes se muestra un mensaje de error

};

const fecthPalabrasActuales = async (palabras_actuales) => {
   try {
      console.log('tamaño de la palabras =' + palabras_actuales.length);
      if (palabras_actuales.length > 0) {
         //recorremos la lista de palabras creadas

         //recorremos la lista de palabras creadas
         for (var i = 0; i < palabras_actuales.length; i++) {
            //obtenemos el id de la palabra

            const response_palabras = await axios.get(`${baseUrl}v1/palabras/${palabras_actuales[i]}/`);
            //la guardamos en un lista de palabras
            const palabra_resultante = response_palabras.data;
            palabras_lista.value.push(palabra_resultante);
            console.log('Id de la palabras = ' + palabras_actuales[i]);
         }
         return palabras_lista.value;
      }
   } catch (error) {
      console.error(error);
   }
};



const sleep = (ms) => {
   return new Promise((resolve) => setTimeout(resolve, ms));
};

const fetchCategorias = async () => {
   console.log('Fetch Categorias');
   try {
      //obtenemos el nombre de la ctaegoria en la cual esta el usuario
      const response = await axios.get(`${baseUrl}v1/categorias/${categoriaId.value}/`);
      console.log(response.status);
      if (response.status === 200) {
         categorias.value = response.data;
         console.log('Id de la categoria =' + categorias.value.id);
      }
   } catch (error) {
      console.log('La categoria no existe');
      router.replace({ name: '404' });
   }
};

const VolverCategorias = () => {
   router.push({ name: 'CategoriasJuegos', params: { moduloId: categorias.value.modulo } });
};

//Caluclo de numero aletorios



onMounted(async () => {
   await fetchCategorias();
   await fetchActividades();
   fetchoracionActual();
   //await BuscarCatagorias();
   //window.removeEventListener('keydown', this.handleKeydown);
});
</script>

<template>
   <div :style="{ fontFamily: 'Comic Sans MS, cursive' }">
      <div>
         <div class="col-12">
            <Toast />

            <div v-if="isLoading">
               <div class="flex justify-content-center">
                  <span class="loader"></span>
               </div>
            </div>
            <div v-else>
               <div>
                  <div v-if="Terminado === false">
                     <div class="flex flex-wrap justify-content-center">
                        <h3 class="flex align-items-center justify-content-center">
                           Ahora vamos a hacer ordenar una oración &nbsp <b> {{ oracionActual.oracion }} </b>
                        </h3>
                     </div>

                     <div class="flex flex-wrap justify-content-center ">
                        <draggable class="grid text-center " :list="palabrasDesordenadas" @change="log"
                           @end="verificarOrden" :move="checkMove" >
                           <div class="align-items-center w-12rem h-16rem m-3 p-3 rounded-md cursor-move" 
                           style="background-color:  #E0BAD7 ;"
                              v-for="element in palabrasDesordenadas" :key="element.id">
                              <div class="grid">
                                 <div class="col text-black-alpha-90 text-900">     
                                         {{ element.texto }}      
                                 </div>
                              </div>
                              <div class="grid">
                                 <div class="col">
                                    <img :src="element.imagen" alt="" style="height: 150px" />
                                 </div>
                              </div>
                           </div>
                        </draggable>
                     </div>

                     <div class="flex justify-content-center">
                        <a outlined class="transparent-button" name="volver" @click="VolverCategorias">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="60" height="60"
                              fill="none">
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
                  <div v-else>
                     <!-- Cuando se completa la actividad -->
                     <globos></globos>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<style scoped>
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

.imgRectangulo {
   width: auto;
   height: auto;
   max-width: 160px;
   border: 5px solid #666;
   cursor: pointer;
}

.imgRectangulo:hover {
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

@keyframes rotation {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}

.imagen-seleccionada {
   max-width: 75px;
   max-height: auto;
   border: #666 5px solid;
   border-radius: 10px;
   margin: auto;
   position: relative;
}

.imagen-seleccionada:hover {
   max-width: 100px;
   max-height: auto;
   transition: max-width 0.3s ease, max-height 0.3s ease;
   z-index: 1;
}
</style>
