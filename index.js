var Service, Characteristic;
const CO2Monitor = require('node-co2-monitor');
const monitor = new CO2Monitor({ "debug": false });

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-co2monitor", "Co2Monitor", Co2Monitor);
}

function Co2Monitor(log, config) {
    this.log = log;

    // Configuration
    this.name = config["name"];
    this.manufacturer = config["manufacturer"] || "TFA Dostmann";
    this.model = config["model"] || "AirCO2NTROL";
    this.serial = config["serial"] || "";
    this.humidity = config["humidity"];
    this.co2threshold = config["co2threshold"] || 800;
    this.lastUpdateAt = config["lastUpdateAt"] || null;
}

monitor.connect((err) => {
    if (err) {
        return console.error(err.stack);
    }
    monitor.transfer();
});

Co2Monitor.prototype = {

    getTemperatureState: function (callback) {
        callback(null, monitor.temperature);
    },

    getHumidityState: function (callback) {
        callback(null, monitor.humidity);
    },

    getCarbonDioxideState: function (callback) {
        callback(null, monitor.co2);
    },

    getCarbonDioxideDetected: function (callback) {
        callback(null, monitor.co2 ? (monitor.co2 > this.co2threshold) : false);
    },

    getServices: function () {
        var services = [],
            informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serial);
        services.push(informationService);

        this.temperatureService = new Service.TemperatureSensor(this.name);
        this.temperatureService
            .getCharacteristic(Characteristic.CurrentTemperature)
            .setProps({ minValue: -273, maxValue: 200 })
            .on("get", this.getTemperatureState.bind(this));
        services.push(this.temperatureService);

        this.carbonDioxideService = new Service.CarbonDioxideSensor(this.name);
        this.carbonDioxideService
            .getCharacteristic(Characteristic.CarbonDioxideDetected)
            .on("get", this.getCarbonDioxideDetected.bind(this));
        this.carbonDioxideService
            .getCharacteristic(Characteristic.CarbonDioxideLevel)
            .on("get", this.getCarbonDioxideState.bind(this));
        services.push(this.carbonDioxideService);

        if (this.humidity !== false) {
            this.humidityService = new Service.HumiditySensor(this.name);
            this.humidityService
                .getCharacteristic(Characteristic.CurrentRelativeHumidity)
                .setProps({ minValue: 0, maxValue: 100 })
                .on("get", this.getHumidityState.bind(this));
            services.push(this.humidityService);
        }

        return services;
    }
};
