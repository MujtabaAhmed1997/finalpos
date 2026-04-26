/**
 * Sales Order Service
 * 
 * Handles complex sales order operations with:
 * - Transaction management
 * - N+1 query prevention (eager loading)
 * - Stock validation and updates
 * - Payment tracking
 * 
 * N+1 Problem Prevention:
 * WRONG: for (item of items) { await Product.findByPk(id) } // N queries
 * RIGHT: await Product.findAll({ where: { id: [...] } }) // 1 query
 */

const SalesOrder = require('../models/salesorder');
const SalesOrderDetail = require('../models/salesorderdetail');
const Product = require('../models/product');
const StockTransaction = require('../models/stockstranscation');
const Customer = require('../models/customer');
const sequelize = require('../db/sequelize');
const { executeTransaction } = require('../helpers/transactionHelper');
const { errorLogger } = require('../helpers/logger');

class SalesOrderService {
    /**
     * Create sales order with multiple items and stock updates
     * Atomically creates order, details, updates stock, and logs transactions
     * 
     * @param {Object} orderData - { customerId, total, notes }
     * @param {Array} items - [{ productId, quantity, unitPrice }]
     * @returns {Object} Created order with details
     * @throws {Error} If customer not found, insufficient stock, etc.
     */
    static async createSalesOrder(orderData, items) {
        try {
            // Validate customer exists
            const customer = await Customer.findByPk(orderData.customerId);
            if (!customer) {
                const error = new Error('Customer not found');
                error.statusCode = 404;
                throw error;
            }

            // Validate items exist and have sufficient stock
            // THIS IS KEY FOR N+1 PREVENTION: Single query for all products
            const productIds = items.map(item => item.productId);
            const products = await Product.findAll({
                where: { id: productIds },
                raw: true
            });

            // Map products for easy lookup (O(1) instead of O(n) per item)
            const productMap = new Map(products.map(p => [p.id, p]));

            // Validate all products exist and have stock
            for (const item of items) {
                const product = productMap.get(item.productId);
                if (!product) {
                    const error = new Error(`Product ${item.productId} not found`);
                    error.statusCode = 404;
                    throw error;
                }
                if (product.stock < item.quantity) {
                    const error = new Error(
                        `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
                    );
                    error.statusCode = 400;
                    throw error;
                }
            }

            // Execute transaction for atomicity
            const order = await executeTransaction(async (transaction) => {
                // Create sales order
                const newOrder = await SalesOrder.create(
                    {
                        customerId: orderData.customerId,
                        total: orderData.total || items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
                        notes: orderData.notes,
                        status: 'completed'
                    },
                    { transaction }
                );

                // Create order details and update stock
                // Batch operations to minimize DB queries
                const detailsData = [];
                const updates = [];

                for (const item of items) {
                    const product = productMap.get(item.productId);

                    // Prepare detail record
                    detailsData.push({
                        salesOrderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.quantity * item.unitPrice
                    });

                    // Prepare stock update
                    updates.push({
                        productId: item.productId,
                        newStock: product.stock - item.quantity
                    });
                }

                // Bulk create details
                await SalesOrderDetail.bulkCreate(detailsData, { transaction });

                // Bulk update stocks
                for (const update of updates) {
                    await Product.update(
                        { stock: update.newStock },
                        { where: { id: update.productId }, transaction }
                    );
                }

                // Log stock transactions
                const transactionData = items.map((item, idx) => ({
                    productId: item.productId,
                    transactionType: 'sales',
                    quantity: -item.quantity,
                    referenceId: newOrder.id,
                    referenceType: 'sales_order'
                }));
                await StockTransaction.bulkCreate(transactionData, { transaction });

                return newOrder;
            });

            // Fetch complete order with details (using eager loading to prevent N+1)
            return await this.getSalesOrderById(order.id);
        } catch (error) {
            errorLogger(error, { context: 'SalesOrderService.createSalesOrder' });
            throw error;
        }
    }

    /**
     * Get sales order by ID with all relationships (prevents N+1)
     * GOOD: Single query with eager loading of all related data
     * 
     * @param {number} orderId - Order ID
     * @returns {Object} Order with customer and items
     */
    static async getSalesOrderById(orderId) {
        try {
            // Single query with eager loading prevents N+1
            const order = await SalesOrder.findByPk(orderId, {
                include: [
                    {
                        model: Customer,
                        attributes: ['id', 'name', 'email', 'phone']
                    },
                    {
                        model: SalesOrderDetail,
                        include: [
                            {
                                model: Product,
                                attributes: ['id', 'name', 'sku', 'price']
                            }
                        ]
                    }
                ]
            });

            if (!order) {
                const error = new Error('Sales order not found');
                error.statusCode = 404;
                throw error;
            }

            return order;
        } catch (error) {
            errorLogger(error, { context: 'SalesOrderService.getSalesOrderById', orderId });
            throw error;
        }
    }

    /**
     * Get all sales orders with pagination (prevents N+1)
     * Uses eager loading for all relationships
     * 
     * @param {Object} options - { limit, offset, customerId, status }
     * @returns {Array} Orders with relationships
     */
    static async getAllSalesOrders(options = {}) {
        try {
            const { limit = 50, offset = 0, customerId, status } = options;
            const where = {};
            if (customerId) where.customerId = customerId;
            if (status) where.status = status;

            // Single efficient query with eager loading
            const orders = await SalesOrder.findAll({
                where,
                include: [
                    {
                        model: Customer,
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: SalesOrderDetail,
                        attributes: ['id', 'productId', 'quantity', 'unitPrice']
                    }
                ],
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                subQuery: false // Important for accurate limit/offset with includes
            });

            return orders;
        } catch (error) {
            errorLogger(error, { context: 'SalesOrderService.getAllSalesOrders' });
            throw error;
        }
    }

    /**
     * Get sales order items in detail
     * With product information (prevents N+1 with eager loading)
     * 
     * @param {number} orderId - Order ID
     * @returns {Array} Order items with product details
     */
    static async getOrderItems(orderId) {
        try {
            // Single query using include
            const details = await SalesOrderDetail.findAll({
                where: { salesOrderId: orderId },
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'sku', 'category', 'price']
                    }
                ]
            });

            return details;
        } catch (error) {
            errorLogger(error, { context: 'SalesOrderService.getOrderItems', orderId });
            throw error;
        }
    }

    /**
     * Get sales statistics (demonstrates efficient aggregation)
     * 
     * @param {Object} options - { startDate, endDate, customerId }
     * @returns {Object} Statistics (count, total, average)
     */
    static async getSalesStatistics(options = {}) {
        try {
            const { startDate, endDate, customerId } = options;
            const where = {};

            if (startDate && endDate) {
                where.createdAt = {
                    [sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }
            if (customerId) {
                where.customerId = customerId;
            }

            // Single aggregation query
            const stats = await SalesOrder.findAll({
                where,
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
                    [sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue'],
                    [sequelize.fn('AVG', sequelize.col('total')), 'averageOrder']
                ],
                raw: true,
                subQuery: false
            });

            return stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrder: 0 };
        } catch (error) {
            errorLogger(error, { context: 'SalesOrderService.getSalesStatistics' });
            throw error;
        }
    }

    /**
     * Cancel sales order and restore stock
     * 
     * @param {number} orderId - Order ID
     * @returns {boolean} Success
     */
    static async cancelSalesOrder(orderId) {
        try {
            return await executeTransaction(async (transaction) => {
                const order = await SalesOrder.findByPk(orderId, { transaction });
                if (!order) {
                    const error = new Error('Sales order not found');
                    error.statusCode = 404;
                    throw error;
                }

                if (order.status === 'cancelled') {
                    const error = new Error('Order already cancelled');
                    error.statusCode = 400;
                    throw error;
                }

                // Get order items
                const items = await SalesOrderDetail.findAll({
                    where: { salesOrderId: orderId },
                    transaction
                });

                // Restore stock for each item
                for (const item of items) {
                    const product = await Product.findByPk(item.productId, { transaction });
                    if (product) {
                        await product.update(
                            { stock: product.stock + item.quantity },
                            { transaction }
                        );
                    }

                    // Log reversal transaction
                    await StockTransaction.create(
                        {
                            productId: item.productId,
                            transactionType: 'sales_reversal',
                            quantity: item.quantity,
                            referenceId: orderId,
                            referenceType: 'sales_order_cancellation'
                        },
                        { transaction }
                    );
                }

                // Mark order as cancelled
                await order.update(
                    { status: 'cancelled' },
                    { transaction }
                );

                return true;
            });
        } catch (error) {
            errorLogger(error, { context: 'SalesOrderService.cancelSalesOrder', orderId });
            throw error;
        }
    }
}

module.exports = SalesOrderService;
