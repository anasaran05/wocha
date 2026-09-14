import { CourierAdapter, CreateShipmentInput, ShipmentResult, TrackingTimeline } from './types';

export class MockCourierAdapter implements CourierAdapter {
  name = 'WOCHA Express Logistics';

  async createShipment(input: CreateShipmentInput): Promise<ShipmentResult> {
    const awb = `WOC-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      awbNumber: awb,
      courierName: this.name,
      labelUrl: `/api/couriers/mock-label?awb=${awb}`,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async getTracking(awbNumber: string): Promise<TrackingTimeline> {
    const now = Date.now();
    return {
      awbNumber,
      currentStatus: 'out_for_delivery',
      estimatedDelivery: new Date(now + 6 * 60 * 60 * 1000).toISOString(),
      events: [
        {
          status: 'created',
          location: 'Berlin Atelier Hub',
          description: 'Garment passed final inspection, boxed in bespoke packaging',
          timestamp: new Date(now - 36 * 60 * 60 * 1000).toISOString(),
        },
        {
          status: 'picked_up',
          location: 'Berlin Logistics Center',
          description: 'Courier collected shipment from atelier dispatch',
          timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          status: 'in_transit',
          location: 'Frankfurt Central Distribution',
          description: 'Package sorted and routed through automated transit facility',
          timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
        },
        {
          status: 'out_for_delivery',
          location: 'Local Delivery Station',
          description: 'Courier is out for delivery to destination address',
          timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  }

  async cancelShipment(awbNumber: string) {
    return { success: true };
  }
}
