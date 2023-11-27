import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AppLayoutJuegos from '@/layout/AppLayoutJuego.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path:'/palabras',
                    name:'crudpalabras',
                    component: () => import('@/views/pages/Palabras.vue')
                },
                {
                    path: '/modulos',
                    name: 'crudmodulos',
                    component: () => import('@/views/pages/Modulos.vue')
                },
                {
                    path: 'modulos/categorias/:moduloId',
                    name: 'Categorias',
                    component: () => import('@/views/pages/ModuloCategorias.vue'),
                    props: true // Esto permite recibir el parámetro como una propiedad en el componente
                },
                {
                    path: 'modulos/categorias/activiades_pictogramas/:categoriaId',
                    name: 'ActividadesCrudPictograma',
                    component: () => import('@/views/pages/ActividadesPictograma.vue'),
                    props: true // Esto permite recibir el parámetro como una propiedad en el componente
                },
                {
                    path: 'modulos/categorias/activiades_ordenar_oraciones/:categoriaId',
                    name: 'ActividadesOrdenarOraciones',
                    component: () => import('@/views/pages/ActividadesOrdenarOraciones.vue'),
                    props: true // Esto permite recibir el parámetro como una propiedad en el componente categoriaId

                },

                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
                }
            ]
        },
    
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('@/views/pages/NotFound.vue')
        },
        //componets para los juegos
        {
            path: '/juegos',
            component: AppLayoutJuegos,
            children: [
                {
                    path: '/juegos/',
                    name: 'dashboardjuegos',
                    component: () => import('@/views/Dashboardjuegos.vue')
                },

                {
                    path: '/juegos/categorias/:moduloId',
                    name: 'CategoriasJuegos',
                    component: () => import('@/views/pages/juegos/Categorias.vue'),
                    props: true // Esto permite recibir el parámetro como una propiedad en el componente
                },
                {
                    path: '/juegos/categorias/pictograma/:categoriaId',
                    name: 'ActividaPictogramaJuegos',
                    component: () => import('@/views/pages/juegos/ActvidadPictograma.vue'),
                    props: true // Esto permite recibir el parámetro como una propiedad en el componente
                },

            ]
        }
    ]
});

export default router;
