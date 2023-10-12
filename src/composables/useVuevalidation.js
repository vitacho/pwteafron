import { ref } from 'vue';
import { required, email } from 'vuelidate/lib/validators';

export function useValidation() {
  const rules = {
    // Ejemplo de regla de validación para un campo de texto requerido
    required: required,

    // Ejemplo de regla de validación para un correo electrónico
    email: email,
  };

  const validations = {
    // Define las validaciones para los campos del formulario aquí
    formData: {
      nombre: {
        required: rules.required,
      },
      correo: {
        required: rules.required,
        email: rules.email,
      },
      // Agrega más campos y validaciones según sea necesario
    },
  };

  // Crea un objeto que contendrá los datos del formulario y las validaciones
  const formData = ref({
    nombre: '',
    correo: '',
    // Inicializa más campos según sea necesario
  });

  return {
    formData,
    validations,
  };
}