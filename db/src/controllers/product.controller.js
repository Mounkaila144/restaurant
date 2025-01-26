const { Product, Category, Option } = require('../models');
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../../uploads');
const { processImage } = require('../config/multer');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { tenant_id: req.tenant.id },
            include: [
                { model: Category, attributes: ['nom'] },
                { model: Option }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { categorie_id, nom, desc, prix, photo, dispo, options } = req.body;
        if (!req.tenant?.id) {
            return res.status(400).json({ message: "Tenant non détecté" });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Aucune image fournie' });
        }
        const filename = await processImage(req.file);
        const imageUrl = `/api/uploads/${req.tenant.id}/${filename}`;  // Add tenant ID to URL

        const product = await Product.create({
            categorie_id,
            nom,
            desc,
            prix,
            photo: imageUrl,
            dispo,
            tenant_id: req.tenant.id  // Add this if you have tenant association

        });

        if (options && options.length > 0) {
            await Promise.all(options.map(option =>
                Option.create({
                    plat_id: product.id,
                    nom: option.nom,
                    prix: option.prix
                })
            ));
        }

        const productWithOptions = await Product.findByPk(product.id, {
            include: [Option]
        });

        res.status(201).json(productWithOptions);
    } catch (error) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Erreur lors de la création du produit', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { categorie_id, nom, desc, prix, photo, dispo, options } = req.body;

        const product = await Product.findOne({
            where: {
                id: id,
                tenant_id: req.tenant.id
            }
        });
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        let imageUrl = product.photo;

        if (req.file) {
            if (product.photo) {
                const photoParts = product.photo.split('/');
                const tenantIdFromPhoto = photoParts[3];
                const filenameFromPhoto = photoParts[4];
                const oldFilePath = path.join(uploadsDir, tenantIdFromPhoto, filenameFromPhoto);

                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                    console.log('Ancienne image supprimée:', oldFilePath);
                } else {
                    console.warn('Fichier introuvable pour suppression:', oldFilePath);
                }
            }

            // Traitement de la nouvelle image
            const filename = await processImage(req.file); // <-- Déclaration ici
            imageUrl = `/api/uploads/${req.tenant.id}/${filename}`; // <-- Mise à jour après
        }
        await product.update({
            categorie_id,
            nom,
            desc,
            prix,
            photo: imageUrl,
            dispo
        });

        if (options) {
            await Option.destroy({ where: { plat_id: id } });
            await Promise.all(options.map(option =>
                Option.create({
                    plat_id: id,
                    nom: option.nom,
                    prix: option.prix
                })
            ));
        }

        const updatedProduct = await Product.findByPk(id, {
            include: [Option]
        });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', error: error.message });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            where: {
                id: id,
                tenant_id: req.tenant.id
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Suppression de l'image associée
        if (product.photo) {
            const photoParts = product.photo.split('/');
            const tenantIdFromPhoto = photoParts[3];
            const filename = photoParts[4];
            const absolutePath = path.join(uploadsDir, tenantIdFromPhoto, filename);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        // Suppression des options associées
        await Option.destroy({
            where: { plat_id: id }
        });

        // Suppression du produit
        await product.destroy();

        res.json({ message: 'Produit et options associées supprimés avec succès' });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression du produit',
            error: error.message
        });
    }
};

module.exports = { getAllProducts, createProduct, updateProduct,deleteProduct };