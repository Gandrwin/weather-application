// Global Location API 
var apiGeolocationSuccess = function (position) {
    loadWeather(position.coords.latitude + ',' + position.coords.longitude);
};

var tryAPIGeolocation = function () {
    jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDp4BTuQZsUbPF5d5YjZReu0dJl9YdzreM", function (success) {
            apiGeolocationSuccess({
                coords: {
                    latitude: success.location.lat,
                    longitude: success.location.lng
                }
            });
        })
        .fail(function (err) {
            alert("API Geolocation error! \n\n" + err);
        });
};

var browserGeolocationSuccess = function (position) {
    alert("Browser geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
};

var browserGeolocationFail = function (error) {
    switch (error.code) {
        case error.TIMEOUT:
            alert("Browser geolocation error !\n\nTimeout.");
            break;
        case error.PERMISSION_DENIED:
            if (error.message.indexOf("Only secure origins are allowed") == 0) {
                tryAPIGeolocation();
            }
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Browser geolocation error !\n\nPosition unavailable.");
            break;
    }
};

var tryGeolocation = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            browserGeolocationSuccess,
            browserGeolocationFail, {
                maximumAge: 50000,
                timeout: 20000,
                enableHighAccuracy: true
            });
    }
};

tryGeolocation();


// Actual weather aplication 
if ('geolocation' in navigator) {
    var x = 'position';
    navigator.geolocation.getCurrentPosition(function (position) {
        loadWeather(position.coords.latitude + ',' + position.coords.longitude);
    });

} else {
    loadWeather('Sibiu, IN', "");
}

$(document).ready(function (loadWeather) {
    setInterval(function () {
        loadWeather(x);
    }, 10000);



});

// Load the application function 

function loadWeather(location, woeid) {
    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'c',
        success: function (weather) {
            city = weather.city;
            temp = weather.temp + '&deg;';
            wcode = '<img class="weathericon" src="images/weathericons/' + weather.code + '.svg">';
            wind = '<p>' + weather.wind.speed + '<br></p<p>' + weather.units.speed + '</p>';
            humidity = weather.humidity + ' %';

            $(".location").text(city);
            $(".temperature").html(temp);
            $(".climate_bg").html(wcode);
            $(".windspeed").html(wind);
            $(".humidity").text(humidity);
        },
        error: function (error) {
            $(".error").html('<p>' + error + '</p>');
        }

    });

}
// Refresh interval for the WeatherApp
