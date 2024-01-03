<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { useVuelidate } from '@vuelidate/core';

import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

//importaciones de composables
import { getBaseUrl } from '@/composables/useURL';
import { base64ToBlob, getBase64Type } from '@/composables/useBase64';
import { required, minLength, helpers } from '@vuelidate/validators';
import { getuseToast } from '@/composables/usarToast';

const route = useRoute();

const categorias = ref([]); // Aquí se almacena la lista de módulos
const selectedActividad = ref(null); // Aquí se almacena el módulo seleccionado para edición

const actividadDialog = ref(false); // Dialogo de edición y de nuevo
const eliminarActividadDialog = ref(false); // Dialogo de confirmación de eliminación
const submitted = ref(false); // Indica si el formulario ha sido enviado
const base64File = ref(null); // Aquí se almacena la imagen seleccionada para subir en base64
const baseUrl = getBaseUrl();
const cargando = ref(false);
const categoriaId = ref(route.params.categoriaId);
const categoria = ref(null);
const modulocatgoriaId = ref(null);
const router = useRouter();
const { mostrarError, mostrarInfo, mostrarExito } = getuseToast();
const nombreDialog = ref('null');
const ImagenDialog = ref(false);
const PalabrasDialog = ref(false);
const listaPalabrasDialog = ref(false);
const palabras_creadas = ref([]);
const selectedPalabra = ref(null);
const palabras_lista = ref([]);
const exitePalabra_creadas = ref(false);
const loading = ref(true);





//validacion para dos palabras o mas con helpers
const dospalabras = helpers.withMessage('La oracion debe de tener por al menos dos palabras o mas', value => {
    
    if (value.split(' ').length >= 2) {
        return true;
    }
    return false;
}); 

// Validación de formulario con Vuelidate
const rules = {
     // que sea requerido y con mensaje de error
    nombre: { required, minLength: minLength(1) }, //nombre de la actividad
    oracion: { required, dospalabras },  //oracion de la actividad
    //oracion de la actividad

};

const rules_palabras = {
    imagen: { required },
};

const validarImagen = useVuelidate(rules_palabras, selectedPalabra);
const validarOracion = useVuelidate(rules, selectedActividad);

onMounted(async () => {
    console.log('categoriaId', categoriaId.value);
    obtenerNombreCategoria();
    await fetchActividades(); //llamamos a la funcion para traer los actividades de ordenar oraciones
});

//funcion para traer las categorias y su actulizacion cunado sea necesario
const fetchActividades = async () => {
    try {
        loading.value = true;
        const response = await axios.get(`${baseUrl}v1/actividades/ordenar-oracion/categorias/${categoriaId.value}/`)
        console.log(response);
        if (response.status === 200) {
            categorias.value = response.data;
            loading.value = false;
        }
    } catch (error) {
        // router.replace({ name: '404' });
        actividades.value = {};
        console.log(error);
    }
};


const openNew = () => {
    selectedActividad.value = {};
    actividadDialog.value = true;
    validarOracion.value.$reset();
    nombreDialog.value = 'Nueva Activiadad Ordenar Oraciones';
    palabras_lista.value = [];
};


const editarActividad = (actividad) => {

    selectedActividad.value = { ...actividad }; // Copia el módulo seleccionado para edición
    actividadDialog.value = true;
    validarOracion.value.$reset(); // Limpia las validaciones
    nombreDialog.value = 'Editar Actividad Ordenar Oraciones';
    //volemos la lista de palabras creadas aa cerro
    palabras_lista.value = [];
};

const eliminarActividadConfirmar = (actividad) => {
    selectedActividad.value = actividad;
    eliminarActividadDialog.value = true;
};

const eliminarActividad = async () => {
    console.log('eliminar');
    try {
        const fromData = new FormData();
        fromData.append('id', selectedActividad.value.id);
        fromData.append('nombre', selectedActividad.value.nombre);
        fromData.append('categoria', selectedActividad.value.categoria);
        fromData.append('activo', false);
        //se cambia el estado de la actividad a false para que no se muestre en la lista de actividades pictogramas
        const response = await axios.patch(`${baseUrl}v1/actividades_ordenar_oracion/${selectedActividad.value.id}/`, fromData);
        if (response.status === 200) {
            //recaragamos la tabla
            mostrarExito('Éxito', 'La categoria se ha desactivado correctamente');
            fetchActividades();
            eliminarActividadDialog.value = false;
            selectedActividad.value = {};
        }
    } catch (error) {
        mostrarError('Error', 'Hubo un error al desactivar la actividad');
        mostrarError('Error', error.response.data);
    }
};


const agregarImagen = (palabra) => {
    selectedPalabra.value = { ...palabra };
    PalabrasDialog.value = true;
    ImagenDialog.value = true;
    validarImagen.value.$reset();
    console.log(selectedPalabra);

};

const hideDialog = () => {
    actividadDialog.value = false;
    selectedActividad.value = null; // limpia la activiada seleecionada 
    submitted.value = false; // Limpia el indicador de envío de formulario
    base64File.value = null; // Limpia la imagen seleccionada
    fetchActividades(); //recargasmos la tabla
    selectedActividad.value = {}; //limpiamos el objeto de la categoria
};



const obtenerNombreCategoria = async () => {
    try {
        //obtenemos el nombre de la categoria en la cual esta el usuario
        const response = await axios.get(`${baseUrl}v1/categorias/${categoriaId.value}/`);
        if (response.status === 200) {
            categoria.value = response.data.nombre;
            modulocatgoriaId.value = response.data.modulo;
            console.log(categoria.value);
        }
    } catch (error) {
        console.log('La categoria no existe');
        router.replace({ name: '404' });
        console.log(error);
    }
};
const llenarListaPalabras = async (palabras_creadas) => {
    try {
        if (palabras_creadas.value.length > 0) {
            //recorremos la lista de palabras creadas
            console.log("Tamaño de palabras creadas = " + palabras_creadas.value.length);
            //recorremos la lista de palabras creadas
            for (var i = 0; i < palabras_creadas.value.length; i++) {
                //obtenemos el id de la palabra
                console.log("Id de la palabras = " + palabras_creadas.value[i]);
                const response_palabras = await axios.get(`${baseUrl}v1/palabras/${palabras_creadas.value[i]}/`);
                //la guardamos en un lista de palabras
                const palabra_resultante = response_palabras.data;
                palabras_lista.value.push(palabra_resultante);
            };
        }

    } catch (error) {
        console.error(error);
    }
};
const actulizarPalabrasTabla = (id) => {
    //Buscamos la plabara segun la id en la lista palaabras_lista
    const palabra = palabras_lista.value.find(palabra => palabra.id === selectedPalabra.value.id);
    // ponemos la imagen de la palabra a la imagen de la palabra seleccionada
    palabra.imagen = selectedPalabra.value.imagen;

};

//metodo para guardar el modulo
const guardarActividad = async () => {
    try {
        cargando.value = true;
        // Validar el formulario con Vuelidate
        validarOracion.value.$touch();

        if (validarOracion.value.$error) {
            // Mostrar errores de validación si existen
            mostrarError('Error', 'Por favor, verifica los datos ingresados.');
            cargando.value = false;
        } else {
            let response = await axios;
            const formData = new FormData();
            //eliminamos los dobles espacios de los campos de texto
            selectedActividad.value.nombre = selectedActividad.value.nombre.replace(/\s+/g, ' ').trim();
            formData.append('nombre', selectedActividad.value.nombre.replace(/\s+/g, ' ').trim());
            formData.append('descripcion', (selectedActividad.value.descripcion || '').replace(/\s+/g, ' ').trim());
            formData.append('oracion', selectedActividad.value.oracion.replace(/\s+/g, ' ').trim());
            formData.append('categoria', categoriaId.value);


            console.log('Actividad a guardar: ', selectedActividad.value.id);

            // Si el Actividad existe, actualizarlo
            if (selectedActividad.value.id) {
                //obetenemos el estado activo de la actividad
                formData.append('activo', selectedActividad.value.activo);
                // Actualizar la actividad
                //obtenemos el response
                response = await axios.patch(`${baseUrl}v1/actividades_ordenar_oracion/${selectedActividad.value.id}/`, formData);
                palabras_creadas.value = response.data.palabras_creadas;

            } else {
                formData.append('activo', true);
                response = await axios.post(`${baseUrl}v1/actividades_ordenar_oracion/`, formData);
                palabras_creadas.value = response.data.palabras_creadas;
            }

            if (response.status === 201 || response.status === 200) {
                mostrarExito('Éxito', 'La Actividad se ha creado correctamente');
                await llenarListaPalabras(palabras_creadas);
                // si el tamaño de la lsita de palabras es mayor a cer se se abre el dialogo  

                if (palabras_creadas.value.length > 0) {
                    listaPalabrasDialog.value = true;
                }
            }

            base64File.value = null; // Limpia la imagen seleccionada
            //Si el tamaño de la lista es igual a cerro se cierra el dialogo 
            console.log(palabras_lista.value.length);
            hideDialog();
            cargando.value = false;
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            mostrarError('Error', 'Tiempo de espera agotado. Por favor, verifica tu conexión a Internet.');
        } else if (error.response) {
            mostrarError('Error', error.response.data);

            mostrarError('Error', 'Ha ocurrido un error al guardar la información.');
        } else {
            mostrarError('Error', 'Ha ocurrido un error al guardar la información.');
            console.error('Error con la conexión a la API al actualizar el módulo:', error);
            console.log(error);
        }
        console.log(error);
        cargando.value = false;
    }
};


const guardarImagen = async () => {
    try {
        cargando.value = true;
        validarImagen.value.$touch();
        if (validarImagen.value.$error) {
            // Mostrar errores de validación si existen
            mostrarError('Error', 'Por favor, verifica los datos ingresados.');
        } else {

            const formData = new FormData();
            //obtener el tipo de imagen de la imagen seleccionada
            const type = getBase64Type(base64File.value);
            const base64Blob = base64ToBlob(base64File.value, '.' + type);
            formData.append('imagen', base64Blob, `${selectedPalabra.value.texto}.${type}`);

            // Actualizar la actividad

            const response = await axios.patch(`${baseUrl}v1/palabras/${selectedPalabra.value.id}/`, formData);
            console.log(response);
            if (response.status === 200) {
                //recaragamos la tabla
                mostrarExito('Éxito', 'La imagen se ha agregado correctamente');
                ImagenDialog.value = false;
                actulizarPalabrasTabla();
                selectedPalabra.value = {};


            }
            cargando.value = false;
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            mostrarError('Error', 'Tiempo de espera agotado. Por favor, verifica tu conexión a Internet.');
        } else if (error.response) {
            mostrarError('Error', error.response.data.imagen[0]);
        } else {
            mostrarError('Error', 'Ha ocurrido un error al guardar la información.');
            console.error('Error con la conexión a la API al actualizar el módulo:', error);
        }
        console.log(error);
        cargando.value = false;
    }
};

const Continuar = () => {
    //De toda la tabla conprobamos que todas las palabras tengan imagen

    //si todas las palabras tienen imagen se cierra el dialogo

    //si no se muestra un mensaje de error
    if (palabras_lista.value.length > 0) {
        //recorremos la lista de palabras creadas
        console.log("Tamaño de palabras creadas = " + palabras_lista.value.length);
        var cont = 0;
        //recorremos la lista de palabras creadas
        for (var i = 0; i < palabras_lista.value.length; i++) {
            //obtenemos el id de la palabra
            console.log("Id de la palabras = " + palabras_lista.value[i].id);
            if (palabras_lista.value[i].imagen) {
                cont = cont + 1;
                console.log("Contador = " + cont);
            }
        };
        console.log("Contador final = " + cont);
        console.log("Tamaño de la lista = " + palabras_lista.value.length);
        //si el cont es igual al tamaño de lista cerramos el dialogo
        if (cont === palabras_lista.value.length) {
            listaPalabrasDialog.value = false;

        } else {
            mostrarError('Error', 'Todas las palabras deben de tener imagen');
        }
    }
};



const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function () {
        const base64data = reader.result;
        base64File.value = base64data;
        //converitmos la imagen en base 64
        if (palabras_lista.value.length !== 0) {
            selectedPalabra.value.imagen = base64data;
        } else {
            selectedActividad.value.imagen_ordenar = base64data;
        }
    };
    mostrarInfo('Éxito', 'La imagen se ha cargado correctamente');
};

const goBack = () => {
    //redicionar a la pagina anterior que corresponde a la lista de categorias utilizando categoriaId
    router.push({ name: 'Categorias', params: { moduloId: modulocatgoriaId.value } });

};
</script>


<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <h5>Gestión de actividades de la categoría {{ categoria }}</h5>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Volver" icon="pi pi-arrow-left" class="p-button-secondary mr-2 inline-block"
                                @click="goBack" />
                            <Button label="Nueva Actividad" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openNew" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="categorias" v-model:selection="selectedActividad" :loading="loading"
                    dataKey="id" :paginator="true" :rows="5" tableStyle="flex justify-content-between"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} Actividades"
                    responsiveLayout="scroll" :globalFilterFields="[

                    ]">
                    <template #empty> No se encontraron actividades </template>
                    <template #loading> Cargando información. Por favor. </template>
                    <!-- Columnas de la tabla -->

                    <Column field="estado" header="Estado" :sortable="true" style="min-width: 10rem">
                        <template #body="slotProps">
                            <span class="p-column-title">Estado</span>
                            <i class="pi"
                                :class="{ 'text-green-500 pi-check-circle': slotProps.data.activo, 'text-red-400 pi-times-circle': !slotProps.data.activo }"></i>
                            <span class="text-green-500 ml-3 font-medium" v-if="slotProps.data.activo"> Activo </span>
                            <span class="text-red-400 ml-3 font-medium" v-else> Desactivado </span>
                        </template>
                    </Column>
                    <Column field="nombre" header="Nombre de la Actividad" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre</span>
                            {{ slotProps.data.nombre }}
                        </template>
                    </Column>
                    <Column field="Oracion" header="Oracion">
                        <template #body="slotProps">
                            <span class="p-column-title">Oracion</span>
                            {{ slotProps.data.oracion }}
                        </template>
                    </Column>

                    <Column header="Acción">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editarActividad(slotProps.data)" />
                            <Button v-if="slotProps.data.activo" icon="pi pi-trash"
                                class="p-button-rounded p-button-warning"
                                @click="eliminarActividadConfirmar(slotProps.data)" />
                        </template>
                    </Column>

                </DataTable>

                <Dialog v-model:visible="actividadDialog" :style="{ width: '700px' }" :header="nombreDialog" :modal="true"
                    class="p-fluid">

                    <div class="grid nested-grid">
                        <div class="col">
                            <div class="field">
                                <div class="formgrid grid">
                                    <div class="field col">
                                        <label for="nombre">Nombre</label>
                                        <InputText id="nombre" v-model="selectedActividad.nombre" required="true" autofocus
                                            :class="{ 'p-invalid': validarOracion.nombre.$error }"
                                            placeholder="Escribe el nombre del categoria aquí ejemplo Mátematica" />
                                        <small class="p-error" v-if="validarOracion.nombre.$error"> El pictograma de la
                                            actividad debe de
                                            tener
                                            por
                                            al menos 1 caracteres </small>
                                    </div>
                                </div>
                            </div>
                            <div class="formgrid grid">
                                <div class="field col">
                                    <label for="descripcion">Oración</label>
                                    <InputText id="descripcion" v-model="selectedActividad.oracion" required="true" rows="3"
                                        cols="20" :class="{ 'p-invalid': validarOracion.oracion.$error }"
                                        placeholder="Escribe la oración" />
                                    
                                        <small class="p-error" v-if=" validarOracion.oracion.$error"> {{validarOracion.oracion.dospalabras.$message }}  </small>
                                        
                                </div>
                            </div>

                            <div class="formgrid grid">
                                <div class="field col">
                                    <label for="descripcion">Descripción</label>
                                    <Textarea id="descripcion" v-model="selectedActividad.descripcion" rows="3" cols="20"
                                        placeholder="Escribe la descripción de la categoria aquí (Opcional)" />
                                </div>

                            </div>
                            <div class="formgrid grid">
                                <div class="field col field-checkbox "
                                    v-if="nombreDialog == 'Editar Actividad Ordenar Oraciones'">
                                    <Checkbox v-model="selectedActividad.activo" :binary="true" />
                                    <label for="checkOption1">Activo</label>
                                </div>
                            </div>

                        </div>

                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button :disabled="cargando" label="Guardar" icon="pi pi-save" class="p-button-text"
                            @click="guardarActividad"> </Button>

                    </template>
                </Dialog>

                <Dialog v-model:visible="eliminarActividadDialog" :style="{ width: '450px' }" header="Desactivar Actividad"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="selectedActividad">¿Estás seguro de desactivar la actividad?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="eliminarActividadDialog = false" />
                        <Button label="Si" icon="pi pi-check" class="p-button-text" @click="eliminarActividad" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="listaPalabrasDialog" :style="{ width: '700px' }" header="Palabras creadas"
                    :modal="true" class="p-fluid">

                    <small class="p-error">*Se debe de agregar una imagen a cada una de las palabras que se hayan creado
                        *</small>

                    <DataTable ref="dt" :value="palabras_lista" v-model:selection="selectedPalabra" dataKey="id"
                        :paginator="true" :rows="5"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} Palabras"
                        responsiveLayout="scroll" class="p-datatable-sm">

                        <Column field="verified" header="Imagen Cargada" dataType="boolean" style="width: 125px">
                            <template #body="slotProps">
                                <i class="pi"
                                    :class="{ 'pi-check-circle text-green-500': slotProps.data.imagen, 'pi-times-circle text-red-400': !slotProps.data.imagen }, 'flex align-items-center justify-content-center'">
                                </i>
                            </template>
                        </Column>
                        <Column field="nombre" header="Texto" :sortable="true">
                            <template #body="slotProps">
                                <span class="p-column-title">Texto</span>
                                {{ slotProps.data.texto }}
                            </template>
                        </Column>
                        <Column header="Agregar Imagen" style="width: 100px">
                            <template #body="slotProps">

                                <div class="flex align-items-center justify-content-center">
                                    <Button icon="pi pi-plus" class="p-button-rounded p-button-warning"
                                        @click="agregarImagen(slotProps.data)" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>

                    <template #footer>
                        <Button label="Continuar" icon="pi pi-check" class="p-button-text" @click="Continuar" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="ImagenDialog" :style="{ width: '700px', header: '900px' }" header="Agregar imagen"
                    :modal="true" class="p-fluid">
                    <div class="flex align-items-center justify-content-center">
                        <div class="field  col-4">
                            <FileUpload mode="basic" id="input-foto" name="imagen" accept="image/*" customUpload
                                @uploader="customBase64Uploader" chooseLabel="Subir imagen"
                                invalidFileSizeMessage="El tamaño máximo de la imagen permitido es 5MB"
                                invalidFileLimitMessage="Solo se admite un archivo a la vez"
                                invalidFileTypeMessage="Solo se admite formato de imagen PNG, JPG, JPEG"
                                :maxFileSize="5000000" :showUploadButton="false" :showCancelButton="false" :auto="true">
                            </FileUpload>
                            <small class="p-error" v-if="validarImagen.imagen.$error"> Se tiene que subir una imagen
                            </small>

                        </div>
                        <div class="field col-4">
                            <div class="flex align-items-center justify-content-center">
                                <Image :src="selectedPalabra.imagen" width="200" class="w-auto" preview />
                            </div>
                        </div>
                    </div>

                    <template #footer>
                        <Button :disabled="cargando" label="Guardar" icon="pi pi-save" class="p-button-text"
                            @click="guardarImagen"> </Button>

                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

