import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto mt-10 px-4">
      <ProgressSteps step1 step2 />
      <div className="mt-[8rem] flex justify-center items-center">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-xl p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-violet-400 transition-all duration-300 shadow-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-white text-center">Shipping Info</h1>

          {/* Address */}
          <div className="mb-5">
            <label className="block text-gray-300 mb-2">Address</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* City */}
          <div className="mb-5">
            <label className="block text-gray-300 mb-2">City</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Postal Code */}
          <div className="mb-5">
            <label className="block text-gray-300 mb-2">Postal Code</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          {/* Country */}
          <div className="mb-5">
            <label className="block text-gray-300 mb-2">Country</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Payment */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Select Payment Method</label>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                className="accent-fuchsia-500"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="text-white">PayPal or Credit Card</span>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 font-medium text-white rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg hover:shadow-violet-400 transition-all hover:scale-105"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
