import { ref } from 'vue';

export function getresponsiveOptins() {
    const responsiveOptions = ref([
        {
            breakpoint: '5500px',
            numVisible: 10,
            numScroll: 1
         },
        {
            breakpoint: '4096px',
            numVisible: 8,
            numScroll: 1
         },
         {
            breakpoint: '2560px',
            numVisible: 6,
            numScroll: 1
         }
       ,
         {
            breakpoint: '1920px',
            numVisible: 5,
            numScroll: 1
         },
         {
            breakpoint: '1600px',
            numVisible: 4,
            numScroll: 1
         },
         {
            breakpoint: '1400px',
            numVisible: 3,
            numScroll: 1
         },
         {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
         },
         {
            breakpoint: '1000px',
            numVisible:2,
            numScroll:1
         },
         {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
         },
         {
            breakpoint: '681px',
            numVisible: 1,
            numScroll: 1
         },
         {
            breakpoint: '600px',
            numVisible: 1,
            numScroll: 1
         },
         {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
         }
    ]);

    return {
        responsiveOptions,
    };
}
