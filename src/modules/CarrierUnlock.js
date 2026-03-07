'use strict';

/**
 * CarrierUnlock - Stub implementation
 * Full carrier unlocking functionality is not yet implemented.
 */
class CarrierUnlock {
    constructor() {
        console.warn('CarrierUnlock: module not fully implemented, using stub.');
    }

    async unlockTelcel(deviceId, imei) {
        return { success: false, error: 'CarrierUnlock not implemented' };
    }

    async unlockATT(deviceId, imei) {
        return { success: false, error: 'CarrierUnlock not implemented' };
    }

    async unlockPayjoy(deviceId) {
        return { success: false, error: 'CarrierUnlock not implemented' };
    }
}

module.exports = CarrierUnlock;
