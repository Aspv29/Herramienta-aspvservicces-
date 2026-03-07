class CarrierUnlock {
    async unlockTelcel(deviceId, imei) {
        return {
            success: false,
            error: 'Telcel carrier unlock requires an official unlock request through your carrier.',
            deviceId,
            imei
        };
    }

    async unlockATT(deviceId, imei) {
        return {
            success: false,
            error: 'AT&T carrier unlock requires an official unlock request through your carrier.',
            deviceId,
            imei
        };
    }

    async unlockPayjoy(deviceId) {
        return {
            success: false,
            error: 'Payjoy unlock requires contacting Payjoy support to remove the device lock.',
            deviceId
        };
    }
}

module.exports = CarrierUnlock;
