'use strict';

class CarrierUnlock {
    constructor() {
        console.warn('CarrierUnlock module is not fully implemented. Using stub implementation.');
    }

    async unlockTelcel(deviceId, imei) {
        return { success: false, error: 'CarrierUnlock: unlockTelcel not implemented' };
    }

    async unlockATT(deviceId, imei) {
        return { success: false, error: 'CarrierUnlock: unlockATT not implemented' };
    }

    async unlockPayjoy(deviceId) {
        return { success: false, error: 'CarrierUnlock: unlockPayjoy not implemented' };
    }
}

module.exports = CarrierUnlock;
