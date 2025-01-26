const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        const tenantPath = path.join(uploadsDir, req.tenant.id.toString());
        if (!fs.existsSync(tenantPath)) fs.mkdirSync(tenantPath);
        cb(null, tenantPath);
    },
    filename: (req, file, cb) => {
        const sanitizedName = file.originalname
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9.]/g, '_')
            .replace(/\s+/g, '_');

        cb(null, `temp_${Date.now()}_${sanitizedName}`);
    }

});

const processImage = async (file) => {
    const tenantId = file.path.split('/uploads/')[1].split('/')[0];  // Extract tenant ID from path
    const finalFilename = file.filename.replace('temp_', 'compressed_');
    const outputPath = path.join(uploadsDir, tenantId, finalFilename);

    try {
        let image = sharp(file.path);
        const metadata = await image.metadata();

        // Create tenant directory if it doesn't exist
        const tenantDir = path.join(uploadsDir, tenantId);
        if (!fs.existsSync(tenantDir)) {
            fs.mkdirSync(tenantDir, { recursive: true });
        }

        // Redimensionner si l'image est très grande (par exemple max 1280px de large)
        if (metadata.width > 1280) {
            image = image.resize(1280, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // On compresse selon le format
        switch (metadata.format) {
            case 'jpeg':
                image = image.jpeg({
                    quality: 50,         // Baissez la qualité pour réduire la taille
                    mozjpeg: true,
                    chromaSubsampling: '4:2:0'
                });
                break;
            case 'png':
                // Pour du PNG, on peut convertir en WebP si on le souhaite, sinon on reste en PNG
                // image = image.png({ /* ... */ });
                // Mais si vous voulez vraiment optimiser, convertissez les PNG en WebP (sauf cas particuliers : images avec transparence fine, etc.)
                image = image.webp({   // Par exemple, conversion en WebP
                    quality: 50
                });
                break;
            case 'webp':
                image = image.webp({
                    quality: 50
                });
                break;
            default:
                // Pour tous les autres formats, on peut tenter le WebP
                image = image.webp({
                    quality: 50
                });
                break;
        }

        await image.toFile(outputPath);

        // Supprimer le fichier temporaire
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        return finalFilename;
        //return `${tenantId}/${finalFilename}`; // Return path with tenant ID
    } catch (error) {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw error;
    }
};
module.exports = {
    upload: multer({
        storage,
        fileFilter: (req, file, cb) => {
            cb(null, file.mimetype.startsWith('image/'));
        },
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB
    }),
    processImage
};
