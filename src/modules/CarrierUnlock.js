'use strict';

class CarrierUnlock {
    constructor() {
        console.warn('CarrierUnlock module is a stub implementation. Full carrier unlock functionality coming soon.');
    }

    async unlockTelcel(deviceId, imei) {
        return { success: false, error: 'CarrierUnlock module not yet implemented' };
    }

    async unlockATT(deviceId, imei) {
        return { success: false, error: 'CarrierUnlock module not yet implemented' };
    }

    async unlockPayjoy(deviceId) {
        return { success: false, error: 'CarrierUnlock module not yet implemented' };
    }
}

module.exports = CarrierUnlock;
