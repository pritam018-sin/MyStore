import { Link } from "react-router-dom";
import moment from "moment";
import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tiltRef.current, {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      scale: 1.02,
    });
  }, []);

  return (
    <div
      ref={tiltRef}
      className="rounded-2xl bg-black/40 backdrop-blur-sm transition-all duration-500 p-6 w-full lg:w-[24rem] group border border-transparent hover:border-green-400/40 "
    >
      {/* Heart Icon */}
      <HeartIcon product={product} />

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-52 object-cover rounded-xl mb-5 transition-transform duration-300 group-hover:scale-105"
      />

      <div className="flex justify-between items-center mb-3">
        <h5 className="text-white text-xl font-semibold tracking-wide">
          {product.name}
        </h5>
        <p className="text-sm text-gray-300">
          {moment(product.createdAt).format("MMM D, YYYY")}
        </p>
      </div>

      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
        {product.description?.substring(0, 100)}...
      </p>

      <div className="flex justify-between items-center mt-4">
        <Link
          to={`/product/${product._id}`}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-green-500/10 border border-white/20 hover:border-green-400/50 rounded-full backdrop-blur-md transition-all duration-300"
        >
          View Product
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>

        <p className="text-lg font-bold text-white tracking-wide">
          ₹ {product.price}
        </p>
      </div>
    </div>
  );
};

export default Product;
