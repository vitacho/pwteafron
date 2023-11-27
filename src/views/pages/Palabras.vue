<script setup>
import {watch, ref, onMounted } from 'vue';
import axios from 'axios';
import { getBaseUrl } from '@/composables/useURL';
import { base64ToBlob, getBase64Type } from '@/composables/useBase64';

import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { getuseToast } from '@/composables/usarToast';

const palabras = ref([]); // Aquí se almacena la lista de módulos
const selectedpalabra = ref(null); // Aquí se almacena el módulo seleccionado para edición
const moduloDialog = ref(false); // Dialogo de edición
const submitted = ref(false); // Indica si el formulario ha sido enviado
const base64File = ref(null); // Aquí se almacena la imagen seleccionada para subir en base64
const baseUrl = getBaseUrl();
const cargando = ref(false);
const { mostrarError, mostrarInfo, mostrarExito } = getuseToast();
const busqueda = ref('');
const rules = {
    texto: { required }, // Mínimo de 3 caracteres
    imagen: { required } // Mínimo de 10 caracteres

    // Agrega las reglas para otros campos aquí
};

const v = useVuelidate(rules, selectedpalabra);

onMounted(() => {
    fetchPalabras(); //llamamos a la funcion para traer los palabras
});

const fetchPalabras = async () => {
    try {
        const response = await axios.get(`${baseUrl}v1/palabras/`);
        palabras.value = response.data;
    } catch (error) {
        console.error('Error con la conexión al backend al obtener los módulos:', error);
        mostrarError('Error ', 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet.');
    }
};

const editarpalabra = (modulo) => {
    selectedpalabra.value = { ...modulo }; // Copia el módulo seleccionado para edición
    moduloDialog.value = true;
};

const hideDialog = () => {
    moduloDialog.value = false;
    selectedpalabra.value = null; // Limpia el módulo seleccionado al cerrar el diálogo
    submitted.value = false; // Limpia el indicador de envío de formulario
    base64File.value = null; // Limpia la imagen seleccionada
    v.value.$reset();
    fetchPalabras();
};
//metodo para guardar el modulo
const guardarPalabra = async () => {
    cargando.value = true;
    console.log('1223334');

    console.log('Módulo a guardar:', selectedpalabra.value);
    // Validar el formulario con Vuelidate
    // Validar el formulario con Vuelidate
    v.value.$touch();

    if (v.value.$error) {
        // Mostrar errores de validación si existen
        mostrarError('Error', 'Por favor, verifica los datos ingresados.');
        cargando.value = false;
        console.log(cargando.value);
    } else {
        try {
            const formData = new FormData();
            formData.append('texto', selectedpalabra.value.texto);

            //cuando hay una imagen seleccionada
            if (base64File.value) {
                //obtener el tipo de iamgen de la imagen seleccionada
                const type = getBase64Type(base64File.value);
                //convertir la imagen seleccionada en un blob
                const base64Blob = base64ToBlob(base64File.value, '.' + type);
                formData.append('imagen', base64Blob, `${selectedpalabra.value.texto}.${type}`);
            }

            //Si la palabra existe, se hace un pacth, de lo contrario un POST

            if (selectedpalabra.value.id) {
                await axios.patch(`${baseUrl}v1/palabras/${selectedpalabra.value.id}/`, formData);
                mostrarExito('Éxito', 'La Palabra se ha actualizado correctamente');
            } else {

                const response = await axios.post(`${baseUrl}v1/palabras/`, formData);
                if (response.status === 201) {
                    //recaragamos la tabla
                    mostrarExito('Éxito', 'La Actividad se ha creado correctamente');
                }
            }
            hideDialog();
            fetchPalabras();
            cargando.value = false;
            base64File.value = null; // Limpia la imagen seleccionada
            v.value.$reset();
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                mostrarError('Error', 'Tiempo de espera agotado. Por favor, verifica tu conexión a Internet.');
            } else if (error.response) {
                let mensajeError = '';
                if (error.response.data.texto) {
                    mensajeError += error.response.data.texto[0];
                } else if (error.response.data.imagen) {
                    mensajeError += error.response.data.imagen[0];
                }
                mostrarError('Error', mensajeError);
                mostrarError('Error', 'Ha ocurrido un error al guardar la información.');
            } else {
                mostrarError('Error', 'Ha ocurrido un error al actualizar el módulo. Por favor, verifica tu conexión a Internet.');
                console.error('Error con la conexión a la API al actualizar el módulo:', error);
            }
            cargando.value = false;
        }
    }
};
 watch(busqueda, (value) => {
        if (value) {
            palabras.value = palabras.value.filter((palabra) => {
                return palabra.texto.toLowerCase().includes(value.toLowerCase());
            });
        } else {
            fetchPalabras();
        }
    });

//funcion para mostrar los mensajes de error

const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function () {
        const base64data = reader.result;
        base64File.value = base64data;
        //converitmos ka imagen en base 64
        selectedpalabra.value.imagen = base64data;
    };
    mostrarInfo('', 'La imagen se ha cargado correctamente');
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <h5>Gestión de Palabras</h5>
                <DataTable ref="dt" :value="palabras" v-model:selection="selectedpalabra" dataKey="id" :paginator="true"
                    :rows="5" tableStyle="flex justify-content-between"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} palabras"
                    responsiveLayout="scroll">

                    <template #header>
                        
                         <div class="flex justify-content-between flex-column sm:flex-row">
                            
                                <Button label="Nueva Actividad" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                               
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="busqueda" placeholder="Buscar" />
                                    </span>
                               
                         </div>
                          

                           

                      
                    </template>
                    <template #empty> No se encontraron actividades </template>
                    <Column field="texto" header="Texto" :sortable="true">
                        <template #body="slotProps">

                            {{ slotProps.data.texto }}
                        </template>
                    </Column>
                    <Column header="Imagen">
                        <template #body="slotProps">
                            <Image :src="slotProps.data.imagen" :alt="slotProps.data.texto" class="shadow-2" width="100"
                                preview />
                        </template>
                    </Column>
                    <Column header="Acción" style="width: 150px">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success "
                                @click="editarpalabra(slotProps.data)" />
                        </template>
                    </Column>
                    <template #footer> Hay un total de {{ palabras ? palabras.length : 0 }} Palabras. </template>
                </DataTable>

                <Dialog v-model:visible="moduloDialog" :style="{ width: '670px' }" header="Editar Módulo" :modal="true"
                    class="p-fluid">
                    <div class="field">
                        <label for="texto">Texto</label>
                        <InputText id="texto" v-model="selectedpalabra.texto" required="true" autofocus
                            :class="{ 'p-invalid': v.texto.$error }" />
                        <small class="p-error" v-if="v.texto.$error"> El texto tiene que tener por al menos 3 caracteres
                        </small>
                    </div>

                    <div class="field">
                        <div class="field">
                            <FileUpload mode="basic" id="input-foto" name="imagen" accept="image/*" customUpload
                                @uploader="customBase64Uploader" chooseLabel="Cambiar imagen" uploadLabel="Subir"
                                cancelLabel="Cancelar"
                                invalidFileSizeMessage="El tamaño máximo de la imagen permitido es 5MB"
                                invalidFileLimitMessage="Solo se admite un archivo a la vez"
                                invalidFileTypeMessage="Solo se admite formato de imagen PNG, JPG, JPEG"
                                :maxFileSize="5000000" :showUploadButton="false" :showCancelButton="false" :auto="true">
                            </FileUpload>
                            <small class="p-error" v-if="v.imagen.$error"> Se tiene que subir una imagen </small>
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <Image :src="selectedpalabra.imagen" width="150" class="w-auto" preview />
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button :disabled="cargando" label="Guardar" icon="pi pi-save" class="p-button-text"
                            @click="guardarPalabra"> </Button>
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
