const { Order, OrderDetail, DetailOption, Product, Option, User } = require('../models');

const createOrder = async (req, res) => {
    try {
        const { type, paiement, adresse, notes, items } = req.body;
        const user_id = req.user.id;

        let total = 0;

        // Calculer le total de la commande
        for (const item of items) {
            const product = await Product.findByPk(item.plat_id);
            if (!product) {
                return res.status(404).json({ message: `Produit ${item.plat_id} non trouvé` });
            }

            let itemTotal = product.prix * item.qte;

            if (item.options) {
                const options = await Option.findAll({
                    where: { id: item.options }
                });
                itemTotal += options.reduce((sum, opt) => sum + opt.prix, 0) * item.qte;
            }

            total += itemTotal;
        }

        const order = await Order.create({
            user_id,
            type,
            total,
            paiement,
            adresse,
            notes
        });

        // Créer les détails de la commande
        for (const item of items) {
            const orderDetail = await OrderDetail.create({
                cmd_id: order.id,
                plat_id: item.plat_id,
                qte: item.qte,
                prix: item.prix,
                notes: item.notes
            });

            if (item.options) {
                await Promise.all(item.options.map(optionId =>
                    DetailOption.create({
                        cmd_detail_id: orderDetail.id,
                        option_id: optionId
                    })
                ));
            }
        }

        const completeOrder = await Order.findByPk(order.id, {
            include: [{
                model: OrderDetail,
                include: [
                    { model: Product },
                    { model: Option }
                ]
            }]
        });

        res.status(201).json(completeOrder);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: OrderDetail,
                include: [
                    { model: Product },
                    { model: Option }
                ]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
    }
};


module.exports = { createOrder, getUserOrders };