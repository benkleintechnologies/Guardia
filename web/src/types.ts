// src/types.ts

export interface Location {
  id: string;
  userId: string;
  teamId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface User {
  userId: string;
  name: string;
  teamId: string;
  role: string;
  canViewOthers: boolean;
  image: string;
}

export interface SosData {
  userId: string;
  teamId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
}