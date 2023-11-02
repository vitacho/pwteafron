import { ref } from 'vue';

export function useFuente() {
    const topbarStyle = ref({
        'font-family': 'Comic Sans MS, cursive, sans-serif',
    });

    return topbarStyle;
}
