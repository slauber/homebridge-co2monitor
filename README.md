# homebridge-co2monitor

Integrates your TFA Dostmann CO2 sensor into Homebridge.

# Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-co2monitor`
3. Update your configuration file. See `sample-config.json` in this repository for a sample.

# Configuration
Sample configuration:

```
"accessories": [
        {
            "accessory": "Co2Monitor",
            "name": "CO2 Livingroom",
            "humidity": true,
            "co2threshold": 1200
        }
    ]
```

---

Credits to

- [lucacri's homebridge-http-temperature-humidity](https://github.com/lucacri/homebridge-http-temperature-humidity) for the plugin design inspiration
- [huhamhire's node-co2-monitor](https://github.com/huhamhire/node-co2-monitor) for the NodeJS backend to the TFA Dostmann sensor.
