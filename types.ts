export enum Role {
  Admin = 'Admin',
  Radiologist = 'Radiologist',
}

export interface User {
  id: string;
  username: string;
  role: Role;
}

export enum Classification {
  Normal = 'Normal',
  Bacterial = 'Bacterial',
  Viral = 'Viral',
}

export enum Stage {
  Congestion = 'Congestion',
  RedHepatization = 'Red Hepatization',
  GrayHepatization = 'Gray Hepatization',
  Resolution = 'Resolution',
  NA = 'N/A',
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  medicalHistory: string;
}

export interface ScanResult {
  classification: Classification;
  stage: Stage;
  confidenceScore: number;
  isFlaggedFalseNegative: boolean;
  recommendedMeds: string;
  estimatedRecovery: string;
}

export interface Scan {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for easier display
  imageFilename: string; // In this mock, this will be a URL or base64 placeholder
  uploadDate: string; // ISO string
  symptomsAtScan: string;
  result: ScanResult;
}