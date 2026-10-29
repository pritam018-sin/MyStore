import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct) || [];

  return (
    <div className="min-h-screen px-4 md:px-10 lg:px-20 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8 text-center tracking-wide">
        Favorite Products
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-400 text-lg mt-16">
          <p className="mb-4">You haven&apos;t added any products to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
