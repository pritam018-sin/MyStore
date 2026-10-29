import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text = "", color = "yellow-400" }) => {
  const numericValue = Math.min(5, Math.max(0, Number(value) || 0));
  const fullStars = Math.floor(numericValue);
  const halfStars = numericValue - fullStars >= 0.5 ? 1 : 0;
  const emptyStar = Math.max(0, 5 - fullStars - halfStars);

  const starColorClass = color === "yellow-500" || color === "yellow-400" ? "text-yellow-400" : `text-${color}`;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className={`${starColorClass} ml-1`} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt className={`${starColorClass} ml-1`} />}

      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className={`${starColorClass} ml-1`} />
      ))}

      {text && (
        <span className="rating-text ml-2 text-sm text-gray-300">
          {text}
        </span>
      )}
    </div>
  );
};

export default Ratings;