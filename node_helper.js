const NodeHelper = require("node_helper");
var axios = require("axios");
const Log = require("logger");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helperrrr: " + this.name);
    console.log("Hihihi");
    Log.log("Starting node helperrrriiirrrr: " + this.name);
  },
  getWeather: function (payload) {
    var that = this;
    // this.url = `https://api.tomorrow.io/v4/weather/forecast?location=${payload.lat},${payload.lon}&apikey=${payload.api_key}`
    this.url = `http://192.168.178.61:8050/getOutputData`;
    Log.info(this.url);
    axios.get(this.url).then((response) => {
      that.sendSocketNotification("WR_RESULT", response.data);
    });
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification == "GET_DATA") {
      this.getWeather(payload);
    }
  },
});
