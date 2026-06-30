import { useEffect, useState, FormEvent } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { boutiqueService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { Boutique } from '../../types';

export default function CommercantBoutique() {
  const { user } = useAuthStore();
  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [form, setForm] = useState({ nomBoutique: '', address: '', photoFrontBoutique: null as File | null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    boutiqueService.getAll().then((r) => {
      const mine = r.data.find((b: Boutique) => b.idCommercant === user?.userId);
      if (mine) setBoutique(mine);
    });
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('nomBoutique', form.nomBoutique);
    fd.append('address', form.address);
    if (form.photoFrontBoutique) fd.append('photo', form.photoFrontBoutique);
    if (boutique) {
      const { data } = await boutiqueService.update(boutique.idBoutique, fd);
      setBoutique(data);
    } else {
      const { data } = await boutiqueService.create(fd);
      setBoutique(data);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Ma boutique</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
              <input
                type="text"
                defaultValue={boutique?.nomBoutique}
                onChange={(e) => setForm((p) => ({ ...p, nomBoutique: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                defaultValue={boutique?.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo de façade</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((p) => ({ ...p, photoFrontBoutique: e.target.files?.[0] ?? null }))}
                className="text-sm text-gray-600"
              />
              {boutique?.photoFrontBoutique && (
                <img src={boutique.photoFrontBoutique} alt="boutique" className="mt-2 w-32 h-20 object-cover rounded-lg" />
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary-600 text-white font-medium py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : boutique ? 'Mettre à jour' : 'Créer la boutique'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}