import { useToast } from 'primevue/usetoast';

export function getuseToast() {
  const toast = useToast();

  function mostrarError(info, mensaje) {
    toast.add({ severity: 'error', summary: info, detail: mensaje, life: 5000 });
  }

  function mostrarInfo(info, mensaje) {
    toast.add({ severity: 'info', summary: info, detail: mensaje, life: 3000 });
  }

  function mostrarExito(info, mensaje) {
    toast.add({ severity: 'success', summary: info, detail: mensaje, life: 4000 });
  }

  function mostrarAdvertencia(info, mensaje) {
    toast.add({ severity: 'warn', summary: info, detail: mensaje, life: 4000 });
  }

  return {
    mostrarError,
    mostrarInfo,
    mostrarExito,
    mostrarAdvertencia,
  };
}
