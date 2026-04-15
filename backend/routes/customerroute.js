const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const CustomerLeisure = require('../models/customerleisure');
const { Op } = require('sequelize');
// Create a new customer
// router.post('/', async (req, res) => {
//     try {
//         const customer = await Customer.create(req.body);
//         res.status(201).json(customer);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// router.post('/', async (req, res) => {
//     const { CustomerName, Address, Phone, Email, AvailableBalance } = req.body;

//     // === Basic validation ===
//     const errors = {};

//     if (!CustomerName || CustomerName.trim() === '') {
//         errors.CustomerName = 'Customer name is required';
//     }

//     if (Phone && !/^\d{10,15}$/.test(Phone)) {
//         errors.Phone = 'Phone must be a valid number with 10 to 15 digits';
//     }

//     if (Email && !/^\S+@\S+\.\S+$/.test(Email)) {
//         errors.Email = 'Email must be valid';
//     }

//     if (AvailableBalance && isNaN(AvailableBalance)) {
//         errors.AvailableBalance = 'Available balance must be a number';
//     }

//     if (Object.keys(errors).length > 0) {
//         console.error('Validation errors:', errors);
//         return res.status(400).json({ message: 'Validation failed', errors });
//     }

//     const alreadyCustomer = await Customer.findOne({ where: { CustomerName: CustomerName } })
//     if (alreadyCustomer) {
//         return res.status(400).json({ message: 'Customer with same Name already Exists' });

//     }
//     // === Proceed to create if valid ===
//     try {
//         const newCustomer = await Customer.create({
//             CustomerName,
//             Address,
//             Phone,
//             Email,
//             AvailableBalance,
//         });

//         res.status(201).json(newCustomer);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


router.post('/', async (req, res) => {
    const { CustomerName, Address, Phone, Email, AvailableBalance } = req.body;

    // === Basic validation ===
    const errors = {};

    if (!CustomerName || CustomerName.trim() === '') {
        errors.CustomerName = 'Customer name is required';
    } else if (CustomerName.trim().length > 255) {
        errors.CustomerName = 'Customer name must be less than 255 characters';
    }

    // Phone is mandatory
    if (!Phone || Phone.trim() === '') {
        errors.Phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(Phone.trim())) {
        errors.Phone = 'Phone must be a valid number with 10 to 15 digits';
    } else if (Phone.trim().length > 255) {
        errors.Phone = 'Phone number must be less than 255 characters';
    }

    if (Email && Email.trim() !== '') {
        if (!/^\S+@\S+\.\S+$/.test(Email)) {
            errors.Email = 'Email must be valid';
        } else if (Email.trim().length > 255) {
            errors.Email = 'Email must be less than 255 characters';
        }
    }

    if (Address && Address.trim() !== '' && Address.trim().length > 255) {
        errors.Address = 'Address must be less than 255 characters';
    }

    // Convert AvailableBalance to number if it's a string
    let availableBalanceValue = AvailableBalance;
    if (AvailableBalance !== undefined && AvailableBalance !== null) {
        availableBalanceValue = parseFloat(AvailableBalance);
        if (isNaN(availableBalanceValue)) {
            errors.AvailableBalance = 'Available balance must be a valid number';
        }
    }

    if (Object.keys(errors).length > 0) {
        console.error('Validation errors:', errors);
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    try {
        const alreadyCustomer = await Customer.findOne({ 
            where: { 
                CustomerName: CustomerName.trim(),
                softDelete: false 
            } 
        });
        if (alreadyCustomer) {
            return res.status(400).json({ message: 'Customer with same name already exists' });
        }

        const newCustomer = await Customer.create({
            CustomerName: CustomerName.trim(),
            Address: Address?.trim() || null,
            Phone: Phone?.trim() || null,
            Email: Email?.trim() || null,
            AvailableBalance: availableBalanceValue || 0.0,
        });

        res.status(201).json(newCustomer);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});




// Get a customer by ID






router.get('/customerleisure/lastbalance/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        // Fetch the last balance entry for a specific customer
        const lastLeisureEntry = await CustomerLeisure.findOne({
            where: { CustomerID: customerId },
            order: [['TransactionDate', 'DESC']], // or another field that orders the most recent entry first
        });

        if (lastLeisureEntry) {
            res.json({ lastBalance: lastLeisureEntry.Balance });
        } else {
            res.status(404).json({ message: 'No records found' });
        }
    } catch (error) {
        console.error('Error fetching last balance:', error);
        res.status(500).json({ error: 'An error occurred while fetching the last balance' });
    }
});


router.put('/:id', async (req, res) => {
    const { CustomerName, Address, Phone, Email, AvailableBalance } = req.body;

    const errors = {};

    // === Field Validations ===
    if (CustomerName !== undefined && (!CustomerName || CustomerName.trim() === '')) {
        errors.CustomerName = 'Customer name is required';
    }

    if (Phone !== undefined && !/^\d{10,15}$/.test(Phone)) {
        errors.Phone = 'Phone must be a valid number with 10 to 15 digits';
    }

    if (Email && Email.trim() !== '' && !/^\S+@\S+\.\S+$/.test(Email)) {
        errors.Email = 'Email must be valid';
    }

    if (AvailableBalance !== undefined && isNaN(AvailableBalance)) {
        errors.AvailableBalance = 'Available balance must be a number';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors,
        });
    }

    try {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // === Check for duplicate CustomerName ===
        if (CustomerName && CustomerName.trim() !== customer.CustomerName) {
            const existing = await Customer.findOne({
                where: {
                    CustomerName: CustomerName.trim(),
                    CustomerID: { [Op.ne]: req.params.id } // Exclude current record
                }
            });

            if (existing) {
                return res.status(400).json({
                    message: 'Customer with the same name already exists',
                });
            }
        }

        // === Proceed to update ===
        await customer.update({
            CustomerName,
            Address,
            Phone,
            Email: Email?.trim() || null,
            AvailableBalance,
        });

        res.status(200).json(customer);
    } catch (error) {
        console.error('Update failed:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Delete a customer by ID
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        console.log("🚀 ~ customer:", customer)
        if (customer) {
            customer.softDelete = true; // Mark as soft-deleted
          softDeleted=  await customer.save();
          console.log("🚀 ~ softDeleted:", softDeleted)

            res.status(204).end(); // No content
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/customers/search?name=Ali&page=1&limit=5
router.get('/searching', async (req, res) => {
    const { name = '', page = 1, limit = 10 } = req.query;
    console.log("customerquery", req.query)

    try {
        const offset = (page - 1) * limit;

        const { count, rows } = await Customer.findAndCountAll({
            where: {
                customerName: {
                    [Op.like]: `%${name}%`
                },
                softDelete:false
            },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        console.log("customer",)

        // ✅ Always return a valid result object — no "not found" error
        res.json({
            total: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        console.error('Customer search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Customer.findAndCountAll({
            limit,
            offset,
            order: [['CustomerID', 'ASC']],
            where:{
            softDelete:false
            }
        });

        res.json({
            data: rows,
            total: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
module.exports = router;
