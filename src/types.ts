// types.ts
export interface SpotData {
    spotname: string;
    location: [number, number];
    totalSpaces: number;
    occupiesSpaces: number;
  }

export interface LocationData {
    location: [number, number];
    spotname: string;
    totalSpaces: number;
    availableSpaces: number;
    imgPath: string;
  }