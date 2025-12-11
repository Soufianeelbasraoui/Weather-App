

const apiKey = "9b84f42d0f4625a201f4e06b12067f89";

const searchinput=document.getElementById("searchinput");
const searchbtn=document.getElementById("searchbtn");


async function checkWeather(city) {

    console.log(city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);
    document.getElementById("title-city").innerHTML=data.name;
    document.getElementById("temperature").innerHTML=data.main.temp+ "°c";
    document.getElementById("Humidity").innerHTML=data.main.humidity + "%";
    document.getElementById("Wind").innerHTML=data.wind.speed  + "km/hr";
    console.log(data.weather[0].icon)
    document.getElementById("img-city").src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
    convertTime(data);
    convertsunrise(data)
     getForecast(data.coord.lat, data.coord.lon);
     getWeekly(data.coord.lat,data.coord.lon)
}
checkWeather("rabat");
searchbtn.addEventListener("click", ()=>{
    checkWeather(searchinput.value);
      
})
//convertTime
const convertTime=(data)=>{
        const teme=data.dt;
        const timezone=data.timezone;

        const localTime=new Date((teme + timezone) *1000);
        const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    };    
    const formatted = localTime.toLocaleString('en-US', options);
    document.getElementById("day").innerHTML=formatted;
    }
//conertersunrise
const convertsunrise=(data)=>{
    const sunriseTimestamp=data.sys.sunrise;
    const timezone = data.timezone;
    const sunriseTime = new Date((sunriseTimestamp + timezone) * 1000);
     const options = {
    hour: '2-digit',
    minute: '2-digit'
     };
     const formattedSunrise = sunriseTime.toLocaleTimeString('en-US', options);
    document.getElementById("sunrise").innerHTML = formattedSunrise;
}
// getForecast 
 function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=9&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data =>{ 
    console.log("Forecast data:", data);
    
    const forecastDiv = document.querySelector(".forecast");
    forecastDiv.innerHTML = ""; 
    data.list.forEach((item, index) => {
        const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            hour12: true
        });

        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        const temp = Math.round(item.main.temp);

        forecastDiv.innerHTML += `
            <div class="item ${index === 0 ? "now" : ""}">
                <span class="time">${index === 0 ? "Now" : time}</span>
                <span class="icon">
                    <img src="${icon}" width="35">
                </span>
                <span class="temp">${temp}°</span>
            </div>
        `;
    });
    })
}
//Weekly Forecast
function getWeekly(lat,lon){
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
      .then(response => response.json())
      .then(data =>{
        console.log("weekly data : ", data);
        const weekdayfascat=document.querySelector(".weekly-cards");
        weekdayfascat.innerHTML="";
         const dailyData = data.list.filter((item, index) => index % 8 === 0);
        const sixdays=dailyData.slice(0, 6);
        sixdays.forEach((item,index)=>{
        
        const dayName = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });

        const icons = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        const temp = Math.round(item.main.temp);
        const low = Math.round(item.main.temp_min);

          weekdayfascat.innerHTML+=`
          <div class="day-card">
         <p class="day">${dayName}</p>
            <img src="${icons}" width="35">
            <p class="temp">${temp}°c</p>
            <p class="low">${low} °c</p>
         </div>
         `
        })
       })
}

