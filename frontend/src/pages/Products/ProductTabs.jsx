import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Tabs */}
      <section className="mr-[3rem] space-y-2">
        <div
          className={`cursor-pointer text-lg ${
            activeTab === 1 ? "font-bold text-violet-500" : "text-gray-400"
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </div>
        <div
          className={`cursor-pointer text-lg ${
            activeTab === 2 ? "font-bold text-violet-500" : "text-gray-400"
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={`cursor-pointer text-lg ${
            activeTab === 3 ? "font-bold text-violet-500" : "text-gray-400"
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

      {/* Right Content */}
      <section className="flex-1">
        {/* Tab 1 - Write Review */}
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2">
                  <label htmlFor="rating" className="block text-xl mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div className="my-2">
                  <label htmlFor="comment" className="block text-xl mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-2 mt-4 rounded-lg shadow-lg hover:shadow-violet-300 transition-all"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please <Link to="/login" className="underline">sign in</Link> to write a review
              </p>
            )}
          </div>
        )}

        {/* Tab 2 - All Reviews */}
        {activeTab === 2 && (
          <div className="mt-4">
            {product.reviews.length === 0 && <p>No Reviews</p>}
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#1A1A1A] text-white p-4 rounded-xl mb-4 shadow-md"
              >
                <div className="flex justify-between">
                  <strong className="text-[#B0B0B0]">{review.name}</strong>
                  <span className="text-[#B0B0B0]">
                    {review.createdAt.substring(0, 10)}
                  </span>
                </div>
                <p className="mt-2 mb-3">{review.comment}</p>
                <Ratings value={review.rating} />
              </div>
            ))}
          </div>
        )}

        {/* Tab 3 - Related Products */}
        {activeTab === 3 && (
          <div className="flex flex-wrap gap-6 mt-4">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
