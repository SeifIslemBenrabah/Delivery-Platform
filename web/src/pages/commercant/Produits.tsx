import { useEffect, useState, FormEvent } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { produitService, boutiqueService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { Produit, Boutique } from '../../types';

export default function CommercantProduits() {
  const { user } = useAuthStore();
  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nomProduit: '', price: '', description: '', stock: '', photo: null as File | null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    boutiqueService.getAll().then((r) => {
      const mine = r.data.find((b: Boutique) => b.idCommercant === user?.userId);
      if (mine) {
        setBoutique(mine);
        return produitService.getByBoutique(mine.idBoutique).then((res) => setProduits(res.data));
      }
    });
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!boutique) return;
    setSaving(true);
    const fd = new FormData();
    fd.append('nomProduit', form.nomProduit);
    fd.append('price', form.price);
    fd.append('description', form.description);
    fd.append('stock', form.stock);
    fd.append('idBoutique', boutique.idBoutique);
    if (form.photo) fd.append('photo', form.photo);
    const { data } = await produitService.create(fd);
    setProduits((prev) => [data, ...prev]);
    setShowForm(false);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Produits</h1>
          <button
            onClick={() => setShowForm((p) => !p)}
            className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            + Ajouter un produit
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {[
                { name: 'nomProduit', label: 'Nom', type: 'text' },
                { name: 'price', label: 'Prix (DA)', type: 'number' },
                { name: 'stock', label: 'Stock', type: 'number' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    required
                    onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, photo: e.target.files?.[0] ?? null }))} className="text-sm" />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" disabled={saving} className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                  {saving ? 'Ajout...' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {produits.map((p) => (
            <div key={p.idProduit} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {p.photoProduit && (
                <img src={p.photoProduit} alt={p.nomProduit} className="w-full h-32 object-cover" />
              )}
              <div className="p-3">
                <p className="font-medium text-sm text-gray-800">{p.nomProduit}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-bold text-primary-600">{p.price.toFixed(2)} DA</p>
                  <p className="text-xs text-gray-400">Stock: {p.stock}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}