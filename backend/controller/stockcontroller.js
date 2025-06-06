const conversionService = require('../services/Converionservice');

// Controller function to handle the sell loose quantity request
const sellLooseQuantity = async (req, res) => {
    const { variationId, requestedQuantity, unitType } = req.body;
    try {
        await conversionService.sellLooseQuantity(variationId, requestedQuantity, unitType);
        res.status(200).send('Quantity sold and stock updated successfully');
    } catch (error) {
        res.status(500).send('Error selling quantity: ' + error.message);
    }
};

module.exports = {
    sellLooseQuantity,
};
