<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { getBaseUrl } from '@/composables/useURL';
import { getuseToast } from '@/composables/usarToast';
import axios from 'axios';
import { required, minLength, helpers, email, not, sameAs } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const { layoutConfig } = useLayout();
const baseUrl = getBaseUrl();
const isCommonPassword = (value) => ['123456', 'password', 'admin'].indexOf(value) === -1;
const isNumeric = (value) => !/^\d+$/.test(value);

const usuario = ref({
    username: '',
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    password2: '',
});

const errores = ref({
    username: '',
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    password2: '',
});

const { mostrarAdvertencia, mostrarError, mostrarInfo, mostrarExito } = getuseToast();


const usernamePattern = (value) => /^[a-zA-Z0-9@.+_-]+$/.test(value);
const igual = (value) => value === usuario.value.password;
// Validación de formulario con Vuelidate
const rules_usuario = {
    username: {
        required: helpers.withMessage('El nombre de usuario es requerido', required),
        minLength: helpers.withMessage('El nombre de usuario debe tener al menos 3 caracteres', minLength(3)),

        usernamePattern: helpers.withMessage('El nombre de usuario solo puede contener letras, dígitos y los caracteres @/./+/-/_', usernamePattern),
    },
    email1: {
        required: helpers.withMessage('El correo electrónico es requerido', required),
        email: helpers.withMessage('El correo electrónico debe ser válido', email),
    },
    nombre: {
        required: helpers.withMessage('El nombre es requerido', required),
        minLength: helpers.withMessage('El nombre debe tener al menos 3 caracteres', minLength(3)),
    },
    apellido: {
        required: helpers.withMessage('El apellido es requerido', required),
        minLength: helpers.withMessage('El apellido debe tener al menos 3 caracteres', minLength(3)),
    },
    password: {
        required: helpers.withMessage('La contraseña es requerida', required),
        minLength: helpers.withMessage('La contraseña debe tener al menos 8 caracteres', minLength(8)),
        notCommon: helpers.withMessage('La contraseña no puede ser una clave utilizada comúnmente', isCommonPassword),
        notNumeric: helpers.withMessage('La contraseña no puede ser completamente numérica', isNumeric),
        notSameAsUsername: helpers.withMessage('La contraseña no puede asemejarse tanto a su otra información personal', not(sameAs('username'))),

    },
    password2: {
        required: helpers.withMessage('La contraseña repetida es requerida', required),
        //verificamos que usuario.value.password la contraseña sea igual a la usuario.value.password2
        sameAsPassword: helpers.withMessage('Las contraseñas no coincide', igual)// can be passed a ref to compare
    },

};

const validarusuario = useVuelidate(rules_usuario, usuario);
const inicioseccion = async () => {
    try {
        console.log(usuario.value.password);
        validarusuario.value.$touch();


        if (validarusuario.value.$error) {
            mostrarError('Advertencia', 'Debe de completar el formulario');
            // for para mostrar cada uno de los errores
            console.log(validarusuario.value.$errors);

            return;

        } else {

        }


        const fromData = new FormData();
        fromData.append('username', usuario.value.username);
        fromData.append('password', usuario.value.password);
        fromData.append('email', usuario.value.email1);
        fromData.append('first_name', usuario.value.nombre);
        fromData.append('last_name', usuario.value.apellido);
        fromData.append('password2', usuario.value.password2);



        const response = await axios.post(`${baseUrl}v1/usuario/registrousuario`, fromData)


        if (response.status === 201 ){
            mostrarExito('Exito', 'Se ha creado el usuario correctamente');
            //localStorage.setItem('token', response.data.token);
        }

    } catch (error) {

        if (error.request.status === 400) {
            console.log(error); // Imprimir el error en la consola
            mostrarError('Error', 'Revise los datos ingresados');
            errores.value.username = error.response.data.username ? error.response.data.username[0] : '';
            errores.value.email = error.response.data.email ? error.response.data.email[0] : '';
            errores.value.nombre = error.response.data.first_name ? error.response.data.first_name[0] : '';
            errores.value.apellido = error.response.data.last_name ? error.response.data.last_name[0] : '';
            errores.value.password = error.response.data.password ? error.response.data.password[0] : '';
            errores.value.password2 = error.response.data.password2 ? error.response.data.password2[0] : '';



        } else {
            // Algo sucedió al configurar la solicitud que provocó un error
            mostrarError('Error', error.response.data);
        }

    }


};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Toast />
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Registro</div>
                        <span class="text-600 font-medium">Registrate para continuar</span>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="username1" class="block text-900 text-xl font-medium mb-2">Usuario </label>
                            <InputText id="username1" type="text" placeholder="Únicamente letras, dígitos y @/./+/-/_"
                                :class="['w-full', 'md:w-30rem', '', validarusuario.username.$error ? 'p-invalid' : 'Ingresa tu usuario ']"
                                style="padding: 1rem" v-model="usuario.username" />
                            <div class="field col">
                                <div v-if="validarusuario.username.$errors">
                                    <small class="p-error" v-for="(error, index) in validarusuario.username.$errors"
                                        :key="index">
                                        {{ error.$message }}
                                        <br>
                                    </small>
                                </div>
                                <samll v-if="errores.username" class="p-error">
                                    {{ errores.username }}
                                </samll>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="correo1" class="block text-900 text-xl font-medium mb-2">Correo
                                electrónico</label>
                            <InputText id="correo1" type="text" placeholder="Correo electrónico"
                                :class="['w-full', 'md:w-30rem', '', validarusuario.email1.$error ? 'p-invalid' : 'Ingresa tu usuario o correo electronico']"
                                style="padding: 1rem" v-model="usuario.email1" />
                            <div class="field col">
                                <div v-if="validarusuario.email1.$errors">
                                    <small class="p-error" v-for="(error, index) in validarusuario.email1.$errors"
                                        :key="index">
                                        {{ error.$message }}
                                        <br>
                                    </small>
                                </div>
                                <samll v-if="errores.email" class="p-error">
                                    {{ errores.email }}
                                </samll>
                            </div>
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="nombre" class="block text-900 text-xl font-medium mb-2">Nombre</label>
                            <InputText id="nombre" type="text" placeholder="Nombres"
                                :class="['w-full', 'md:w-30rem', '', validarusuario.nombre.$error ? 'p-invalid' : 'Ingrese su nombre']"
                                style="padding: 1rem" v-model="usuario.nombre" />
                            <div class="field col">

                                <div v-if="validarusuario.nombre.$errors">
                                    <small class="p-error" v-for="(error, index) in validarusuario.nombre.$errors"
                                        :key="index">
                                        {{ error.$message }}
                                        <br>
                                    </small>
                                </div>
                                <small v-if="errores.nombre" class="p-error">
                                    {{ errores.nombre }}
                                </small>

                            </div>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="Apellido" class="block text-900 text-xl font-medium mb-2">Apellido</label>
                            <InputText id="apellido1" type="text" placeholder="Apellido"
                                :class="['w-full', 'md:w-30rem', validarusuario.apellido.$error ? 'p-invalid' : 'Ingrese su nombre']"
                                style="padding: 1rem" v-model="usuario.apellido" />
                            <div class="field col">
                                <div v-if="validarusuario.apellido.$errors">
                                    <small class="p-error" v-for="(error, index) in validarusuario.apellido.$errors"
                                        :key="index">
                                        {{ error.$message }}
                                        <br>
                                    </small>
                                </div>
                                <samll v-if="errores.apellido" class="p-error">
                                    {{ errores.apellido }}
                                </samll>
                            </div>
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                            <Password id="password1" v-model="usuario.password" placeholder="Contraseña mínimo 8 caracteres"
                                :feedback="true" :toggleMask="true"
                                :class="['w-full', 'md:w-30rem', validarusuario.password.$error ? 'p-invalid' : '']"
                                inputClass="w-full" :inputStyle="{ padding: '1rem' }"
                                :weakLabel="'Débil'" :mediumLabel="'Medio'" :strongLabel="'Fuerte'"
                                :promptLabel="'Ingrese una contraseña'"
                                >
                                <template #header>
                                    <h6>Eliga una constraseña</h6>
                                </template>
                                <template #footer>
                                    <Divider />
                                    <p class="mt-2">Sugerencia</p>
                                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                        <li>Al menos una minúscula</li>
                                        <li>Al menos una mayúscula</li>
                                        <li>Al menos un número</li>
                                        <li>Mínimo 8 caracteres</li>
                                    </ul>
                                </template>

                            </Password>
                            
                            <div class="field col">
                                <div v-if="validarusuario.password.$errors">
                                    <small class="p-error" v-for="(error, index) in validarusuario.password.$errors"
                                        :key="index">
                                        {{ error.$message }}
                                        <br>
                                    </small>
                                </div>
                                <samll v-if="errores.password" class="p-error">
                                    {{ errores.password }}
                                </samll>
                            </div>
                        </div>



                        <div class="field col-12 md:col-6">
                            <label for="password2" class="block text-900 font-medium text-xl mb-2">Repetir
                                contraseña</label>
                            <Password id="password2" v-model="usuario.password2" placeholder="Repetir la contraseña"
                                :feedback="false" :toggleMask="true"
                                :class="['w-full', 'md:w-30rem', validarusuario.password2.$error ? 'p-invalid' : 'Ingresa tu contraseña']"
                                inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                            <div class="field col">
                                <div v-if="validarusuario.password2.$errors">
                                    <small class="p-error" v-for="(error, index) in validarusuario.password2.$errors"
                                        :key="index">
                                        {{ error.$message }}
                                        <br>
                                    </small>
                                    <small v-if="errores.password2" class="p-error">
                                        {{ errores.password2 }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="flex align-items-center justify-content-end mb-5 gap-5">
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                                style="color: var(--primary-color)"
                                @click="$router.push({ path: '/auth/inicioseccion' })">Si ya
                                tienes cuenta Inicia
                                Sección</a>
                        </div>
                        <Button label="Registrase" class="w-full p-3 text-xl" @click="inicioseccion"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
