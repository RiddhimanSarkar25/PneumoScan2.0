import { User, Role, Patient, Scan } from '../types';

const USERS_KEY = 'pneumoscan_users';
const PATIENTS_KEY = 'pneumoscan_patients';
const SCANS_KEY = 'pneumoscan_scans';
const CURRENT_USER_KEY = 'pneumoscan_current_user';

// Initialize DB on first load
const initializeDB = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const adminUser: User = { id: '1', username: 'admin', role: Role.Admin };
    const radioUser: User = { id: '2', username: 'radio', role: Role.Radiologist };
    localStorage.setItem(USERS_KEY, JSON.stringify([adminUser, radioUser]));
  }

  if (!localStorage.getItem(PATIENTS_KEY)) {
    // Seed some patients
    const patients: Patient[] = [
      { id: 'p1', name: 'John Doe', age: 45, gender: 'Male', medicalHistory: 'Hypertension' },
      { id: 'p2', name: 'Jane Smith', age: 32, gender: 'Female', medicalHistory: 'Asthma' },
      { id: 'p3', name: 'Robert Johnson', age: 60, gender: 'Male', medicalHistory: 'Smoker' },
    ];
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  }
  
  if (!localStorage.getItem(SCANS_KEY)) {
      localStorage.setItem(SCANS_KEY, JSON.stringify([]));
  }
};

initializeDB();

export const AuthService = {
  login: async (username: string): Promise<User | null> => {
    // Simple mock auth - allow any password if user exists
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.username === username);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(CURRENT_USER_KEY);
    return u ? JSON.parse(u) : null;
  }
};

export const PatientService = {
  getAll: (): Patient[] => {
    return JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
  },
  add: (patient: Patient) => {
    const patients = PatientService.getAll();
    patients.push(patient);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  }
};

export const ScanService = {
  getAll: (): Scan[] => {
    const scans = JSON.parse(localStorage.getItem(SCANS_KEY) || '[]');
    // Sort by date desc
    return scans.sort((a: Scan, b: Scan) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  },
  add: (scan: Scan) => {
    const scans = ScanService.getAll();
    scans.push(scan);
    localStorage.setItem(SCANS_KEY, JSON.stringify(scans));
  }
};