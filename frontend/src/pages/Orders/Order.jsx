import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
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
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
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
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container flex flex-col ml-[3.5rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="mt-5 pb-4 mb-5 glass-card">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[90%] m-auto">
                <thead className="border-b-2 border-white/30 text-white">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                    {/* <th className="p-2">Details</th> */}
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-white/10 border border-green-500/30 transition-all duration-300 ease-in-out rounded-lg cursor-pointer backdrop-blur-md"
                    >
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`} className="text-green-400 hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-2 text-center text-white">{item.qty}</td>
                      <td className="p-2 text-center text-white">₹ {item.price}</td>
                      <td className="p-2 text-center text-white">
                        ₹ {(item.qty * item.price).toFixed(2)}
                      </td>
                      {/* <td className="p-2 text-sm text-white">
                        <div><strong>Brand:</strong> {item.brand}</div>
                        <div><strong>Category:</strong> {item.category}</div>
                        <div><strong>Description:</strong> {item.description}</div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 mb-4 glass-card text-white p-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-green-400">Order:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-green-400">Name:</strong> {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-green-400">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-green-400">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-green-400">Method:</strong> {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Messsage variant="success">Paid on {order.paidAt}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid</Messsage>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem] text-white">Order Summary</h2>
        <div className="glass-card text-white p-4 space-y-2">
          <div className="flex justify-between">
            <span>Items</span>
            <span>₹ {order.itemsPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹ {order.shippingPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹ {order.taxPrice}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹ {order.totalPrice}</span>
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
                className="bg-green-600 hover:bg-green-700 transition-all duration-300 text-white w-full py-2 rounded-xl"
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
