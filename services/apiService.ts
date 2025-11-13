import {
  Role,
  AjuanStatus,
  GrubBelanja,
  User,
  Ajuan,
  AjuanItem,
  KelompokBelanja,
  ActivityLog,
  Notification,
} from '../types';

// --- MOCK DATABASE ---

const DB_USERS: User[] = [
  {
    id: 'user-1',
    email: 'prodi@test.com',
    nama: 'Ahmad Budi',
    role: Role.Prodi,
    idProdi: 'prodi-ti',
    namaProdi: 'Teknik Informatika',
    paguAwal: 1_000_000_000,
    jabatanTtd: 'Kepala Prodi Teknik Informatika',
  },
  {
    id: 'user-2',
    email: 'direktorat@test.com',
    nama: 'Siti Aminah',
    role: Role.Direktorat,
    paguAwal: 0, // Direktorat doesn't have a specific budget limit itself
    jabatanTtd: 'Direktur Keuangan',
  },
];

const DB_KELOMPOK: KelompokBelanja[] = [
    { id: 'kb-1', nama: 'Belanja Bahan', grub: GrubBelanja.A },
    { id: 'kb-2', nama: 'Perjalanan Dinas', grub: GrubBelanja.B },
    { id: 'kb-3', nama: 'Sewa', grub: GrubBelanja.C },
    { id: 'kb-4', nama: 'Gaji & Upah', grub: GrubBelanja.D },
    { id: 'kb-5', nama: 'Pemeliharaan', grub: GrubBelanja.E },
    { id: 'kb-6', nama: 'Lain-lain', grub: GrubBelanja.F },
];

let DB_AJUANS: Ajuan[] = [
  {
    id: 'ajuan-1',
    judulKegiatan: 'Workshop Pengembangan Kurikulum 2024',
    idProdi: 'prodi-ti',
    namaProdi: 'Teknik Informatika',
    pembuat: 'Ahmad Budi',
    totalAnggaran: 15_000_000,
    status: AjuanStatus.Diterima,
    tipe: 'awal',
    revisiKe: 0,
    items: [
        { id: 'item-1', deskripsi: 'Sewa Gedung', grubBelanja: GrubBelanja.C, kelompokBelanja: 'Sewa', jumlah: 1, satuan: 'hari', harga: 5_000_000, total: 5_000_000, keterangan: '' },
        { id: 'item-2', deskripsi: 'Konsumsi Peserta', grubBelanja: GrubBelanja.A, kelompokBelanja: 'Belanja Bahan', jumlah: 100, satuan: 'paket', harga: 50_000, total: 5_000_000, keterangan: '' },
        { id: 'item-3', deskripsi: 'Honorarium Narasumber', grubBelanja: GrubBelanja.D, kelompokBelanja: 'Gaji & Upah', jumlah: 2, satuan: 'orang', harga: 2_500_000, total: 5_000_000, keterangan: '' },
    ],
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z'),
    history: [],
  },
  {
    id: 'ajuan-2',
    judulKegiatan: 'Studi Banding ke Universitas Terkemuka',
    idProdi: 'prodi-ti',
    namaProdi: 'Teknik Informatika',
    pembuat: 'Ahmad Budi',
    totalAnggaran: 27_500_000,
    status: AjuanStatus.Menunggu,
    tipe: 'awal',
    revisiKe: 0,
    items: [
        { id: 'item-4', deskripsi: 'Tiket Pesawat PP', grubBelanja: GrubBelanja.B, kelompokBelanja: 'Perjalanan Dinas', jumlah: 5, satuan: 'tiket', harga: 4_000_000, total: 20_000_000, keterangan: '' },
        { id: 'item-5', deskripsi: 'Akomodasi Hotel', grubBelanja: GrubBelanja.B, kelompokBelanja: 'Perjalanan Dinas', jumlah: 5, satuan: 'kamar', harga: 1_500_000, total: 7_500_000, keterangan: '3 malam' },
    ],
    createdAt: new Date('2024-02-10T11:00:00Z'),
    updatedAt: new Date('2024-02-10T11:00:00Z'),
    history: [],
  }
];

let DB_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', userId: 'user-1', message: 'Ajuan "Workshop Kurikulum" telah diterima.', read: true, createdAt: new Date('2024-01-20T14:31:00Z')},
    { id: 'notif-2', userId: 'user-2', message: 'Ajuan baru "Studi Banding" dari T. Informatika perlu direview.', read: false, createdAt: new Date('2024-02-10T11:01:00Z')},
];

let DB_LOGS: ActivityLog[] = [
    { id: 'log-1', timestamp: new Date('2024-02-10T11:00:00Z'), user: 'Ahmad Budi', userId: 'user-1', action: 'Mengirim ajuan baru: Studi Banding ke Universitas Terkemuka' },
    { id: 'log-2', timestamp: new Date('2024-02-10T10:55:00Z'), user: 'Ahmad Budi', userId: 'user-1', action: 'Login berhasil' },
    { id: 'log-3', timestamp: new Date('2024-02-09T09:00:00Z'), user: 'Siti Aminah', userId: 'user-2', action: 'Login berhasil' },
];

const SESSION_KEY = 'si-pandai-user-id';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- API SERVICE IMPLEMENTATION ---

export const apiService = {
  async login(email: string, password: string): Promise<User> {
    await delay(500);
    const user = DB_USERS.find(u => u.email === email);
    // Use a simple password for mock purposes
    if (user && password === 'password') { 
        localStorage.setItem(SESSION_KEY, user.id);
        DB_LOGS.unshift({ id: `log-${Date.now()}`, timestamp: new Date(), user: user.nama, userId: user.id, action: 'Login berhasil' });
        return user;
    }
    throw new Error('Email atau password salah.');
  },

  async logout(): Promise<void> {
    await delay(200);
    const userId = localStorage.getItem(SESSION_KEY);
    const user = DB_USERS.find(u => u.id === userId);
     if (user) {
        DB_LOGS.unshift({ id: `log-${Date.now()}`, timestamp: new Date(), user: user.nama, userId: user.id, action: 'Logout' });
    }
    localStorage.removeItem(SESSION_KEY);
  },
  
  async checkSession(): Promise<User | null> {
    await delay(300);
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    return DB_USERS.find(u => u.id === userId) || null;
  },

  async isTahapPerubahanActive(): Promise<boolean> {
      await delay(50);
      return true; // Simulate that "Tahap Perubahan" is active
  },
  
  async getNotifications(userId: string): Promise<Notification[]> {
      await delay(100);
      return DB_NOTIFICATIONS.filter(n => n.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async markNotificationsAsRead(userId: string): Promise<void> {
      await delay(50);
      DB_NOTIFICATIONS.forEach(n => {
          if (n.userId === userId && !n.read) {
              n.read = true;
          }
      });
  },

  async getUsers(): Promise<User[]> {
      await delay(200);
      return [...DB_USERS];
  },

  async getKelompokBelanja(): Promise<KelompokBelanja[]> {
      await delay(100);
      return [...DB_KELOMPOK];
  },
  
  async getAjuans(userId: string, role: Role, ajuanType: 'awal' | 'perubahan'): Promise<Ajuan[]> {
      await delay(400);
      const user = DB_USERS.find(u => u.id === userId);
      let ajuans = DB_AJUANS.filter(a => a.tipe === ajuanType);
      
      if (role === Role.Prodi) {
          ajuans = ajuans.filter(a => a.idProdi === user?.idProdi);
      }
      return ajuans.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async createAjuan(payload: { judulKegiatan: string; items: AjuanItem[]; userId: string }): Promise<Ajuan> {
      await delay(600);
      const user = DB_USERS.find(u => u.id === payload.userId);
      if (!user || user.role !== Role.Prodi) {
          throw new Error('Hanya user Prodi yang bisa membuat ajuan.');
      }

      const totalAnggaran = payload.items.reduce((sum, item) => sum + item.total, 0);

      const newAjuan: Ajuan = {
        id: `ajuan-${Date.now()}`,
        judulKegiatan: payload.judulKegiatan,
        idProdi: user.idProdi!,
        namaProdi: user.namaProdi!,
        pembuat: user.nama,
        totalAnggaran,
        status: AjuanStatus.Menunggu,
        tipe: 'awal', // for simplicity, could be dynamic
        revisiKe: 0,
        items: payload.items,
        createdAt: new Date(),
        updatedAt: new Date(),
        history: [],
      };

      DB_AJUANS.unshift(newAjuan);
      DB_LOGS.unshift({ id: `log-${Date.now()}`, timestamp: new Date(), user: user.nama, userId: user.id, action: `Membuat ajuan baru: ${payload.judulKegiatan}` });
      
      const direktoratUser = DB_USERS.find(u => u.role === Role.Direktorat);
      if (direktoratUser) {
        DB_NOTIFICATIONS.unshift({
            id: `notif-${Date.now()}`,
            userId: direktoratUser.id,
            message: `Ajuan baru "${payload.judulKegiatan}" dari ${user.namaProdi} perlu direview.`,
            read: false,
            createdAt: new Date(),
        });
      }

      return newAjuan;
  },
  
  async getActivityLogs(): Promise<ActivityLog[]> {
      await delay(250);
      return DB_LOGS.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  async getDashboardStats(userId: string, role: Role): Promise<any> {
    await delay(500);
    const user = DB_USERS.find(u => u.id === userId);
    
    let relevantAjuans = DB_AJUANS;
    if (role === Role.Prodi) {
      relevantAjuans = DB_AJUANS.filter(a => a.idProdi === user?.idProdi);
    }

    const totalPagu = user?.paguAwal || 0;
    const totalDiajukan = relevantAjuans.reduce((sum, a) => sum + a.totalAnggaran, 0);
    const acceptedAjuans = relevantAjuans.filter(a => a.status === AjuanStatus.Diterima);
    const totalDiterima = acceptedAjuans.reduce((sum, a) => sum + a.totalAnggaran, 0);

    // Mock RPD and Realisasi as percentages of the accepted budget
    const totalRpd = totalDiterima * 0.8;
    const totalRealisasi = totalDiterima * 0.6;

    const statusCounts = relevantAjuans.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {} as { [key in AjuanStatus]: number });

    // Mock monthly data for chart
    const rpdVsRealisasi = [
        { bulan: 'Jan', RPD: totalDiterima * 0.1, Realisasi: totalDiterima * 0.08 },
        { bulan: 'Feb', RPD: totalDiterima * 0.15, Realisasi: totalDiterima * 0.12 },
        { bulan: 'Mar', RPD: totalDiterima * 0.2, Realisasi: totalDiterima * 0.18 },
        { bulan: 'Apr', RPD: totalDiterima * 0.1, Realisasi: totalDiterima * 0.09 },
        { bulan: 'Mei', RPD: totalDiterima * 0.25, Realisasi: totalDiterima * 0.13 },
    ];

    let realisasiPerProdi: any[] = [];
    if (role === Role.Direktorat) {
        const prodiMap = new Map<string, { nama: string; totalRealisasi: number }>();
        DB_AJUANS.filter(a => a.status === AjuanStatus.Diterima).forEach(a => {
            const entry = prodiMap.get(a.idProdi) || { nama: a.namaProdi, totalRealisasi: 0 };
            // Mocking realization as 60% of the approved budget for each proposal
            entry.totalRealisasi += a.totalAnggaran * 0.6;
            prodiMap.set(a.idProdi, entry);
        });
        realisasiPerProdi = Array.from(prodiMap.values());
    }
    
    return {
        totalPagu,
        totalDiajukan,
        totalRpd,
        totalRealisasi,
        statusCounts,
        rpdVsRealisasi,
        realisasiPerProdi
    };
  }
};
