<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { getBaseUrl } from '@/composables/useURL';
import { getuseToast } from '@/composables/usarToast';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { required, minLength, helpers } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const { layoutConfig } = useLayout();
const username = ref('');
const password = ref('');
const checked = ref(false);
const baseUrl = getBaseUrl();
const { mostrarAdvertencia, mostrarError, mostrarInfo, mostrarExito } = getuseToast();
const router = useRouter();

// Validación de formulario con Vuelidate
const rules_username = {
    required
    
};

const rules_password = {
    // que sea requerido y con mensaje de error
    required //ususrio requerido

};
const validarusername = useVuelidate(rules_username, username);
const validarpassword = useVuelidate(rules_password, password);

const inicioseccion = async () => {
    try {

        validarusername.value.$touch();

        validarpassword.value.$touch();

        if (validarusername.value.$error) {
            mostrarAdvertencia('Advertencia', 'Debe de ingresar su usuario');
            return;
        } else {
            if (!helpers.regex('email', username.value)) {
                mostrarAdvertencia('Advertencia', 'Debe de ingresar un correo valido');
                return;
            }
        }

        if (validarpassword.value.$error) {
            mostrarAdvertencia('Advertencia', 'Debe de ingresar su contraseña');
            return;
        }

        const fromData = new FormData();
        fromData.append('username', username.value);
        fromData.append('password', password.value);

        const response = await axios.post(`${baseUrl}v1/usuario/iniciosesion`, fromData)


        if (response.status === 200) {
            mostrarExito('!Exito', response.data.message);
            //ponemos el token en el header de axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            //vamos a la pagina de inicio mediade router
            router.push({ path: '/' });
            //agreamos el token al localstorage
            localStorage.setItem('token', response.data.token);
        } else {
            mostrarError('!Error', 'Credenciales incorrectas');
        }
    } catch (error) {
        if (error.response) {
            // La solicitud se hizo y el servidor respondió con un código de estado
            // que cae fuera del rango de 2xx
            mostrarError('!Error', error.response.data.mensaje);
        } else if (error.request) {
            // La solicitud se hizo pero no se recibió ninguna respuesta
            mostrarError('!Error', 'No se recibió ninguna respuesta del servidor');
        } else {
            // Algo sucedió al configurar la solicitud que provocó un error
            mostrarError('!Error', error);
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
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                        <span class="text-600 font-medium">Inicia sesión para continuar</span>
                    </div>

                    <div>

                        <div class="flex flex-column">
                            <label for="username1" class="block text-900 text-xl font-medium mb-2">Usuario o correo electrónico</label>
                            <InputText id="username1" type="text" placeholder="Usuario o Correo electronico"
                                :class="['w-full', 'md:w-30rem', 'mb-1', validarusername.$error ? 'p-invalid' : 'Ingresa tu usuario o correo electronico']"
                                style="padding: 1rem" v-model="username" />
                            <small class="p-error mb-3" v-if="validarusername.$error">Ingresa tu usuario o correo electrónico
                            </small>

                        </div>
                        <div class="flex flex-column">
                            

                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                            <Password id="password1" v-model="password" placeholder="Contraseña" :feedback="false" :toggleMask="true "
                            
                                :class="['w-full', 'mb-1', validarpassword.$error ? 'p-invalid' : 'Ingresa tu contraseña']"
                                inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                            <small class="p-error mb-3" v-if="validarpassword.$error">Ingresa tu contraseña </small>

                        </div>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recordarme</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                                style="color: var(--primary-color)">Olvidaste la contraseña?</a>
                        </div>
                        <div class="flex align-items-center justify-content-end mb-5 gap-5">
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                                style="color: var(--primary-color)"
                                @click="$router.push({ path: '/auth/registro' })"
                                >Si aún no ha creado una cuenta, Registrese primero.</a>
                        </div>
                        <Button label="Iniciar sesión" class="w-full p-3 text-xl" @click="inicioseccion"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
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
