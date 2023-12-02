<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { useVuelidate } from '@vuelidate/core';

import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

//importaciones de composables
import { getBaseUrl } from '@/composables/useURL';
import { base64ToBlob, getBase64Type } from '@/composables/useBase64';
import { required, minLength } from '@vuelidate/validators';
import { getuseToast } from '@/composables/usarToast';

const route = useRoute();

const categorias = ref([]); // Aquí se almacena la lista de módulos
const selectedActividad = ref(null); // Aquí se almacena el módulo seleccionado para edición
const moduloDialog = ref(false); // Dialogo de edición y de nuevo
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

//funcion para traer el modulo y su Factulizacion cunado sea necesario

// Validación de formulario con Vuelidate
const rules = {
    nombre: { required }, // Mínimo de 3 caracteres
    descripcion: {}, // Mínimo de 10 caracteres
    imagen_pictograma: { required }

    // Agrega las reglas para otros campos aquí
};

const v = useVuelidate(rules, selectedActividad);

onMounted(async () => {
    console.log('categoriaId', categoriaId.value);
    obtenerNombreCategoria();
    await fetchActividades();
});

//funcion para traer las categorias y su actulizacion cunado sea necesario
const fetchActividades = async () => {
    try {
        const response = await axios.get(`${baseUrl}v1/actividades/pictograma/${categoriaId.value}/`);
        console.log(response);
        if (response.status === 200) {
            categorias.value = response.data;
        }
    } catch (error) {
        // router.replace({ name: '404' });
        actividades.value = {};
        console.log(error);
    }
};

const editarCategoria = (categoria) => {
    selectedActividad.value = { ...categoria }; // Copia el módulo seleccionado para edición
    moduloDialog.value = true;
    v.value.$reset(); // Limpia las validaciones
    nombreDialog.value = 'Editar Actividad Pictograma';
};

const eliminarActividadConfirmar = (categoria) => {
    selectedActividad.value = categoria;
    eliminarActividadDialog.value = true;
};

const eliminarActividad = async () => {
    console.log('eliminar');
    try {
        //obtenemos el id de la categoria a elimina
        const fromData = new FormData();
        fromData.append('id', selectedActividad.value.id);
        fromData.append('activo', false);
        //se cambia el estado de la actividad a false para que no se muestre en la lista de actividades pictogramas
        const response = await axios.patch(`${baseUrl}v1/actividades_pictograma/${selectedActividad.value.id}/`, fromData);
        if (response.status === 200) {
            //recaragamos la tabla
            mostrarExito('Éxito', 'La categoria se ha desactivado correctamente');
            fetchActividades();
            eliminarActividadDialog.value = false;
            selectedActividad.value = {};
        }

    } catch (error) {
        mostrarError('Error', 'Hubo un error al desactivar la actividad');
        mostrarError('Error', error);
    }
};

const hideDialog = () => {
    moduloDialog.value = false;
    selectedActividad.value = null; // Limpia el módulo seleccionado al cerrar el diálogo
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

//metodo para guardar el modulo
const guardarActividad = async () => {
    try {
        cargando.value = true;
        // Validar el formulario con Vuelidate
        v.value.$touch();

        if (v.value.$error) {
            // Mostrar errores de validación si existen
            mostrarError('Error', 'Por favor, verifica los datos ingresados.');
            cargando.value = false;
        } else {

            const formData = new FormData();
            formData.append('nombre', selectedActividad.value.nombre.replace(/\s+/g, ' ').trim());
            formData.append('descripcion', (selectedActividad.value.descripcion || '').replace(/\s+/g, ' ').trim());
            formData.append('categoria', categoriaId.value);
            //cuando hay una imagen seleccionada

            //cuando hay una imagen seleccionada
            if (base64File.value) {
                //obtener el tipo de imagen de la imagen seleccionada
                const type = getBase64Type(base64File.value);
                //convertir la imagen seleccionada en un blob
                const base64Blob = base64ToBlob(base64File.value, '.' + type);
                //obtener el nombre de la imagen
                //agregar la imagen al formData con el nombre de imagen
                formData.append('imagen_pictograma', base64Blob, `${selectedActividad.value.nombre}.${type}`);
            }

            console.log('Módulo a guardar:', selectedActividad.value);
            // Si el módulo existe, actualizarlo
            if (selectedActividad.value.id) {
                console.log('Se ingresa al if de id');
                //obetenemos el estado activo de la actividad
                formData.append('activo', selectedActividad.value.activo);
                // Actualizar la actividad
                // /api/v1/actividades/
                await axios.patch(`${baseUrl}v1/actividades_pictograma/${selectedActividad.value.id}/`, formData);
                mostrarExito('Éxito', 'El módulo se ha actualizado correctamente');
            } else {

                formData.append('activo', true);
                const response = await axios.post(`${baseUrl}v1/actividades_pictograma/`, formData);
                if (response.status === 201) {
                    //recaragamos la tabla
                    mostrarExito('Éxito', 'La Actividad se ha creado correctamente');
                }
            }
            hideDialog();
            cargando.value = false;
            base64File.value = null; // Limpia la imagen seleccionada
            selectedActividad.value = {};
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

const openNew = () => {
    selectedActividad.value = {};
    moduloDialog.value = true;
    v.value.$reset();
    nombreDialog.value = 'Nueva Activiadad Pictograma';
};

const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function () {
        const base64data = reader.result;
        base64File.value = base64data;
        //converitmos ka imagen en base 64
        selectedActividad.value.imagen_pictograma = base64data;
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

                <DataTable v-if="categorias.length > 0" ref="dt" :value="categorias" v-model:selection="selectedActividad"
                    dataKey="id" :paginator="true" :rows="5" tableStyle="flex justify-content-between"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} Modulos"
                    responsiveLayout="scroll">
                    <!-- Columnas de la tabla -->
                    <Column field="orden" header="Orden" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Orden</span>
                            {{ slotProps.data.orden }}
                        </template>
                    </Column>
                    <Column field="estado" header="Estado" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Estado</span>
                            <i class="pi"
                                :class="{ 'text-green-500 pi-check-circle': slotProps.data.activo, 'text-pink-500 pi-times-circle': !slotProps.data.activo }"></i>
                            <span class="text-green-500 ml-3 font-medium" v-if="slotProps.data.activo"> Activo </span>
                            <span class="text-pink-500 ml-3 font-medium" v-else> Desactivado </span>
                        </template>
                    </Column>
                    <Column field="nombre" header="Nombre del Pictograma">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre</span>
                            {{ slotProps.data.nombre }}
                        </template>
                    </Column>
                    <Column field="descripcion" header="Descripción de la actividad">
                        <template #body="slotProps">
                            <span class="p-column-title">Descripción</span>
                            {{ slotProps.data.descripcion }}
                        </template>
                    </Column>

                    <Column header="Imagen">
                        <template #body="slotProps">
                            <span class="p-column-title">Imagen</span>
                            <Image :src="slotProps.data.imagen_pictograma" :alt="slotProps.data.nombre + ' Pitograma'"
                                class="shadow-2" width="100" preview />
                        </template>
                    </Column>
                    <Column header="Acción">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editarCategoria(slotProps.data)" />
                            <Button v-if="slotProps.data.activo" icon="pi pi-trash"
                                class="p-button-rounded p-button-warning"
                                @click="eliminarActividadConfirmar(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <div v-else style="text-align: center; padding: 30px">
                    <p class="">No hay datos disponibles</p>
                </div>
                <Dialog v-model:visible="moduloDialog" :style="{ width: '850px' }" :header="nombreDialog" :modal="true"
                    class="p-fluid">
                    <div class="grid nested-grid">
                        <div class="col">
                            <div class="field">
                                <label for="nombre">Nombre</label>
                                <InputText id="nombre" v-model="selectedActividad.nombre" required="true" autofocus
                                    :class="{ 'p-invalid': v.nombre.$error }"
                                    placeholder="Escribe el nombre del pictograma Ejemplo Luz apagada, Puerta " />
                                <small class="p-error" v-if="v.nombre.$error"> El pictograma de la actividad debe de tener
                                    por al menos 1 caracteres </small>
                            </div>
                            <div class="field">
                                <label for="descripcion">Descripción</label>
                                <Textarea id="descripcion" v-model="selectedActividad.descripcion" required="true" rows="3"
                                    cols="20" :class="{ 'p-invalid': v.descripcion.$error }"
                                    placeholder="Escribe la descripción del pictigrama aquí (Opcional)" />
                            </div>
                            <div class="formgrid grid">
                                <div class="field  col">
                                    <FileUpload mode="basic" id="input-foto" name="imagen" accept="image/*" customUpload
                                        @uploader="customBase64Uploader" chooseLabel="Subir imagen"
                                        invalidFileSizeMessage="El tamaño máximo de la imagen permitido es 5MB"
                                        invalidFileLimitMessage="Solo se admite un archivo a la vez"
                                        invalidFileTypeMessage="Solo se admite formato de imagen PNG, JPG, JPEG"
                                        :maxFileSize="5000000" :showUploadButton="false" :showCancelButton="false"
                                        :auto="true">
                                    </FileUpload>
                                    <small class="p-error" v-if="v.imagen_pictograma.$error"> Se tiene que subir una imagen
                                    </small>
                                </div>
                                <div class="field col field-checkbox" v-if="nombreDialog == 'Editar Actividad Pictograma'">
                                    <Checkbox v-model="selectedActividad.activo" :binary="true" />
                                    <label for="checkOption1">Activo</label>
                                </div>
                            </div>
                        </div>
                        <div class="field col-5">
                            <div class="flex align-items-center justify-content-center">
                                <Image :src="selectedActividad.imagen_pictograma" width="250" class="w-auto" preview />
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
            </div>
        </div>
    </div>
</template>

