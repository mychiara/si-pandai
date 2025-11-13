
export enum Role {
  Prodi = 'prodi',
  Direktorat = 'direktorat',
}

export enum AjuanStatus {
  Menunggu = 'Menunggu',
  Diterima = 'Diterima',
  Ditolak = 'Ditolak',
  Revisi = 'Revisi',
}

export enum GrubBelanja {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

export interface User {
  id: string;
  email: string;
  nama: string;
  role: Role;
  idProdi?: string;
  namaProdi?: string;
  paguAwal: number;
  paguPerubahan?: number;
  jabatanTtd?: string;
}

export interface AjuanItem {
  id: string;
  deskripsi: string;
  grubBelanja: GrubBelanja;
  kelompokBelanja: string;
  jumlah: number;
  satuan: string;
  harga: number;
  total: number;
  keterangan: string;
}

export interface Ajuan {
  id: string;
  judulKegiatan: string;
  idProdi: string;
  namaProdi: string;
  pembuat: string;
  totalAnggaran: number;
  status: AjuanStatus;
  tipe: 'awal' | 'perubahan';
  tahapPerubahan?: number;
  revisiKe: number;
  items: AjuanItem[];
  createdAt: Date;
  updatedAt: Date;
  history: AjuanHistory[];
}

export interface AjuanHistory {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export interface KelompokBelanja {
  id: string;
  nama: string;
  grub: GrubBelanja;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  userId: string;
  action: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
