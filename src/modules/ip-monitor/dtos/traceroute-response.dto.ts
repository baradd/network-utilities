export interface TraceHop {
  hop: number;
  host: string | null;
  ip: string | null;
  times: (number | null)[]; // 3 probes per hop, null = timeout (*)
}

export interface TracerouteResponse {
  host: string;
  hops: TraceHop[];
  duration: number;
  reached: boolean; // did we actually reach the destination?
}
