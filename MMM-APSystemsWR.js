Module.register("MMM-APSystemsWR", {
  defaults: {
    updateInterval: 10 * 60 * 1000, // every 10 minutes
    text: "Tomorrow's Weather",
    lat: "",
    lon: "",
    api_key: "",
  },
  start: function () {
    Log.info("Starting Module: " + this.name);
    Log.info("Starting dingens durch hier");
    this.weather = null;

    this.sheduleUpdate();
  },
  getStyles: function () {
    return ["MMM-APSystemsWR.css"];
  },
  getWeather: function () {
    this.sendSocketNotification("GET_DATA", {
      lat: this.config.lat,
      lon: this.config.lon,
      api_key: this.config.api_key,
    });
    this.updateDom();
  },
  processWeather: function (data) {
    this.weather = data;
    //Datenverarbeitung
    this.updateDom();
  },
  getDom: function () {
    if (this.weather == null) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = "Loading...";
      return wrapper;
    } else {
      var container = document.createElement("div");
      var value = document.createElement("p");
      value.innerText = this.weather;
      container.appendChild(value);
      return container;
    }
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification === "WR_RESULT") {
      Log.log("Data kommt an");
      this.processWeather(payload);
      this.updateDom();
    }
  },
  sheduleUpdate: function () {
    var self = this;
    setInterval(function () {
      self.getWeather();
    }, this.config.updateInterval);
    self.getWeather();
  },
});

/*
for(let i = 0; i < 4; i++) {
                const time = new Date(this.weather.timelines.hourly[3*i].time).toLocaleTimeString()
                Log.info(time)
                wrapper.appendChild(document.createElement("p").innerText = time)
                wrapper.appendChild(document.createElement("p").innerText = `Temp: ${Math.round(this.weather.timelines.hourly[3*i].temperature)}`)
                wrapper.appendChild(document.createElement("p").innerText = `Gefühlte Temp: ${Math.round(this.weather.timelines.hourly[3*i].temperatureApparent)}`)
                wrapper.appendChild(document.createElement("p").innerText = `UV-Index: ${Math.round(this.weather.timelines.hourly[3*i].uvIndex)}`)
                wrapper.appendChild(document.createElement("p").innerText = `Regenmenge(mm): ${this.weather.timelines.hourly[3*i].rainIntensity}`)
                
            }
*/
