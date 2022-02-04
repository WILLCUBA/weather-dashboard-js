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
var imgIconCurrenDay = $("#icon-current-day")
var srchHisContEl = $("#search-history")
var citiesUlEl = $("#cities")
var startdate = moment().format('MM-DD-YYYY')


var getWeatherConditions = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {    
                //store city name in local storage\
                console.log(data);
                let currentCity = data.name
                localStorage.setItem(""+data.name,data.name)
                renderSearchHist(currentCity)
                displayDailyForecast(data,currentCity)
            })
        } else {
            alert("City name not found")
            return false
        }
    })
}

// function getUVIndex(lat,lng) {
//     $.ajax({
//       type: 'GET',
//       dataType: 'json',
//       beforeSend: function(request) {
//         request.setRequestHeader('x-access-token', '65113a2397cbf76a91327f31e2bcf2db');
//       },
//       url: 'https://api.openuv.io/api/v1/uv?lat=' + lat + '&lng=' + lng,
//       success: function(response) {
//         var uv = response.result.uv
//         spanUVEl.text(uv)
//         if (uv < 3) {
//             spanUVEl.attr("class","lowUV")
//         } else if (3<uv && uv<6) {
//             spanUVEl.attr("class","modUV")
//         } else if (6<uv&&uv<8) {
//             spanUVEl.attr("class","highUV")
//         } else if (8<uv&&uv<11){
//             spanUVEl.attr("class","vhighUV")
//         } else {
//             spanUVEl.attr("class","extrUV")
//         }
//       },
//       error: function(response) {
//         alert("grader this function is not mine")
//       }
//     });
//    }


searchBox.on("click","div",function(){
    getWeatherConditions(inputSearchEl.val());
    
})

var renderSearchHist = function(currentCity) {
    let btnExist = document.getElementById(currentCity)
    
    if(localStorage.length === 0 || currentCity === "") {
        console.log("nothing in local storage");
        return false
    } 
    if (currentCity === undefined) {
        Object.keys(localStorage).forEach(element => {
        var btnSrch = $("<p>")
        btnSrch.text(element)
        btnSrch.addClass("btn")
        btnSrch.addClass("btn-secondary")
        citiesUlEl.append(btnSrch)
        })
        return false
    }
    var btnSrch = $("<p>")
        btnSrch.text(currentCity)
        btnSrch.addClass("btn")
        btnSrch.addClass("btn-secondary")
        btnSrch.attr("id",currentCity)
        citiesUlEl.append(btnSrch)
}   

var displayCurrentDay = function(data,currentCity) {
    //cd = current day
    $("#currentDay").html("")
    let cdInfo = $("<div>").addClass("d-flex").addClass("justify-content-between")
    $("#currentDay").append(cdInfo)
    //city name
    let pCityName = $("<p>").text(currentCity).addClass("h1")
    cdInfo.append(pCityName)
    //date
    var pDate = $("<p>").text(""+moment().format('l')).addClass("h1");
    cdInfo.append(pDate)
    //icon
    let cdImg = $("img")
    cdImg.attr("src","https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
    cdInfo.append(cdImg)
}

var displayDailyForecast = function(currentCity) {
    let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&cnt=4&appid=" + apiKey
    fetch(forecastQueryURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {    
                //store city name in local storage
                $("#forecast-cards").html("")
                for (let i = 0; i < data.list.length; i++) {
                    let forecastCard = $("<div>").addClass("card").attr("style","width:10rem;")
                    $("#forecast-cards").append(forecastCard)
                    //forecast date
                    var new_date = moment(startdate, "DD-MM-YYYY").add(i+1,'days');
                    var day = new_date.format('DD');
                    var month = new_date.format('MM');
                    var year = new_date.format('YYYY');
                    let frcstDate = $("<h5>").text("Date "+month+"/"+day+"/"+year)
                    forecastCard.append(frcstDate)
                    //img icon
                    let frcimgIcon = $("<img>")
                    frcimgIcon.attr("id","icon-day-"+(i+1)+"")
                    frcimgIcon.attr("src","https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png")
                    forecastCard.append(frcimgIcon)
                    //temperature
                    let frcTemp = $("<p>")
                    frcTemp.text("Temperature: "+Math.floor(data.list[i].main.temp - 255.18))
                    forecastCard.append(frcTemp)
                    //humidity
                    let frcHumidity = $("<p>")
                    frcHumidity.text("Humidity: "+data.list[i].main.humidity)
                    forecastCard.append(frcHumidity)
                    //wind
                    let frcWind = $("<p>")
                    frcWind.text("Wind: "+data.list[i].wind.speed)
                    forecastCard.append(frcWind)
                }
                    
                
            })
        } else {
            console.log("Forecast API ERROR");
            return false
        }
    })
}

displayDailyForecast(Object.keys(localStorage)[Object.keys(localStorage).length-1])
displayCurrentDay(Object.keys(localStorage)[Object.keys(localStorage).length-1])
renderSearchHist()