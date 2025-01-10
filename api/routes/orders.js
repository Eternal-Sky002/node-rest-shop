const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       product:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                  name:
 *                                      type: string
 *                                  price:
 *                                      type: number
 *                       quantity:
 *                         type: number
 *                       totalPrice:
 *                         type: number
 *                       request:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           url:
 *                             type: string
 *       401:
 *          description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', checkAuth, OrdersController.orders_get_all);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', checkAuth, OrdersController.orders_create_order);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Retrieve a order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/:orderId', checkAuth, OrdersController.orders_get_by_id);

/**
 * @swagger
 * /orders/{orderId}:
 *   patch:
 *     summary: Update a order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:orderId', checkAuth, OrdersController.orders_update_order);

/**
 * @swagger
 * /orders/{orderId}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;