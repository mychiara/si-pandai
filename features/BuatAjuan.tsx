
import React, { useState, useEffect, useMemo } from 'react';
import { User, AjuanItem, GrubBelanja, KelompokBelanja } from '../types';
import { apiService } from '../services/apiService';

interface BuatAjuanProps {
  user: User;
}

const BuatAjuan: React.FC<BuatAjuanProps> = ({ user }) => {
  const [judulKegiatan, setJudulKegiatan] = useState('');
  const [stagedItems, setStagedItems] = useState<AjuanItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<AjuanItem>>({});
  const [kelompokBelanjaList, setKelompokBelanjaList] = useState<KelompokBelanja[]>([]);

  useEffect(() => {
    apiService.getKelompokBelanja().then(setKelompokBelanjaList);
  }, []);

  const filteredKelompokBelanja = useMemo(() => {
    if (!currentItem.grubBelanja) return [];
    return kelompokBelanjaList.filter(kb => kb.grub === currentItem.grubBelanja);
  }, [currentItem.grubBelanja, kelompokBelanjaList]);

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newCurrentItem = { ...currentItem, [name]: value };

    if (name === 'jumlah' || name === 'harga') {
      const jumlah = Number(newCurrentItem.jumlah) || 0;
      const harga = Number(newCurrentItem.harga) || 0;
      newCurrentItem.total = jumlah * harga;
    }
    setCurrentItem(newCurrentItem);
  };
  
  const handleAddItem = () => {
    // Basic validation
    if (!currentItem.deskripsi || !currentItem.jumlah || !currentItem.harga || !currentItem.satuan || !currentItem.grubBelanja || !currentItem.kelompokBelanja) {
        alert("Harap isi semua field rincian.");
        return;
    }

    const newItem: AjuanItem = {
      id: `temp-${Date.now()}`,
      ...currentItem,
    } as AjuanItem;

    setStagedItems([...stagedItems, newItem]);
    setCurrentItem({});
  };

  const handleClearStaged = () => {
    setStagedItems([]);
  };

  const handleSendAll = async () => {
    if (!judulKegiatan || stagedItems.length === 0) {
        alert("Judul kegiatan dan minimal satu rincian ajuan harus diisi.");
        return;
    }
    try {
      await apiService.createAjuan({
        judulKegiatan,
        items: stagedItems,
        userId: user.id
      });
      alert('Ajuan berhasil dikirim!');
      setJudulKegiatan('');
      setStagedItems([]);
    } catch (error) {
      alert('Gagal mengirim ajuan: ' + (error as Error).message);
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  }

  const totalStagedAmount = useMemo(() => stagedItems.reduce((sum, item) => sum + item.total, 0), [stagedItems]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Buat Ajuan Baru</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="judulKegiatan" className="block text-sm font-medium text-slate-700">Judul Kegiatan</label>
          <input type="text" id="judulKegiatan" value={judulKegiatan} onChange={(e) => setJudulKegiatan(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Tambah Rincian Ajuan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
              <input type="text" name="deskripsi" value={currentItem.deskripsi || ''} onChange={handleItemChange} className="mt-1 w-full p-2 border rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Grub Belanja</label>
            <select name="grubBelanja" value={currentItem.grubBelanja || ''} onChange={handleItemChange} className="mt-1 w-full p-2 border rounded-md">
                <option value="" disabled>Pilih Grub</option>
                {Object.values(GrubBelanja).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Kelompok Belanja</label>
            <select name="kelompokBelanja" value={currentItem.kelompokBelanja || ''} onChange={handleItemChange} className="mt-1 w-full p-2 border rounded-md" disabled={!currentItem.grubBelanja}>
                <option value="" disabled>Pilih Kelompok</option>
                {filteredKelompokBelanja.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
            </select>
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700">Jumlah</label>
              <input type="number" name="jumlah" value={currentItem.jumlah || ''} onChange={handleItemChange} className="mt-1 w-full p-2 border rounded-md"/>
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700">Satuan</label>
              <input type="text" name="satuan" value={currentItem.satuan || ''} onChange={handleItemChange} className="mt-1 w-full p-2 border rounded-md"/>
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700">Harga Satuan</label>
              <input type="number" name="harga" value={currentItem.harga || ''} onChange={handleItemChange} className="mt-1 w-full p-2 border rounded-md"/>
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700">Total</label>
              <input type="text" name="total" value={formatCurrency(currentItem.total)} readOnly className="mt-1 w-full p-2 border rounded-md bg-slate-100"/>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700">Keterangan/Data Dukung (Link)</label>
              <input type="text" name="keterangan" value={currentItem.keterangan || ''} onChange={handleItemChange} className="mt-1 w-full p-2 border rounded-md"/>
          </div>
          <div>
              <button onClick={handleAddItem} className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Tambah Rincian</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Daftar Ajuan (Staging)</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Deskripsi</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Jumlah</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Harga</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {stagedItems.map(item => (
                        <tr key={item.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{item.deskripsi}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{item.jumlah} {item.satuan}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(item.harga)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(item.total)}</td>
                        </tr>
                    ))}
                </tbody>
                 <tfoot className="bg-slate-100">
                    <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-bold text-slate-700">Total Keseluruhan</td>
                        <td className="px-4 py-2 font-bold text-slate-800">{formatCurrency(totalStagedAmount)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
         <div className="flex justify-end gap-4 mt-6">
            <button onClick={handleClearStaged} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">Bersihkan Daftar</button>
            <button onClick={handleSendAll} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">Kirim Semua Ajuan</button>
        </div>
      </div>
    </div>
  );
};

export default BuatAjuan;
