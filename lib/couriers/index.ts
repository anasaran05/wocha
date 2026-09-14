import { CourierAdapter } from './types';
import { DelhiveryAdapter } from './delhivery';
import { ShiprocketAdapter } from './shiprocket';
import { MockCourierAdapter } from './mock';

export * from './types';
export * from './delhivery';
export * from './shiprocket';
export * from './mock';

export function getCourierAdapter(name: string): CourierAdapter {
  const clean = name.toLowerCase();
  if (clean.includes('delhivery')) {
    return new DelhiveryAdapter();
  }
  if (clean.includes('shiprocket')) {
    return new ShiprocketAdapter();
  }
  return new MockCourierAdapter();
}
