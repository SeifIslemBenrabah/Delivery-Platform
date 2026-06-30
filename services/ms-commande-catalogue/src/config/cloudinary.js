const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const boutiqueStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'delivery-platform/boutiques', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const produitStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'delivery-platform/produits', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

module.exports = {
  cloudinary,
  uploadBoutique: multer({ storage: boutiqueStorage }),
  uploadProduit: multer({ storage: produitStorage }),
};