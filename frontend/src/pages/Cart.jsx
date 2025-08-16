import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {cartItems.length === 0 ? (
        <div className="text-center text-white text-lg">
          Your cart is empty{' '}
          <Link to="/shop" className="text-pink-500 hover:underline">
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-white mb-6">
              Shopping Cart
            </h1>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center backdrop-blur-lg bg-white/5 hover:bg-gradient-to-br from-violet-600/10 to-pink-600/10 hover:border hover:border-violet-500/50 rounded-xl shadow-md p-4 transition-all duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl shadow"
                  />
                  <div className="ml-4 flex-1">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold text-white hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="text-gray-400">{item.brand}</div>
                    <div className="text-fuchsia-400 font-semibold">
                      ₹ {item.price}
                    </div>
                  </div>
                  <select
                    className="w-20 p-2 rounded-md text-black"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="text-red-500 ml-4 hover:text-red-700 transition"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Card */}
          <div className="w-full lg:w-[28rem]">
            <div className="backdrop-blur-lg bg-white/5 hover:bg-gradient-to-br from-violet-600/10 to-pink-600/10 hover:border hover:border-violet-500/50 text-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              <div className="flex justify-between text-lg mb-2">
                <span>Items:</span>
                <span>
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total:</span>
                <span>
                  ₹{' '}
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              <button
                className="w-full bg-white text-violet-700 hover:bg-fuchsia-500 hover:text-white transition font-semibold py-3 rounded-xl shadow-md hover:shadow-fuchsia-400"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
