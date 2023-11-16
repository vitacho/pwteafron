import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { Server } from 'node:https';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue()],
        server: {
            port: 4000,
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
        
    };
});
