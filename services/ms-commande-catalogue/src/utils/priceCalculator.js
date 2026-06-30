const LIVRAISON_PRICES = {
  STANDARD: parseFloat(process.env.LIVRAISON_PRICE_STANDARD || '200'),
  EXPRESS:  parseFloat(process.env.LIVRAISON_PRICE_EXPRESS  || '400'),
};

/**
 * Calculate total price from items and delivery type.
 * @param {Array<{unitPrice: number, quantity: number}>} items
 * @param {'STANDARD'|'EXPRESS'} livraisonType
 * @returns {{ totalPrice: number, livraisonPrice: number }}
 */
const calculatePrices = (items, livraisonType = 'STANDARD') => {
  const itemsTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const livraisonPrice = LIVRAISON_PRICES[livraisonType] ?? LIVRAISON_PRICES.STANDARD;
  return {
    totalPrice:    parseFloat((itemsTotal + livraisonPrice).toFixed(2)),
    livraisonPrice: parseFloat(livraisonPrice.toFixed(2)),
  };
};

module.exports = { calculatePrices };