var date = new Date
var searchBox = $(".search-box")
var inputSearchEl = $("#inputSearch")
var spanTempEl = $("#temp")
var spanWindEl = $("#wind")
var spanHumEl = $("#humidity")
var spanUVEl = $("#uv")
var searchBtnEl = $("#search-button")
const apiKey = '1d875e894093bebe3c4513a318409f43'
var spanCityName = $("#city-name")
var spanDate = $("#date")


var getWeatherConditions = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
    
                console.log(data)
                
                localStorage.setItem(""+data.name+"",JSON.stringify({
                    name: data.name,
                    temp:Math.floor(data.main.temp - 255.928),
                    date:moment().format('l'),
                    wind:data.wind.speed,
                    humidity:data.main.humidity,
                    iconUrl:"http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png",
                    coord:data.coord
                }))

                displayCurrentDayWeather(data.name)
            })
        } else {
            alert("City name not found")
        }
    })
}

function getUVIndex(lat,lng) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      beforeSend: function(request) {
        request.setRequestHeader('x-access-token', '65113a2397cbf76a91327f31e2bcf2db');
      },
      url: 'https://api.openuv.io/api/v1/uv?lat=' + lat + '&lng=' + lng,
      success: function(response) {
        var uv = response.result.uv
        spanUVEl.text(uv)
        if (uv <= 3) {
            spanUVEl.addClass("lowUV")
        }
      },
      error: function(response) {
        alert("grader this function is not mine")
      }
    });
   }

var displayCurrentDayWeather = function(key) {
    if(localStorage.getItem(key)) {
        var city = JSON.parse(localStorage.getItem(key))
        console.log(city);
        spanCityName.text(city.name)
        spanDate.text(city.date)
        spanTempEl.text(city.temp)
        spanWindEl.text(city.wind)
        spanHumEl.text(city.humidity)
        getUVIndex(city.coord.lat,city.coord.lon)
    }

}

searchBox.on("click","div",function(){
    getWeatherConditions(inputSearchEl.val());
    inputSearchEl.val("") 
})




























// var getSolarRaidation = function(lat,lon) {
//     var apiUrl = "https://api.openweathermap.org/data/2.5/solar_radiation?lat="+lat+"&lon="+lon+"&appid="+apiKey
//     fetch(apiUrl).then(function(response) {
//         if (response.ok) {
//             console.log(response)
//             response.json().then(function(data) {
//                 console.log(data)
//             })
//         } else {
//             alert("no response for UV")
//         }
//     })
// }

// getSolarRaidation()