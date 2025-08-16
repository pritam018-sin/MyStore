import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="absolute left-2 top-8">
      {favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg shadow-md hover:scale-105 hover:shadow-violet-400 transition-all">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;