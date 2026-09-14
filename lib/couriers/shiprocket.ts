import { CourierAdapter, CreateShipmentInput, ShipmentResult, TrackingTimeline } from './types';

export class ShiprocketAdapter implements CourierAdapter {
  name = 'Shiprocket';

  async createShipment(input: CreateShipmentInput): Promise<ShipmentResult> {
    const awb = `SR${Math.floor(100000000 + Math.random() * 900000000)}`;
    return {
      awbNumber: awb,
      courierName: this.name,
      labelUrl: `https://app.shiprocket.in/tracking/label/${awb}`,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async getTracking(awbNumber: string): Promise<TrackingTimeline> {
    return {
      awbNumber,
      currentStatus: 'picked_up',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        {
          status: 'created',
          location: 'Origin Atelier',
          description: 'Shipment label created',
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        },
        {
          status: 'picked_up',
          location: 'Central Depot',
          description: 'Package picked up by courier associate',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  }

  async cancelShipment(awbNumber: string) {
    return { success: true };
  }
}
