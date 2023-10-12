import axios from 'axios';
import { baseUrl, moduloId, mostrarErro } from './ModuloCategorias.vue';

export const fetchModulos = async () => {
try {
// /api/v1/modulos/{modulo_id}/modulo-categorias/
// /api/v1/modulos/{id}
const response = await axios.get(`${baseUrl}v1/modulos/${moduloId.value}/modulo-categorias/`);
modulos.value = response.data;
console.log(moduloId);

} catch (error) {
console.log('Error con la conexión al backend al obtener los módulos:', error);
mostrarErro('Error ', 'Se produjo un error al intentar obtener los datos. Por favor, verifica tu conexión a Internet.');
}
};
