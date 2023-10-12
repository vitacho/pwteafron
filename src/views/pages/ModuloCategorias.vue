<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';

import { getBaseUrl } from '@/composables/useURL';
import { base64ToBlob, getBase64Type } from '@/composables/useBase64';

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import {getuseToast} from '@/composables/usarToast';


const route = useRoute();

const categorias = ref([]); // Aquí se almacena la lista de módulos
const selectedCategoria = ref(null); // Aquí se almacena el módulo seleccionado para edición
const moduloDialog = ref(false); // Dialogo de edición y de nuevo
const eliminarCategoriaDialog = ref(false); // Dialogo de confirmación de eliminación
const submitted = ref(false); // Indica si el formulario ha sido enviado
const base64File = ref(null); // Aquí se almacena la imagen seleccionada para subir en base64
const baseUrl = getBaseUrl();
const cargando = ref(false);
const moduloId = ref(route.params.moduloId);
const modulo = ref(null);
const router = useRouter();
const { mostrarError, mostrarInfo, mostrarExito } = getuseToast();

//funcion para traer el modulo y su actulizacion cunado sea necesario



// Validación de formulario con Vuelidate
const rules = {
    nombre: { required, minLength: minLength(3) }, // Mínimo de 3 caracteres
    descripcion: { required, minLength: minLength(10) },// Mínimo de 10 caracteres
    imagen: { required },
    // Agrega las reglas para otros campos aquí
};

const v = useVuelidate(rules, selectedCategoria);



onMounted(async () => {

    obtnerNombreMdulo();
    await fetchCategorias();

});


//funcion para traer las categorias y su actulizacion cunado sea necesario 
const fetchCategorias = async () => {
    try {

        const response = await axios.get(`${baseUrl}v1/modulos/${moduloId.value}/modulo-categorias/`);
        // const responsee = await axios.get(`${baseUrl}v1/modulos/${moduloId.value}`);

        console.log(moduloId.value)
        if (response.status === 200) {
            categorias.value = response.data;
        }


    } catch (error) {
        router.replace({ name: '404' });
        categorias.value = {};
        console.log(error);

    }
};

const editarModulo = (modulo) => {
    selectedCategoria.value = { ...modulo }; // Copia el módulo seleccionado para edición
    moduloDialog.value = true;
};

const eliminarCategoriaConfirmar = (categoria) => {
    selectedCategoria.value = categoria;
    eliminarCategoriaDialog.value = true;

};


const eliminarCategoria = async () => {
    console.log('eliminar');
    try {
        //obtenemos el id de la categoria a elimina

        //eliminamos la categoria
        const response = await axios.delete(`${baseUrl}v1/categorias/${selectedCategoria.value.id}/`);
        if (response.status === 204) {
            //recaragamos la tabla
            
            mostrarExito('Éxito', 'La categoria se ha eliminado correctamente');
            fetchCategorias();
            eliminarCategoriaDialog.value = false;
            selectedCategoria.value = {};

        }

    } catch (error) {
        mostrarErro('Error', 'No se puede eliminar la Categoria se .');
    }
};

const hideDialog = () => {
    moduloDialog.value = false;
    selectedCategoria.value = null; // Limpia el módulo seleccionado al cerrar el diálogo
    submitted.value = false; // Limpia el indicador de envío de formulario
    base64File.value = null; // Limpia la imagen seleccionada
    v.value.$reset(); // Limpia los errores de validación
    fetchCategorias(); //recargasmos la tabla
    selectedCategoria.value = {}; //limpiamos el objeto de la categoria
};

const obtnerNombreMdulo = async () => {
    try {
        const response = await axios.get(`${baseUrl}v1/modulos/${moduloId.value}/`);
        if (response.status === 200) {
            modulo.value = response.data.nombre;
            console.log(modulo.value);

        }

    } catch (error) {
        console.log('El mosulo no existe');
        router.replace({ name: '404' });
        console.log(error);
    }
};

//metodo para guardar el modulo
const guardarCategoria = async () => {
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
            formData.append('nombre', selectedCategoria.value.nombre);
            formData.append('descripcion', selectedCategoria.value.descripcion);
            formData.append('modulo', moduloId.value);
            //cuando hay una imagen seleccionada

            //cuando hay una imagen seleccionada
            if (base64File.value) {
                //obtener el tipo de iamgen de la imagen seleccionada
                const type = getBase64Type(base64File.value);
                //convertir la imagen seleccionada en un blob
                const base64Blob = base64ToBlob(base64File.value, '.' + type);
                formData.append('imagen', base64Blob, `modulo.${type}`);
            }

            console.log('Módulo a guardar:', selectedCategoria.value);

            // Si el módulo existe, actualizarlo
            if (selectedCategoria.value.id) {
                // Actualizar el módulo
                // /api/v1/categorias/
                const response = await axios.patch(`${baseUrl}v1/categorias/${selectedCategoria.value.id}/`, formData);

                // Actualiza selectedCategoria directamente con los datos de respuesta
                selectedCategoria.value = response.data;
                //recaragamos la tabla
                mostrarExito('Éxito', 'El módulo se ha actualizado correctamente');


            } else {
                const response = await axios.post(`${baseUrl}v1/categorias/`, formData);
                if (response.status === 201) {
                    //recaragamos la tabla
                    mostrarExito('Éxito', 'La categoria se ha creado correctamente');
                }
            }
            hideDialog();
            cargando.value = false;
            base64File.value = null; // Limpia la imagen seleccionada
            selectedCategoria.value = {};

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
};

const openNew = () => {
    selectedCategoria.value = {};
    moduloDialog.value = true;
};

//funcion para mostrar los mensajes de error


;

const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = function () {
        const base64data = reader.result;
        base64File.value = base64data;
        //converitmos ka imagen en base 64
        selectedCategoria.value.imagen = base64data;
    };
    mostrarInfo('Éxito', 'La imagen se ha cargado correctamente');
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <h5>Gestión de Categorias del modulo {{ modulo }}</h5>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />

                        </div>
                    </template>
                </Toolbar>


                <DataTable ref="dt" :value="categorias" v-model:selection="selectedCategoria" dataKey="id" :paginator="true"
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
                            <Image :src="slotProps.data.imagen" :alt="slotProps.data.image" class="shadow-2" width="100"
                                preview />
                        </template>
                    </Column>
                    <Column header="Acción">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editarModulo(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                                @click="eliminarCategoriaConfirmar(slotProps.data)" />
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
                        <InputText id="nombre" v-model="selectedCategoria.nombre" required="true" autofocus
                            :class="{ 'p-invalid': v.nombre.$error }"
                            placeholder="Escribe el nombre del categoria aquí ejemplo Mátematica" />
                        <small class="p-error" v-if="v.nombre.$error"> El Nombre tiene que tener por al menos 3 caracteres
                        </small>
                    </div>
                    <div class="field">
                        <label for="descripcion">Descripción</label>
                        <Textarea id="descripcion" v-model="selectedCategoria.descripcion" required="true" rows="3"
                            cols="20" :class="{ 'p-invalid': v.descripcion.$error }" 
                            placeholder="Escribe la descripción de la categoria aquí"
                            />
                        <small class="p-error" v-if="v.descripcion.$error"> La Descripción tiene que tener por al menos 10
                            caracteres </small>
                    </div>
                    <div class="field">
                        <div class="field">
                            <FileUpload mode="basic" id="input-foto" name="imagen" accept="image/*" customUpload
                                @uploader="customBase64Uploader" chooseLabel="Subir imagen"
                                invalidFileSizeMessage="El tamaño máximo de la imagen permitido es 5MB"
                                invalidFileLimitMessage="Solo se admite un archivo a la vez"
                                invalidFileTypeMessage="Solo se admite formato de imagen PNG, JPG, JPEG"
                                :maxFileSize="5000000" :showUploadButton="false" :showCancelButton="false" :auto="true">
                            </FileUpload>
                            <small class="p-error" v-if="v.imagen.$error"> Tienes que subir una imagen </small>
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <Image :src="selectedCategoria.imagen" :alt="selectedCategoria.image" width="150" class="w-auto"
                                preview />
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button :disabled="cargando" label="Guardar" icon="pi pi-save" class="p-button-text"
                            @click="guardarCategoria">
                        </Button>
                    </template>
                </Dialog>


                <Dialog v-model:visible="eliminarCategoriaDialog" :style="{ width: '450px' }" header="Confirmar"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="selectedCategoria">¿Estas seguro de eliminar esta categoria?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="eliminarCategoriaDialog = false" />
                        <Button label="Si" icon="pi pi-check" class="p-button-text" @click="eliminarCategoria" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
