const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');

const grantAccessContainer = document.querySelector('.grant-location-container');
const formContainer = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container')
let error404 = document.querySelector('.error-container');

let currentTab = userTab;
const API_KEY = "f751d9c4d3b65ea08efd137130c26ecf";
currentTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if(!formContainer.classList.contains("active")){
            //if the form is not visible
            //then make it  visible
            formContainer.classList.add("active");
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
        }
        else{
            //as the search form visible make it invisible and show the userWeather
            formContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //now we are in your weather tab,hence we have to display weather so lets check the local storage
            getFromSessionStorage();
    
        }
    }

    
}

userTab.addEventListener("click",() => {
    switchTab(userTab);
});
searchTab.addEventListener("click",() => {
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        //it converts json string to javascript object
        const coordinates = JSON.parse(localCoordinates); /// / / / / / / / / / / / / // / / / / / / / / / / / // / / / / / // / / / / / / / / / / /
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");


    //api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        // error404?.classList.add("active");

        userInfoContainer.classList.add("active");
        renderWeatherInfo(data)
    }
    catch(err){
        alert(err);
    }

}
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
    //   x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener('click',getLocation);

const searchInput = document.querySelector('[data-searchInput]');

formContainer.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(cityName){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    error404?.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){
        console.log(err);
        console.log("hellofadf");
    }

}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector('[data-weatherDescription]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temperature]');
    const windSpeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    //fetch the data
    if(weatherInfo.name != undefined){

        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        temp.innerText = `${(weatherInfo?.main?.temp - 273).toFixed(2)}°C`;
        desc.innerText = weatherInfo?.weather?.[0]?.description ;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    
        windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity} %`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
    } 
    else{
        // alert("error 404");
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        error404?.classList.add("active");
    }
     
}

