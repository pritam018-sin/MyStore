import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import VanillaTilt from "vanilla-tilt";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const cardRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }

    if (cardRef.current) {
      VanillaTilt.init(cardRef.current, {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02,
      });
    }

    if (tableRef.current) {
      VanillaTilt.init(tableRef.current, {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02,
      });
    }
  }, [cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-20 p-6">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div
            ref={tableRef}
            className="overflow-x-auto mb-10 p-6 rounded-2xl bg-black/30 backdrop-blur-md border border-transparent group hover:border-green-400/40 transition-all duration-500 shadow-xl hover:shadow-green-500/10 hover:scale-[1.015]"
          >
            <table className="w-full border-collapse text-white">
              <thead>
                <tr className="bg-gradient-to-r from-violet-800 to-pink-700 text-white">
                  <th className="text-left px-4 py-3">Image</th>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Quantity</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/product/${item.product}`}
                        className="hover:underline text-blue-200"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-200">{item.qty}</td>
                    <td className="p-4 text-gray-200">₹ {item.price.toFixed(2)}</td>
                    <td className="p-4 text-gray-200">₹ {(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div
          ref={cardRef}
          className="p-8 rounded-2xl bg-black/30 backdrop-blur-md text-white border border-transparent hover:border-green-400/40 hover:shadow-green-500/10 transition-all duration-500 shadow-2xl hover:scale-[1.015]"
        >
          <h2 className="text-3xl font-bold mb-6">Order Summary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-lg">
              <li>
                <span className="font-semibold">Items:</span> ₹ {cart.itemsPrice}
              </li>
              <li>
                <span className="font-semibold">Shipping:</span> ₹ {cart.shippingPrice}
              </li>
              <li>
                <span className="font-semibold">Tax:</span> ₹ {cart.taxPrice}
              </li>
              <li>
                <span className="font-semibold text-xl">Total:</span>{" "}
                <span className="text-xl font-bold text-yellow-300">
                  ₹ {cart.totalPrice}
                </span>
              </li>
            </ul>

            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
                <p>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                  {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
                <p>{cart.paymentMethod}</p>
              </div>

              {error && (
                <Message variant="danger">
                  {error?.data?.message || "Order failed"}
                </Message>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0}
            className="mt-8 w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-400/20 via-green-500/30 to-green-600/40 hover:bg-green-500/20 border border-white/10 hover:border-green-300 rounded-lg hover:shadow-md hover:shadow-green-500/30 transition-all"
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;

