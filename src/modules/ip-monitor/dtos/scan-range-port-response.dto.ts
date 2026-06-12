export interface PortScanResult {
  port: number;
  open: boolean;
  banner?: string;
}

export interface PortRangeScanResult {
  host: string;
  startPort: number;
  endPort: number;
  openPorts: PortScanResult[];
  totalScanned: number;
  duration: number;
}
