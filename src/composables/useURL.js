import axios from 'axios';

const baseUrl = ' http://127.0.0.1:8000/api/';
const api = '01fec15fd2083f050b8f9fb7414193d8';

//const baseUrl = 'https://j1nwcn2l-8000.use2.devtunnels.ms/api/';
export function getBaseUrl() {
    return baseUrl;
}

//API del clima openweathermap
async function fetchData(latitud, longitud) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitud}&lon=${longitud}&appid=${api}&lang=es`);
        const weather = setWeather(response.data);
        return weather;
    } catch (error) {
        console.error(error);
    }
}

function setWeather(data) {
    const weather = {
        city: data.name,
        description: data.weather[0].description,
        main: data.weather[0].main,
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: data.wind.speed,
        clouds: data.clouds.all,
        message: '',
        icon: data.weather[0].icon
    };

    if (weather.description === 'cielo despejado') {
        weather.message = 'El cielo está despejado.';
    } else if (weather.description === 'algo de nubes') {
        weather.message = 'EL cielo esta con algo de nubes.';
    } else if (weather.description === 'nubes dispersas') {
        weather.message = 'El cielo tiene nubes dispersas.';
    } else if (weather.description === 'parcialmente nublado') {
        weather.message = 'Está parcialmente nublado ahora.';
    } else if (weather.description === 'mayormente nublado') {
        weather.message = 'Ahora está mayormente nublado.';
    } else if (weather.description === 'nublado') {
        weather.message = 'Está nublado en este momento.';
    } else if (weather.description === 'nubes') {
        weather.message = 'Está nublado en este momento.';
    } else if (weather.description === 'muy nuboso') {
        weather.message = 'Está muy nublado en este momento.';
    } else if (weather.description == 'lluvia ligera') {
        weather.message = 'Está lloviendo ligeramente ahora.';
    } else if (weather.description === 'lluvia moderada') {
        weather.message = 'La lluvia es moderada en este momento.';
    } else if (weather.description === 'lluvia intensa') {
        weather.message = 'Está lloviendo intensamente ahora.';
    } else if (weather.description === 'chubascos') {
        weather.message = 'Hay chubascos en este momento.';
    } else if (weather.description === 'tormentas aisladas') {
        weather.message = 'Hay tormentas aisladas en este momento.';
    } else if (weather.description === 'tormentas dispersas') {
        weather.message = 'Hay tormentas dispersas en este momento.';
    } else if (weather.description === 'tormentas fuertes') {
        weather.message = 'Las tormentas son fuertes en este momento.';
    } else if (weather.description === 'niebla ligera') {
        weather.message = 'Hay niebla ligera en este momento.';
    } else if (weather.description === 'niebla moderada') {
        weather.message = 'La niebla es moderada en este momento.';
    } else if (weather.description === 'niebla densa') {
        weather.message = 'Hay niebla densa en este momento.';
    } else if (weather.description === 'nevadas ligeras') {
        weather.message = 'Hay nevadas ligeras en este momento.';
    } else if (weather.description === 'nevadas moderadas') {
        weather.message = 'Las nevadas son moderadas en este momento.';
    } else if (weather.description === 'nevadas intensas') {
        weather.message = 'Las nevadas son intensas ahora.';
    } else if (weather.description === 'granizo') {
        weather.message = 'Está granizando en este momento.';
    } else if (weather.description === 'tormenta con lluvia ligera') {
        weather.message = 'El cielo esta haciendo ruido con gotas de agua.';
    } else if (weather.description === 'tormenta de nieve') {
        weather.message = 'Hay una tormenta de nieve en este momento.';
    } else if (weather.description === 'tormenta de arena') {
        weather.message = 'Hay una tormenta de arena en este momento.';
    } else if (weather.description === 'tormenta de polvo') {
        weather.message = 'Hay una tormenta de polvo en este momento.';
    } else if (weather.description === 'tornado') {
        weather.message = 'Hay un tornado en este momento.';
    } else if (weather.description === 'huracán') {
        weather.message = 'Hay un huracán en este momento.';
    } else if (weather.description === 'tsunami') {
        weather.message = 'Hay un tsunami en este momento.';
    } else {
        weather.message = 'No hay información disponible sobre el clima en este momento.';
    }
    console.log(weather);
    return weather;
}

export function fetchPosision() {
    console.log('fetchPosision');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async function (position) {
            console.log('Latitude is :', position.coords.latitude);
            console.log('Longitude is :', position.coords.longitude);
            try {
                const weather = await fetchData(position.coords.latitude, position.coords.longitude);
                resolve(weather);
            } catch (error) {
                reject(error);
            }
        });
    });
}
