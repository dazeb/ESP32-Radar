import { Device, DeviceType, ConnectionStatus } from '../types';

const MOCK_MACS = [
  'A0:B7:65:FE:12:34',
  '24:6F:28:A1:B2:C3',
  'CC:50:E3:88:99:00',
  '84:CC:A8:11:22:33',
  'A4:CF:12:44:55:66',
  '30:AE:A4:77:88:99',
];

const DEVICE_NAMES = [
  'Living Room Sensor',
  'Garage Door Opener',
  'Garden Cam 01',
  'Bedroom LED Strip',
  'Main Water Valve',
  'Weather Station',
];

const POSSIBLE_PORTS = [80, 443, 8080, 1883, 21, 23];

// Helper to generate random integer
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate initial mock devices
export const generateMockDevices = (count: number = 5): Device[] => {
  return Array.from({ length: count }).map((_, i) => {
    const typeKeys = Object.values(DeviceType);
    const type = typeKeys[randomInt(0, typeKeys.length - 1)];
    const angle = randomInt(0, 360);
    const rssi = randomInt(-90, -35); // Initial random RSSI
    
    return {
      id: `dev-${i}-${Date.now()}`,
      mac: MOCK_MACS[i % MOCK_MACS.length] || `DE:AD:BE:EF:${randomInt(10,99)}:${randomInt(10,99)}`,
      name: DEVICE_NAMES[i % DEVICE_NAMES.length] || `ESP32-Device-${i}`,
      type: type,
      rssi: rssi,
      distance: calculateDistance(rssi),
      angle: angle,
      status: Math.random() > 0.3 ? ConnectionStatus.CONNECTED : ConnectionStatus.DISCONNECTED,
      lastSeen: Date.now(),
      ipAddress: `192.168.1.${randomInt(100, 200)}`,
      firmwareVersion: `v${randomInt(1, 3)}.${randomInt(0, 9)}.${randomInt(0, 9)}`,
      openPorts: POSSIBLE_PORTS.filter(() => Math.random() > 0.6), // Random subset of ports
      services: ['WiFi', Math.random() > 0.5 ? 'MQTT' : 'HTTP', Math.random() > 0.8 ? 'BLE' : ''].filter(Boolean),
      batteryLevel: Math.random() > 0.5 ? randomInt(20, 100) : undefined,
    };
  });
};

// Logarithmic distance estimation based on RSSI
// RSSI = -10 * n * log10(d) + A
// For simplicity: d = 10 ^ ((TxPower - RSSI) / (10 * n))
const calculateDistance = (rssi: number): number => {
    const txPower = -59; // RSSI at 1 meter
    if (rssi === 0) return -1.0; 
    const ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;    
    }
};

// Update function to simulate signal fluctuation
export const simulateTelemetry = (devices: Device[]): Device[] => {
  return devices.map(d => {
    // Randomize RSSI slightly
    const noise = randomInt(-3, 3);
    let newRssi = Math.max(-95, Math.min(-30, d.rssi + noise));
    
    // Simulate connection drop
    let newStatus = d.status;
    if (newRssi < -90) newStatus = ConnectionStatus.DISCONNECTED;
    else if (newRssi > -85 && d.status === ConnectionStatus.DISCONNECTED) newStatus = ConnectionStatus.CONNECTED;

    return {
      ...d,
      rssi: newRssi,
      distance: calculateDistance(newRssi),
      lastSeen: Date.now(),
      status: newStatus
    };
  });
};
