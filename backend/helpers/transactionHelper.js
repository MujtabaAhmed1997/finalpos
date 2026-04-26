const sequelize = require('../db/sequelize');

/**
 * Execute a database operation within a transaction
 * Ensures atomicity - all operations succeed or all fail
 * 
 * Usage:
 * const result = await executeTransaction(async (transaction) => {
 *   const order = await SalesOrder.create({ ... }, { transaction });
 *   await StockTransaction.create({ ... }, { transaction });
 *   return order;
 * });
 */
const executeTransaction = async (callback, isolationLevel = 'READ_COMMITTED') => {
    const transaction = await sequelize.transaction({
        isolationLevel: sequelize.Transaction.ISOLATION_LEVELS[isolationLevel]
    });

    try {
        const result = await callback(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Helper for creating sales order with stock updates
 * Ensures stock is decreased atomically with order creation
 */
const createSalesOrderWithStock = async (orderData, items, transaction) => {
    const SalesOrder = require('../models/salesorder');
    const SalesOrderDetail = require('../models/salesorderdetail');
    const StockTransaction = require('../models/stockstranscation');
    const Product = require('../models/product');

    // Create order
    const order = await SalesOrder.create(orderData, { transaction });

    // Create order details and update stock
    for (const item of items) {
        // Create order detail
        await SalesOrderDetail.create(
            {
                salesOrderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            },
            { transaction }
        );

        // Update product stock
        const product = await Product.findByPk(item.productId, { transaction });
        if (!product) {
            throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        // Decrease stock
        await product.update(
            { stock: product.stock - item.quantity },
            { transaction }
        );

        // Record stock transaction
        await StockTransaction.create(
            {
                productId: item.productId,
                transactionType: 'sales',
                quantity: -item.quantity,
                referenceId: order.id,
                referenceType: 'sales_order'
            },
            { transaction }
        );
    }

    return order;
};

/**
 * Helper for creating purchase order with stock updates
 * Ensures stock is increased atomically with order creation
 */
const createPurchaseOrderWithStock = async (orderData, items, transaction) => {
    const PurchaseOrder = require('../models/purchaseorder');
    const PurchaseOrderDetail = require('../models/purchaseorderdetails');
    const StockTransaction = require('../models/stockstranscation');
    const Product = require('../models/product');

    // Create purchase order
    const order = await PurchaseOrder.create(orderData, { transaction });

    // Create order details and update stock
    for (const item of items) {
        // Create order detail
        await PurchaseOrderDetail.create(
            {
                purchaseOrderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            },
            { transaction }
        );

        // Update product stock
        const product = await Product.findByPk(item.productId, { transaction });
        if (!product) {
            throw new Error(`Product ${item.productId} not found`);
        }

        // Increase stock
        await product.update(
            { stock: product.stock + item.quantity },
            { transaction }
        );

        // Record stock transaction
        await StockTransaction.create(
            {
                productId: item.productId,
                transactionType: 'purchase',
                quantity: item.quantity,
                referenceId: order.id,
                referenceType: 'purchase_order'
            },
            { transaction }
        );
    }

    return order;
};

/**
 * Helper for creating payment and updating order status atomically
 */
const createPaymentWithStatusUpdate = async (paymentData, orderId, transaction) => {
    const Payment = require('../models/customerpayment');
    const SalesOrder = require('../models/salesorder');

    // Create payment
    const payment = await Payment.create(paymentData, { transaction });

    // Update sales order payment status if fully paid
    const order = await SalesOrder.findByPk(orderId, { transaction });
    if (order) {
        const totalPaid = (order.totalPaid || 0) + paymentData.amount;
        const status = totalPaid >= order.total ? 'paid' : 'partial';

        await order.update(
            { totalPaid, paymentStatus: status },
            { transaction }
        );
    }

    return payment;
};

module.exports = {
    executeTransaction,
    createSalesOrderWithStock,
    createPurchaseOrderWithStock,
    createPaymentWithStatusUpdate
};
