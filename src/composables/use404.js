import { useRouter } from 'vue-router';

export default function use404() {
    const router = useRouter();

    function redirectToPage(pageName) {
        router.replace({ name: pageName });
    }

    return {
        redirectToPage,
    };
}
