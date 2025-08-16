import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-white font-semibold hover:underline ml-40"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row items-start mt-10 ml-40 mb-10">
          {/* Product Image with Glow Hover */}
          <div className="md:w-1/2 w-full relative group">
            <div className="relative overflow-hidden rounded-xl transition-all">
              <img
                src={product.image}
                alt={product.name}
                className="w-[620px] h-[620px] object-cover rounded-xl border-2 border-neutral-800 group-hover:shadow-[0_0_60px_rgba(236,72,153,0.5)] transition-all duration-500 ease-in-out"
              />
              <div className="absolute top-2 right-2">
                <HeartIcon product={product} />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 w-full px-8">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 mb-2">
              {product.name}
            </h2>
            <p className="text-base text-gray-400 mb-4 leading-relaxed">
              {product.description}
            </p>

            <p className="text-4xl font-bold text-white mb-6">
              ₹ {product.price}
            </p>

            <div className="grid gap-2 mb-6 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <FaStore className="text-white" /> Brand: {product.brand}
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-white" />
                Added: {moment(product.createdAt).fromNow()}
              </p>
              <p className="flex items-center gap-2">
                <FaStar className="text-white" /> Reviews:{" "}
                {product.numReviews}
              </p>
              <p className="flex items-center gap-2">
                <FaStar className="text-white" /> Ratings: {product.rating}
              </p>
              <p className="flex items-center gap-2">
                <FaShoppingCart className="text-white" /> Quantity:{" "}
                {product.quantity}
              </p>
              <p className="flex items-center gap-2">
                <FaBox className="text-white" /> In Stock:{" "}
                {product.countInStock}
              </p>
            </div>

            <Ratings
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />

            {product.countInStock > 0 && (
              <div className="my-4">
                <select
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white text-black font-semibold"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full flex justify-center items-center bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(236,72,153,0.7)]"
            >
              <FaShoppingCart className="mr-2" /> Add To Cart
            </button>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      {!isLoading && product && (
        <div className="mt-12 ml-40">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
          />
        </div>
      )}
    </>
  );
};

export default ProductDetails;
