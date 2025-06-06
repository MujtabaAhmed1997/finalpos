// routes/batchRoutes.js
const express = require('express');
const router = express.Router();
const Batch = require('../models/batchmodel'); // Adjust the path to your Batch model

// Helper function to generate BatchName
const generateBatchName = (ProductID, VariationID) => {
    console.log('in batch generator ftn')
    const timestamp = Date.now(); // Use current timestamp for uniqueness
    console.log(`BATCH-${ProductID}-${VariationID}-${timestamp}`)
    return `BATCH-${ProductID}-${VariationID}-${timestamp}`;
};

// Create a new batch
router.post('/create', async (req, res) => {
    const { ProductID, VariationID, Quantity, CostPricePerUnit } = req.body;
   console.log("body",req.body)
    if (!ProductID || !VariationID || !Quantity ) {
        return res.status(400).json({ message: 'All fields except BatchName are required' });
    }

    // Generate BatchName dynamically
    const BatchName = generateBatchName(ProductID, VariationID);
    console.log("Batch Name",BatchName)

    try {
        const newBatch = await Batch.create({
            ProductID,
            VariationID,
            BatchName,
            Quantity,
            CostPricePerUnit
        
        });
        res.status(201).json({ message: 'Batch created successfully', batch: newBatch });
    } catch (error) {
        console.error('Error creating batch:', error);
        res.status(500).json({ message: 'Failed to create batch', error: error.message });
    }
});

module.exports = router;
