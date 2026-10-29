import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/features/favorites/favoriteSlice";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product?._id);

  const toggleFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    if (isFavorite) {
      dispatch(removeFromFavorites(product));
    } else {
      dispatch(addToFavorites(product));
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer z-20"
      onClick={toggleFavorites}
      role="button"
      tabIndex={0}
      aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isFavorite ? (
        <FaHeart className="text-violet-500 text-xl transition-transform hover:scale-110" />
      ) : (
        <FaRegHeart className="text-white text-xl transition-transform hover:scale-110" />
      )}
    </div>
  );
};

export default HeartIcon;