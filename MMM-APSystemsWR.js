Module.register("MMM-APSystemsWR", {
  defaults: {
    updateInterval: 60 * 1000, // every 10 minutes
    text: "Tomorrow's Weather",
    lat: "",
    lon: "",
    api_key: "",
  },
  start: function () {
    Log.info("Starting Module: " + this.name);
    Log.info("Starting dingens durch hier");
    this.weather = null;
    this.status = "ONLINE";
    this.daily_value = 0;
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
    this.daily_value = this.weather.data.e1 + this.weather.data.e2;
    //Datenverarbeitung
    this.updateDom();
  },
  processOffline: function () {
    this.status = "OFFLINE";
    this.updateDom();
  },
  getDom: function () {
    if (this.weather == null) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = "Loading...";
      return wrapper;
    } else if (this.status == "ONLINE") {
      var container = document.createElement("div");
      var actual_value = document.createElement("p");
      actual_value.innerText = `Aktuelle Leistung: ${
        this.weather.data.p1 + this.weather.data.p2
      } W`;
      var daily_value = document.createElement("p");
      daily_value.innerText = `Tagesertrag: ${this.daily_value.toFixed(2)} kWh`;
      container.appendChild(actual_value);
      container.appendChild(daily_value);
      return container;
    } else if (this.status == "OFFLINE") {
      var container = document.createElement("div");
      var offline = document.createElement("p");
      offline.innerText = `WR ist offline`;
      offline.classList.add("offline");
      var actual_value = document.createElement("p");
      actual_value.innerText = `Aktuelle Leistung: ${
        this.weather.data.p1 + this.weather.data.p2
      } W`;
      var daily_value = document.createElement("p");
      daily_value.innerText = `Tagesertrag: ${this.daily_value.toFixed(2)} kWh`;
      container.appendChild(offline);
      container.appendChild(actual_value);
      container.appendChild(daily_value);
      return container;
    }
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification === "WR_RESULT") {
      Log.log("Data kommt an");
      this.processWeather(payload);
      this.updateDom();
    } else if (notification === "WR_OFFLINE") {
      Log.log("WR ist offline");
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
