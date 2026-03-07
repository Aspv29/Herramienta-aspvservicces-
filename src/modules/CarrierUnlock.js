'use strict';

/**
 * CarrierUnlock - Stub implementation.
 * Full carrier unlock support is not yet implemented.
 */
class CarrierUnlock {
    constructor() {
        console.warn('CarrierUnlock: module not yet fully implemented. Using stub.');
    }

    async unlockTelcel(deviceId, imei) {
        return { success: false, error: 'CarrierUnlock not yet implemented' };
    }

    async unlockATT(deviceId, imei) {
        return { success: false, error: 'CarrierUnlock not yet implemented' };
    }

    async unlockPayjoy(deviceId) {
        return { success: false, error: 'CarrierUnlock not yet implemented' };
    }
}

module.exports = CarrierUnlock;
