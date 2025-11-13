import {
  Role,
  User,
  Ajuan,
  AjuanStatus,
  GrubBelanja,
  KelompokBelanja,
  ActivityLog,
  Notification,
  AjuanItem,
} from '../types';

// --- MOCK DATA ---
// This data is used when running in development mode without a VITE_API_URL.
const MOCK_USERS: User[] = [
  { id: 'user-1', email: 'prodi@test.com', nama: 'Ahmad Budi', role: Role.Prodi, idProdi: 'prodi-ti', namaProdi: 'Teknik Informatika', paguAwal: 1000000000, paguPerubahan: 1200000000, jabatanTtd: 'Kepala Prodi Teknik Informatika' },
  { id: 'user-2', email: 'direktorat@test.com', nama: 'Siti Aminah', role: Role.Direktorat, paguAwal: 0, jabatanTtd: 'Direktur Keuangan' },
  { id: 'user-3', email: 'prodi2@test.com', nama: 'Charlie Darmawan', role: Role.Prodi, idProdi: 'prodi-si', namaProdi: 'Sistem Informasi', paguAwal: 800000000, jabatanTtd: 'Kepala Prodi Sistem Informasi' },
];

const MOCK_KELOMPOK_BELANJA: KelompokBelanja[] = [
    { id: 'kb-1', nama: 'Belanja Pegawai', grub: GrubBelanja.A },
    { id: 'kb-2', nama: 'Belanja Barang', grub: GrubBelanja.B },
    { id: 'kb-3', nama: 'Belanja Modal', grub: GrubBelanja.C },
    { id: 'kb-4', nama: 'Beban Sewa', grub: GrubBelanja.D },
    { id: 'kb-5', nama: 'Perjalanan Dinas', grub: GrubBelanja.E },
];

const MOCK_AJUANS: Ajuan[] = [
  { id: 'ajuan-1', judulKegiatan: 'Pengadaan Komputer Lab', idProdi: 'prodi-ti', namaProdi: 'Teknik Informatika', pembuat: 'Ahmad Budi', totalAnggaran: 50000000, status: AjuanStatus.Diterima, tipe: 'awal', revisiKe: 0, items: [], createdAt: new Date('2023-10-01'), updatedAt: new Date('2023-10-05'), history: [] },
  { id: 'ajuan-2', judulKegiatan: 'Seminar Nasional AI', idProdi: 'prodi-ti', namaProdi: 'Teknik Informatika', pembuat: 'Ahmad Budi', totalAnggaran: 25000000, status: AjuanStatus.Menunggu, tipe: 'awal', revisiKe: 0, items: [], createdAt: new Date('2023-10-15'), updatedAt: new Date('2023-10-15'), history: [] },
  { id: 'ajuan-3', judulKegiatan: 'Workshop Pengembangan Sistem', idProdi: 'prodi-si', namaProdi: 'Sistem Informasi', pembuat: 'Charlie Darmawan', totalAnggaran: 15000000, status: AjuanStatus.Ditolak, tipe: 'awal', revisiKe: 1, items: [], createdAt: new Date('2023-11-01'), updatedAt: new Date('2023-11-02'), history: [] },
  { id: 'ajuan-4', judulKegiatan: 'Penambahan Lisensi Software', idProdi: 'prodi-ti', namaProdi: 'Teknik Informatika', pembuat: 'Ahmad Budi', totalAnggaran: 12000000, status: AjuanStatus.Revisi, tipe: 'perubahan', tahapPerubahan: 1, revisiKe: 2, items: [], createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-01-22'), history: [] },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', userId: 'user-1', message: 'Ajuan "Seminar Nasional AI" telah diterima oleh direktorat.', read: false, createdAt: new Date() },
    { id: 'notif-2', userId: 'user-1', message: 'Ajuan "Pengadaan Komputer Lab" membutuhkan revisi.', read: true, createdAt: new Date(Date.now() - 86400000 * 2) },
    { id: 'notif-3', userId: 'user-2', message: 'Ajuan baru "Workshop Big Data" dari prodi Sistem Informasi menunggu review Anda.', read: false, createdAt: new Date() },
];

const MOCK_LOGS: ActivityLog[] = [
    { id: 'log-1', timestamp: new Date(), user: 'Siti Aminah', userId: 'user-2', action: 'Menolak ajuan "Workshop Pengembangan Sistem".' },
    { id: 'log-2', timestamp: new Date(Date.now() - 3600000), user: 'Ahmad Budi', userId: 'user-1', action: 'Mengirim ajuan baru "Seminar Nasional AI".' },
];

// --- REAL API SERVICE ---
// FIX: Cast import.meta to any to access env properties for Vite. This is a common workaround for TypeScript's lack of built-in vite env types.
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL;
const SESSION_KEY = 'si-pandai-user';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API URL is not configured. The VITE_API_URL environment variable is missing.');
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

const realApiService = {
  async login(email: string, password: string): Promise<User> {
    const user = await apiFetch<User>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },
  logout: async (): Promise<void> => {
    localStorage.removeItem(SESSION_KEY);
  },
  checkSession: async (): Promise<User | null> => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'),
  isTahapPerubahanActive: (): Promise<boolean> => apiFetch<boolean>('/api/status/tahap-perubahan'),
  getNotifications: (userId: string): Promise<Notification[]> => apiFetch<Notification[]>(`/api/notifications?userId=${userId}`),
  markNotificationsAsRead: (userId: string): Promise<void> => apiFetch<void>(`/api/notifications/mark-read`, { method: 'POST', body: JSON.stringify({ userId }) }),
  getUsers: (): Promise<User[]> => apiFetch<User[]>('/api/users'),
  getKelompokBelanja: (): Promise<KelompokBelanja[]> => apiFetch<KelompokBelanja[]>('/api/kelompok-belanja'),
  getAjuans: (userId: string, role: Role, ajuanType: 'awal' | 'perubahan'): Promise<Ajuan[]> => {
      const params = new URLSearchParams({ userId, role, ajuanType });
      return apiFetch<Ajuan[]>(`/api/ajuans?${params.toString()}`);
  },
  createAjuan: (payload: { judulKegiatan: string; items: any[]; userId: string }): Promise<Ajuan> => apiFetch<Ajuan>('/api/ajuans', { method: 'POST', body: JSON.stringify(payload) }),
  getActivityLogs: (): Promise<ActivityLog[]> => apiFetch<ActivityLog[]>('/api/logs'),
  getDashboardStats: (userId: string, role: Role): Promise<any> => {
    const params = new URLSearchParams({ userId, role });
    return apiFetch<any>(`/api/dashboard-stats?${params.toString()}`);
  }
};

// --- MOCK API SERVICE ---
const mockApiService = {
    async login(email: string, password: string): Promise<User> {
        console.log("MOCK: Logging in...");
        const user = MOCK_USERS.find(u => u.email === email);
        if (user && password === 'password') { // Mock password check
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            return Promise.resolve(user);
        }
        return Promise.reject(new Error('Email atau password salah.'));
    },
    async logout(): Promise<void> {
        console.log("MOCK: Logging out...");
        localStorage.removeItem(SESSION_KEY);
        return Promise.resolve();
    },
    async checkSession(): Promise<User | null> {
        const userJson = localStorage.getItem(SESSION_KEY);
        return Promise.resolve(userJson ? JSON.parse(userJson) : null);
    },
    async isTahapPerubahanActive(): Promise<boolean> {
        return Promise.resolve(true); // Simulate tahap perubahan is active
    },
    async getNotifications(userId: string): Promise<Notification[]> {
        return Promise.resolve(MOCK_NOTIFICATIONS.filter(n => n.userId === userId));
    },
    async markNotificationsAsRead(userId: string): Promise<void> {
        MOCK_NOTIFICATIONS.forEach(n => { if(n.userId === userId) n.read = true; });
        return Promise.resolve();
    },
    async getUsers(): Promise<User[]> {
        return Promise.resolve(MOCK_USERS);
    },
    async getKelompokBelanja(): Promise<KelompokBelanja[]> {
        return Promise.resolve(MOCK_KELOMPOK_BELANJA);
    },
    async getAjuans(userId: string, role: Role, ajuanType: 'awal' | 'perubahan'): Promise<Ajuan[]> {
        let ajuans = MOCK_AJUANS.filter(a => a.tipe === ajuanType);
        if (role === Role.Prodi) {
            const user = MOCK_USERS.find(u => u.id === userId);
            ajuans = ajuans.filter(a => a.idProdi === user?.idProdi);
        }
        return Promise.resolve(ajuans);
    },
    async createAjuan(payload: { judulKegiatan: string; items: AjuanItem[]; userId: string }): Promise<Ajuan> {
        const user = MOCK_USERS.find(u => u.id === payload.userId)!;
        const newAjuan: Ajuan = {
            id: `ajuan-${Date.now()}`,
            judulKegiatan: payload.judulKegiatan,
            items: payload.items,
            idProdi: user.idProdi!,
            namaProdi: user.namaProdi!,
            pembuat: user.nama,
            status: AjuanStatus.Menunggu,
            tipe: 'awal',
            totalAnggaran: payload.items.reduce((sum, item) => sum + item.total, 0),
            revisiKe: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            history: [],
        };
        MOCK_AJUANS.push(newAjuan);
        return Promise.resolve(newAjuan);
    },
    async getActivityLogs(): Promise<ActivityLog[]> {
        return Promise.resolve(MOCK_LOGS);
    },
    async getDashboardStats(userId: string, role: Role): Promise<any> {
        const user = MOCK_USERS.find(u => u.id === userId)!
        const stats = {
            totalPagu: user.paguAwal,
            totalDiajukan: 87000000,
            totalRpd: 45000000,
            totalRealisasi: 30000000,
            rpdVsRealisasi: [
                { bulan: 'Jan', rpd: 5000000, realisasi: 4000000 },
                { bulan: 'Feb', rpd: 10000000, realisasi: 8000000 },
                { bulan: 'Mar', rpd: 15000000, realisasi: 12000000 },
                { bulan: 'Apr', rpd: 15000000, realisasi: 6000000 },
            ],
            statusCounts: { [AjuanStatus.Menunggu]: 1, [AjuanStatus.Diterima]: 1, [AjuanStatus.Ditolak]: 1, [AjuanStatus.Revisi]: 1 },
            realisasiPerProdi: [
                { nama: 'Teknik Informatika', totalRealisasi: 200000000 },
                { nama: 'Sistem Informasi', totalRealisasi: 150000000 },
            ]
        };
        return Promise.resolve(stats);
    }
};

// --- EXPORT LOGIC ---
// Use mock service if in development and VITE_API_URL is not set.
// Otherwise, use the real service.
// FIX: Cast import.meta to any to access env properties for Vite.
const useMock = (import.meta as any).env?.DEV && !API_BASE_URL;

if (useMock) {
    console.warn(
      "VITE_API_URL is not set. Application is running in development mode with MOCK DATA. " +
      "To connect to a real backend, set the VITE_API_URL environment variable."
    );
}

export const apiService = useMock ? mockApiService : realApiService;
