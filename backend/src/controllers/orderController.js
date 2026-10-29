import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = Number((itemsPrice * taxRate).toFixed(2));

  const totalPrice = Number((
    itemsPrice +
    shippingPrice +
    taxPrice
  ).toFixed(2));

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice,
    totalPrice,
  };
}

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );

    if (!matchingItemFromDB) {
      res.status(404);
      throw new Error(`Product not found: ${itemFromClient._id}`);
    }

    return {
      name: matchingItemFromDB.name,
      qty: itemFromClient.qty,
      image: matchingItemFromDB.image,
      price: matchingItemFromDB.price,
      product: matchingItemFromDB._id,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id username");
  res.json(orders);
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const countTotalOrders = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  res.json({ totalOrders });
});

const calculateTotalSales = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isPaid: true });
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  res.json({ totalSales: Number(totalSales.toFixed(2)) });
});

const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  const salesByDate = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
        },
        totalSales: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.json(salesByDate);
});

const calcualteTotalSalesByDate = calculateTotalSalesByDate;

const findOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "username email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Authorize: admin or the owner of the order
  if (
    !req.user.isAdmin &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json(order);
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body?.payer?.email_address || req.body?.email_address,
  };

  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
