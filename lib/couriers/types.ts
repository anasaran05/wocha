import { ShipmentStatus } from '../supabase/types';

export interface ShipmentAddress {
  fullName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateShipmentInput {
  orderId: string;
  orderNumber: string;
  shippingAddress: ShipmentAddress;
  totalWeightGrams: number;
  totalAmount: number;
  currency: string;
  itemsCount: number;
}

export interface ShipmentResult {
  awbNumber: string;
  courierName: string;
  labelUrl?: string;
  estimatedDelivery?: string;
}

export interface TrackingEvent {
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: string;
}

export interface TrackingTimeline {
  awbNumber: string;
  currentStatus: ShipmentStatus;
  estimatedDelivery?: string;
  events: TrackingEvent[];
}

export interface CourierAdapter {
  name: string;
  createShipment(input: CreateShipmentInput): Promise<ShipmentResult>;
  getTracking(awbNumber: string): Promise<TrackingTimeline>;
  cancelShipment(awbNumber: string): Promise<{ success: boolean; message?: string }>;
}
