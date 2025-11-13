
import { Role } from './types';
import { HomeIcon, PlusCircleIcon, ListIcon, CalendarIcon, MoneyIcon, PrinterIcon, CogIcon, UserCogIcon, HistoryIcon } from './components/Icons';

export const TABS = {
  DASHBOARD: 'dashboard',
  BUAT_AJUAN: 'buat-ajuan',
  DAFTAR_AJUAN_AWAL: 'daftar-ajuan-awal',
  DAFTAR_AJUAN_PERUBAHAN: 'daftar-ajuan-perubahan',
  RPD_AWAL: 'rpd-awal',
  RPD_PERUBAHAN: 'rpd-perubahan',
  REALISASI_AWAL: 'realisasi-awal',
  REALISASI_PERUBAHAN: 'realisasi-perubahan',
  BERITA_ACARA: 'berita-acara',
  MANAJEMEN: 'manajemen',
  PENGATURAN_AKUN: 'pengaturan-akun',
  LOG_AKTIVITAS: 'log-aktivitas',
};

export const PRODI_TABS = (isTahapPerubahan: boolean) => [
  { id: TABS.DASHBOARD, label: 'Dashboard', icon: HomeIcon },
  { id: TABS.BUAT_AJUAN, label: `Buat Ajuan ${isTahapPerubahan ? 'Perubahan' : 'Awal'}`, icon: PlusCircleIcon },
  { id: TABS.DAFTAR_AJUAN_AWAL, label: 'Daftar Ajuan Awal', icon: ListIcon },
  ...(isTahapPerubahan ? [{ id: TABS.DAFTAR_AJUAN_PERUBAHAN, label: 'Daftar Ajuan Perubahan', icon: ListIcon }] : []),
  { id: TABS.RPD_AWAL, label: 'RPD Awal', icon: CalendarIcon },
  ...(isTahapPerubahan ? [{ id: TABS.RPD_PERUBAHAN, label: 'RPD Perubahan', icon: CalendarIcon }] : []),
  { id: TABS.REALISASI_AWAL, label: 'Realisasi Awal', icon: MoneyIcon },
  ...(isTahapPerubahan ? [{ id: TABS.REALISASI_PERUBAHAN, label: 'Realisasi Perubahan', icon: MoneyIcon }] : []),
  { id: TABS.BERITA_ACARA, label: 'Cetak Berita Acara', icon: PrinterIcon },
  { id: TABS.PENGATURAN_AKUN, label: 'Pengaturan Akun', icon: UserCogIcon, role: Role.Prodi },
];

export const DIRECTORATE_TABS = (isTahapPerubahan: boolean) => [
  { id: TABS.DASHBOARD, label: 'Dashboard', icon: HomeIcon },
  { id: TABS.DAFTAR_AJUAN_AWAL, label: 'Daftar Ajuan Awal', icon: ListIcon },
  ...(isTahapPerubahan ? [{ id: TABS.DAFTAR_AJUAN_PERUBAHAN, label: 'Daftar Ajuan Perubahan', icon: ListIcon }] : []),
  { id: TABS.RPD_AWAL, label: 'RPD Awal', icon: CalendarIcon },
  ...(isTahapPerubahan ? [{ id: TABS.RPD_PERUBAHAN, label: 'RPD Perubahan', icon: CalendarIcon }] : []),
  { id: TABS.REALISASI_AWAL, label: 'Realisasi Awal', icon: MoneyIcon },
  ...(isTahapPerubahan ? [{ id: TABS.REALISASI_PERUBAHAN, label: 'Realisasi Perubahan', icon: MoneyIcon }] : []),
  { id: TABS.BERITA_ACARA, label: 'Cetak Berita Acara', icon: PrinterIcon },
  { id: TABS.MANAJEMEN, label: 'Manajemen', icon: CogIcon, role: Role.Direktorat },
  { id: TABS.LOG_AKTIVITAS, label: 'Log Aktivitas', icon: HistoryIcon, role: Role.Direktorat },
];
