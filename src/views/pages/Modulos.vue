<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getBaseUrl } from '@/composables/useURL';
import { base64ToBlob, getBase64Type } from '@/composables/useBase64';

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import {getuseToast} from '@/composables/usarToast';

const modulos = ref([]); // Aquí se almacena la lista de módulos
const selectedModule = ref(null); // Aquí se almacena el módulo seleccionado para edición
const moduloDialog = ref(false); // Dialogo de edición
const submitted = ref(false); // Indica si el formulario ha sido enviado
const base64File = ref(null); // Aquí se almacena la imagen seleccionada para subir en base64
const baseUrl = getBaseUrl();
const cargando = ref(false);
const { mostrarError, mostrarInfo, mostrarExito } = getuseToast();

const rules = {
    nombre: { required, minLength: minLength(3) }, // Mínimo de 3 caracteres
    descripcion: { required, minLength: minLength(10) },// Mínimo de 10 caracteres

    // Agrega las reglas para otros campos aquí
};

const v = useVuelidate(rules, selectedModule);


onMounted(() => {
    
    fetchModulos(); //llamamos a la funcion para traer los modulos
});

const fetchModulos = async () => {
    try {
        const response = await axios.get(`${baseUrl}v1/modulos/`);
        modulos.value = response.data;
    } catch (error) {
        console.error('Error con la conexión al backend al obtener los módulos:', error);
        mostrarError('Error ', 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet.');
    }
};

const editarModulo = (modulo) => {
    selectedModule.value = { ...modulo }; // Copia el módulo seleccionado para edición
    moduloDialog.value = true;
};

const hideDialog = () => {
    moduloDialog.value = false;
    selectedModule.value = null; // Limpia el módulo seleccionado al cerrar el diálogo
    submitted.value = false; // Limpia el indicador de envío de formulario
    base64File.value = null; // Limpia la imagen seleccionada

    recaragarTabla();
};
//metodo para guardar el modulo
const guardarModulo = async () => {
    cargando.value = true;
    console.log('1223334')

    console.log('Módulo a guardar:', selectedModule.value);
    // Validar el formulario con Vuelidate
    // Validar el formulario con Vuelidate
    v.value.$touch();

    if (v.value.$error) {
        // Mostrar errores de validación si existen
        mostrarError('Error', 'Por favor, verifica los datos ingresados.');
        cargando.value = false;
        console.log(cargando.value)
    } else {
        try {

            const formData = new FormData();
            formData.append('nombre', selectedModule.value.nombre);
            formData.append('descripcion', selectedModule.value.descripcion);
            //cuando hay una imagen seleccionada
            if (base64File.value) {
                //obtener el tipo de iamgen de la imagen seleccionada
                const type = getBase64Type(base64File.value);
                //convertir la imagen seleccionada en un blob
                const base64Blob = base64ToBlob(base64File.value, '.' + type);
                formData.append('imagen', base64Blob, `modulo.${type}`);
            }


            const response = await axios.patch(`${baseUrl}v1/modulos/${selectedModule.value.id}/`, formData);
            if (response.status === 200) {
                // Actualiza selectedModule directamente con los datos de respuesta
                selectedModule.value = response.data;

                hideDialog();
                recaragarTabla(); //recaragamos la tabla
                mostrarExito('Éxito', 'El módulo se ha actualizado correctamente');
                cargando.value = false;
                base64File.value = null; // Limpia la imagen seleccionada
            }

        } catch (error) {

            if (error.code === 'ECONNABORTED') {
                mostrarError('Error', 'Tiempo de espera agotado. Por favor, verifica tu conexión a Internet.');
            } else if (error.response) {
                mostrarError('Error', error.response.data);
                mostrarError('Error', 'Ha ocurrido un error al guardar la información.');
            } else {
                mostrarError('Error', 'Ha ocurrido un error al actualizar el módulo. Por favor, verifica tu conexión a Internet.');
                console.error('Error con la conexión a la API al actualizar el módulo:', error);
            }
            cargando.value = false;

        }
    }

};

//funcion para recaragar la tabla cuando hay cambios en la base de datos al momento de guaradra en el modulo
const recaragarTabla = async () => {
    try {
        const response = await axios.get(`${baseUrl}v1/modulos/`);
        modulos.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error ', detail: 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet. Si el problema persiste, comunícate con el soporte técnico', life: 3000 });
    }
};
//funcion para mostrar los mensajes de error



const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function () {
        const base64data = reader.result;
        base64File.value = base64data;
        //converitmos ka imagen en base 64
        selectedModule.value.imagen = base64data;
    };
    mostrarInfo('', 'La imagen se ha cargado correctamente');
};


</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <h5>Gestión de módulos</h5>
                <DataTable ref="dt" :value="modulos" v-model:selection="selectedModule" dataKey="id" :paginator="true"
                    :rows="5" tableStyle="flex justify-content-between"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} Modulos"
                    responsiveLayout="scroll">
                    <!-- Columnas de la tabla -->

                    <Column field="nombre" header="Nombre" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre</span>
                            {{ slotProps.data.nombre }}
                        </template>
                    </Column>
                    <Column field="descripcion" header="Descripción" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Descripción</span>
                            {{ slotProps.data.descripcion }}
                        </template>
                    </Column>
                    <Column header="Imagen">
                        <template #body="slotProps">
                            <span class="p-column-title">Imagen</span>
                            <Image :src="slotProps.data.imagen" :alt="slotProps.data.nombre" class="shadow-2" width="100"
                                preview />
                        </template>
                    </Column>
                    <Column header="Acción">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editarModulo(slotProps.data)" />
                        </template>
                    </Column>
                    <Column header="Categorias">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info mt-2"
                                @click="$router.push({ name: 'Categorias', params: { moduloId: slotProps.data.id } })" />
                        </template>

                    </Column>

                </DataTable>

                <Dialog v-model:visible="moduloDialog" :style="{ width: '670px' }" header="Editar Módulo" :modal="true"
                    class="p-fluid">
                    <div class="field">
                        <label for="nombre">Nombre</label>
                        <InputText id="nombre" v-model="selectedModule.nombre" required="true" autofocus
                            :class="{ 'p-invalid': v.nombre.$error }" />
                        <small class="p-error" v-if="v.nombre.$error"> El Nombre tiene que tener por al menos 3 caracteres
                        </small>
                    </div>
                    <div class="field">
                        <label for="descripcion">Descripción</label>
                        <Textarea id="descripcion" v-model="selectedModule.descripcion" required="true" rows="3" cols="20"
                            :class="{ 'p-invalid': v.descripcion.$error }" />
                        <small class="p-error" v-if="v.descripcion.$error"> La Descripción tiene que tener por al menos 10
                            caracteres </small>
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
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <Image :src="selectedModule.imagen" :alt="selectedModule.image" width="150" class="w-auto"
                                preview />
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button :disabled="cargando" label="Guardar" icon="pi pi-save" class="p-button-text"
                            @click="guardarModulo">
                        </Button>
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
