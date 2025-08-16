import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="relative w-[16rem] min-h-[300px] mx-2 my-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg transition-all duration-300 hover:border-green-400 hover:scale-[1.02] group">
      <div className="relative w-full h-[200px] overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <HeartIcon product={product} />
      </div>

      <div className="w-full mt-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-left text-sm font-semibold text-white truncate">
              {product.name}
            </div>
            <span className="bg-gradient-to-r from-green-400 to-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              ₹{product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;


