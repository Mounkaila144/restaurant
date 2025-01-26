const { Media } = require('../models');
const fs = require('fs');
const path = require('path');

const createMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier uploadé' });
        }

        const media = await Media.create({
            type: 'image',
            url: `/uploads/${req.file.filename}`,
            titre: req.body.titre || '',
            desc: req.body.desc || ''
        });

        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du média', error: error.message });
    }
};

const getAllMedia = async (req, res) => {
    try {
        const medias = await Media.findAll();
        res.json(medias);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des médias', error: error.message });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Média non trouvé' });
        }

        // Supprimer le fichier physique
        const filePath = path.join(__dirname, '..', media.url);
        fs.unlinkSync(filePath);

        await media.destroy();
        res.json({ message: 'Média supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du média', error: error.message });
    }
};

module.exports = { createMedia, getAllMedia, deleteMedia };