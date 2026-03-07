/**
 * CarrierUnlock - Stub implementation
 * Full implementation pending. Methods return a not-implemented error.
 */
class CarrierUnlock {
    constructor() {
        console.warn('CarrierUnlock: full implementation is not yet available.');
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
