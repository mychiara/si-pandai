DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS KelompokBelanja;
DROP TABLE IF EXISTS Ajuans;
DROP TABLE IF EXISTS AjuanItems;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS ActivityLogs;

CREATE TABLE Users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    role TEXT NOT NULL,
    idProdi TEXT,
    namaProdi TEXT,
    paguAwal INTEGER NOT NULL,
    paguPerubahan INTEGER,
    jabatanTtd TEXT
);

CREATE TABLE KelompokBelanja (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    grub TEXT NOT NULL
);

CREATE TABLE Ajuans (
    id TEXT PRIMARY KEY,
    judulKegiatan TEXT NOT NULL,
    idProdi TEXT NOT NULL,
    namaProdi TEXT NOT NULL,
    pembuat TEXT NOT NULL,
    totalAnggaran INTEGER NOT NULL,
    status TEXT NOT NULL,
    tipe TEXT NOT NULL,
    revisiKe INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

CREATE TABLE AjuanItems (
    id TEXT PRIMARY KEY,
    ajuanId TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    grubBelanja TEXT NOT NULL,
    kelompokBelanja TEXT NOT NULL,
    jumlah INTEGER NOT NULL,
    satuan TEXT NOT NULL,
    harga INTEGER NOT NULL,
    total INTEGER NOT NULL,
    keterangan TEXT,
    FOREIGN KEY (ajuanId) REFERENCES Ajuans(id)
);

CREATE TABLE Notifications (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0, -- 0 for false, 1 for true
    createdAt TEXT NOT NULL
);

CREATE TABLE ActivityLogs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    userName TEXT NOT NULL,
    userId TEXT NOT NULL,
    action TEXT NOT NULL
);

-- Seed data awal agar tidak kosong
INSERT INTO Users (id, email, nama, role, idProdi, namaProdi, paguAwal, jabatanTtd) VALUES
('user-1', 'prodi@test.com', 'Ahmad Budi', 'prodi', 'prodi-ti', 'Teknik Informatika', 1000000000, 'Kepala Prodi Teknik Informatika'),
('user-2', 'direktorat@test.com', 'Siti Aminah', 'direktorat', NULL, NULL, 0, 'Direktur Keuangan');