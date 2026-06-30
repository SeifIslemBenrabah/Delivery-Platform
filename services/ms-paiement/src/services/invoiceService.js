const PDFDocument = require('pdfkit');

/**
 * Generate an invoice PDF buffer for a completed payment.
 */
const generateInvoice = (payment) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (c) => chunks.push(c));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ─── Header ───────────────────────────────────────────────────────────
    doc
      .fontSize(22).font('Helvetica-Bold')
      .text('Delivery Platform', 50, 50)
      .fontSize(10).font('Helvetica')
      .fillColor('#6b7280')
      .text('Plateforme de Livraison Collaborative', 50, 76)
      .fillColor('#111827');

    doc
      .moveTo(50, 100).lineTo(545, 100).strokeColor('#e5e7eb').stroke();

    // ─── Invoice meta ─────────────────────────────────────────────────────
    doc
      .fontSize(18).font('Helvetica-Bold')
      .text('FACTURE', 50, 120)
      .fontSize(10).font('Helvetica')
      .text(`N° Paiement : ${payment.paymentId.slice(0, 8).toUpperCase()}`, 50, 148)
      .text(`Commande    : #${payment.idCommande.slice(0, 8).toUpperCase()}`, 50, 162)
      .text(`Date        : ${new Date(payment.paidAt || Date.now()).toLocaleDateString('fr-FR')}`, 50, 176)
      .text(`Méthode     : ${payment.method}`, 50, 190);

    // ─── Amounts table ────────────────────────────────────────────────────
    doc
      .moveTo(50, 220).lineTo(545, 220).strokeColor('#e5e7eb').stroke()
      .font('Helvetica-Bold').fontSize(11)
      .text('Description', 50, 230)
      .text('Montant', 450, 230, { align: 'right' })
      .moveTo(50, 248).lineTo(545, 248).strokeColor('#e5e7eb').stroke()
      .font('Helvetica').fontSize(10);

    const productTotal = payment.totalAmount - payment.livraisonPrice;

    doc
      .text('Produits', 50, 258)
      .text(`${productTotal.toFixed(2)} DA`, 450, 258, { align: 'right' })
      .text('Frais de livraison', 50, 276)
      .text(`${payment.livraisonPrice.toFixed(2)} DA`, 450, 276, { align: 'right' })
      .moveTo(50, 296).lineTo(545, 296).strokeColor('#374151').stroke()
      .font('Helvetica-Bold').fontSize(12)
      .text('Total', 50, 308)
      .text(`${payment.totalAmount.toFixed(2)} DA`, 450, 308, { align: 'right' });

    // ─── Status badge ─────────────────────────────────────────────────────
    doc
      .roundedRect(50, 340, 120, 26, 4)
      .fill('#dcfce7')
      .font('Helvetica-Bold').fontSize(10)
      .fillColor('#16a34a')
      .text('✓ PAYÉ', 58, 349)
      .fillColor('#111827');

    // ─── Footer ───────────────────────────────────────────────────────────
    doc
      .fontSize(9).font('Helvetica').fillColor('#9ca3af')
      .text('Merci pour votre commande.', 50, 760, { align: 'center' })
      .text('Delivery Platform — support@deliveryplatform.dz', 50, 774, { align: 'center' });

    doc.end();
  });

module.exports = { generateInvoice };