const { Category} = require('../models');
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../../uploads');
const { processImage } = require('../config/multer');



const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: {
                tenant_id: req.tenant.id
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des categories', error: error.message });
    }
};
const createCategory = async (req, res) => {
    try {
        const { nom, desc } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Aucune image fournie' });
        }
        if (!req.tenant?.id) {
            return res.status(400).json({ message: "Tenant non détecté" });
        }
        // Traitement de l'image avec Sharp
        const filename = await processImage(req.file);
        const imageUrl = `/api/uploads/${req.tenant.id}/${filename}`;  // Add tenant ID to URL


        // Création de la catégorie
        const category = await Category.create({
            nom,
            desc,
            photo: imageUrl,
            tenant_id: req.tenant.id  // Add this if you have tenant association

        });

        res.status(201).json({
            ...category.toJSON(),
            message: 'Catégorie créée avec succès'
        });

    } catch (error) {
        // Nettoyage des fichiers en cas d'erreur
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            message: 'Erreur lors de la création de la catégorie',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, desc } = req.body;

        const category = await Category.findOne({
            where: {
                id: id,
                tenant_id: req.tenant.id
            }
        });

        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        // Initialiser avec l'ancienne URL par défaut
        let imageUrl = category.photo; // <-- Utiliser la valeur existante

        if (req.file) {
            // Suppression de l'ancienne image
            if (category.photo) {
                const photoParts = category.photo.split('/');
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

        await category.update({ nom, desc, photo: imageUrl });
        res.json(category);

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour',
            error: error.message
        });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                id: req.params.id,
                tenant_id: req.tenant.id
            }
        });

        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        if (category.photo) {
            const photoParts = category.photo.split('/');
            const tenantIdFromPhoto = photoParts[3];
            const filename = photoParts[4];
            const absolutePath = path.join(uploadsDir, tenantIdFromPhoto, filename);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        await category.destroy();
        res.json({ message: 'Suppression réussie' });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression',
            error: error.message
        });
    }
};

module.exports = { getAllCategories, createCategory, updateCategory,deleteCategory };