import { Link } from "react-router-dom";
import moment from "moment";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  return (
    <div className="group relative w-[22rem] h-[26rem] mx-auto rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
      {/* 🔥 Hover glow effect like CodeHelp */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl border border-transparent group-hover:border-fuchsia-500 group-hover:shadow-[0_0_20px_5px_rgba(232,121,249,0.3)] z-10 pointer-events-none"></div>

      {/* 🟣 Gradient-glow backdrop on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-[#33124d] via-[#1a0636] to-transparent z-0 blur-lg rounded-xl"></div>

      {/* 🧊 Actual content */}
      <div className="relative z-20 flex flex-col h-full p-4 bg-transparent">
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-40 object-cover rounded-md mb-3 border-2 border-gray-800 group-hover:scale-105 transition-transform"
        />
        <HeartIcon product={p} />

        <div className="flex justify-between items-center mb-2">
          <h5 className="text-sm font-semibold text-white truncate">
            {p.name}
          </h5>
          <p className="text-gray-400 text-xs">
            {moment(p.createdAt).format("MMM Do, YYYY")}
          </p>
        </div>

        <p className="text-gray-400 text-xs mb-3">
          {p.description?.substring(0, 80)}...
        </p>

        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-md shadow-md hover:scale-105 hover:shadow-violet-400 transition-all"
          >
            View Product
            <svg
              className="w-3.5 h-3.5 ml-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <p className="text-md font-bold text-white">₹ {p.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;