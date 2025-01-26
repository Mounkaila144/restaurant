// middleware/tenant.js
const { Tenant } = require('../models');

const resolveTenant = async (req, res, next) => {
    const domain = req.headers.host.split(':')[0]; // ou req.subdomains
    const tenant = await Tenant.findOne({ where: { domain } });

    if (!tenant) return res.status(404).json({ message: 'Tenant non trouvé' });

    req.tenant = tenant;
    next();
};

module.exports = resolveTenant;