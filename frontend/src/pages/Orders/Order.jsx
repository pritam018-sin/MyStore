import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err?.message || "Payment update failed");
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: Number(order.totalPrice).toFixed(2),
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err?.message || "PayPal transaction error");
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to update delivery status");
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div className="container mx-auto px-4 py-8">
      <Message variant="danger">
        {error?.data?.message || error?.error || "Error loading order"}
      </Message>
    </div>
  ) : (
    <div className="container mx-auto px-4 md:pl-[4.5rem] py-6 flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3">
        <div className="glass-card p-4 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Order Items</h2>
          {!order.orderItems || order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead className="border-b border-white/20 text-gray-300">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-center">Unit Price</th>
                    <th className="p-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-green-400 hover:underline font-medium"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-3 text-center text-gray-200">{item.qty}</td>
                      <td className="p-3 text-center text-gray-200">
                        ₹ {Number(item.price).toFixed(2)}
                      </td>
                      <td className="p-3 text-center text-gray-200">
                        ₹ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-1/3 space-y-6">
        <div className="glass-card text-white p-6 rounded-2xl space-y-3">
          <h2 className="text-xl font-bold border-b border-white/10 pb-3">
            Shipping Information
          </h2>
          <p>
            <strong className="text-green-400">Order ID:</strong> {order._id}
          </p>
          <p>
            <strong className="text-green-400">Name:</strong>{" "}
            {order.user?.username || "N/A"}
          </p>
          <p>
            <strong className="text-green-400">Email:</strong>{" "}
            {order.user?.email || "N/A"}
          </p>
          <p>
            <strong className="text-green-400">Address:</strong>{" "}
            {order.shippingAddress?.address}, {order.shippingAddress?.city}{" "}
            {order.shippingAddress?.postalCode},{" "}
            {order.shippingAddress?.country}
          </p>
          <p>
            <strong className="text-green-400">Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          <div className="pt-2">
            {order.isPaid ? (
              <Message variant="success">
                Paid on {new Date(order.paidAt).toLocaleString()}
              </Message>
            ) : (
              <Message variant="danger">Not paid</Message>
            )}
          </div>

          <div className="pt-1">
            {order.isDelivered ? (
              <Message variant="success">
                Delivered on {new Date(order.deliveredAt).toLocaleString()}
              </Message>
            ) : (
              <Message variant="danger">Not delivered</Message>
            )}
          </div>
        </div>

        <div className="glass-card text-white p-6 rounded-2xl space-y-3">
          <h2 className="text-xl font-bold border-b border-white/10 pb-3">
            Order Summary
          </h2>
          <div className="flex justify-between text-gray-300">
            <span>Items</span>
            <span>₹ {Number(order.itemsPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Shipping</span>
            <span>₹ {Number(order.shippingPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Tax</span>
            <span>₹ {Number(order.taxPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-yellow-300 border-t border-white/10 pt-2">
            <span>Total</span>
            <span>₹ {Number(order.totalPrice).toFixed(2)}</span>
          </div>

          {!order.isPaid && (
            <div className="pt-4">
              {loadingPay && <Loader />}
              {isPending ? (
                <Loader />
              ) : (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              )}
            </div>
          )}

          {loadingDeliver && <Loader />}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <div className="pt-4">
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 transition-all duration-300 text-white w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-green-500/20"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
