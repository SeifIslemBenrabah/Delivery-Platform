import { useEffect, useState } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { boutiqueService, produitService, orderService } from '../../services/api';
import type { Boutique, Produit } from '../../types';

export default function ClientCatalog() {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [selectedBoutique, setSelectedBoutique] = useState<Boutique | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    boutiqueService.getAll().then((res) => setBoutiques(res.data));
  }, []);

  const selectBoutique = async (b: Boutique) => {
    setSelectedBoutique(b);
    const res = await produitService.getByBoutique(b.idBoutique);
    setProduits(res.data);
    setCart({});
  };

  const addToCart = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const removeFromCart = (id: string) =>
    setCart((prev) => {
      if ((prev[id] ?? 0) <= 1) { const c = { ...prev }; delete c[id]; return c; }
      return { ...prev, [id]: prev[id] - 1 };
    });

  const cartTotal = produits.reduce((sum, p) => sum + (cart[p.idProduit] ?? 0) * p.price, 0);

  const placeOrder = async () => {
    if (!selectedBoutique || !address) return;
    setPlacing(true);
    const items = Object.entries(cart).map(([id, qty]) => ({ idProduit: id, quantity: qty }));
    await orderService.create({
      idBoutique: selectedBoutique.idBoutique,
      dropOffAddress: address,
      items,
      livraisonType: 'STANDARD',
    });
    setCart({});
    setPlacing(false);
    alert('Commande passée avec succès !');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Catalogue</h1>

        {/* Boutiques */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3">Choisir une boutique</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {boutiques.map((b) => (
              <button
                key={b.idBoutique}
                onClick={() => selectBoutique(b)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedBoutique?.idBoutique === b.idBoutique
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-primary-300'
                }`}
              >
                <p className="font-medium text-gray-800 text-sm">{b.nomBoutique}</p>
                <p className="text-xs text-gray-400 mt-0.5">{b.address}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedBoutique && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Products */}
            <div className="md:col-span-2 space-y-3">
              <h2 className="text-sm font-semibold text-gray-600">Produits</h2>
              {produits.map((p) => (
                <div key={p.idProduit} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{p.nomProduit}</p>
                    <p className="text-xs text-gray-400">{p.description}</p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{p.price.toFixed(2)} DA</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeFromCart(p.idProduit)} className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">−</button>
                    <span className="w-5 text-center text-sm font-medium">{cart[p.idProduit] ?? 0}</span>
                    <button onClick={() => addToCart(p.idProduit)} className="w-7 h-7 rounded-full bg-primary-600 text-white hover:bg-primary-700 text-sm">+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 h-fit">
              <h2 className="font-semibold text-gray-700 mb-3">Panier</h2>
              {Object.keys(cart).length === 0 ? (
                <p className="text-sm text-gray-400">Panier vide</p>
              ) : (
                <>
                  {Object.entries(cart).map(([id, qty]) => {
                    const p = produits.find((x) => x.idProduit === id)!;
                    return (
                      <div key={id} className="flex justify-between text-sm py-1 border-b last:border-0">
                        <span>{p.nomProduit} ×{qty}</span>
                        <span className="font-medium">{(p.price * qty).toFixed(2)} DA</span>
                      </div>
                    );
                  })}
                  <p className="text-sm font-bold mt-2 text-right">Total: {cartTotal.toFixed(2)} DA</p>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adresse de livraison"
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm mt-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={placeOrder}
                    disabled={placing || !address}
                    className="w-full mt-3 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {placing ? 'Commande en cours...' : 'Commander'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}