import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="w-full lg:w-[75%] mx-auto py-8">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="px-4">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="p-4 flex justify-center">
                <Link to={`/product/${_id}`}>
                  <div
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-5 transition-all duration-300 hover:border-green-400 hover:scale-[1.01] w-full max-w-[1100px]"
                  >
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-[375px] object-cover rounded-xl mb-4 transition-transform duration-300"
                      style={{
                        boxShadow: "0 4px 12px rgba(0,255,155,0.1)",
                      }}
                    />

                    <h2 className="text-lg font-semibold text-white truncate">{name}</h2>
                    <p className="text-green-400 font-medium mt-1">₹ {price}</p>
                    <p className="text-gray-300 text-sm mt-2 truncate">
                      {description.substring(0, 80)}...
                    </p>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm text-gray-200">
                      <div className="flex items-center">
                        <FaStore className="mr-2 text-green-300" /> Brand: {brand}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-yellow-300" />
                        {moment(createdAt).fromNow()}
                      </div>
                      <div className="flex items-center">
                        <FaStar className="mr-2 text-yellow-400" /> Reviews: {numReviews}
                      </div>
                      <div className="flex items-center">
                        <FaStar className="mr-2 text-yellow-400" /> Rating: {Math.round(rating)}
                      </div>
                      <div className="flex items-center">
                        <FaShoppingCart className="mr-2 text-pink-400" /> Qty: {quantity}
                      </div>
                      <div className="flex items-center">
                        <FaBox className="mr-2 text-blue-400" /> In Stock: {countInStock}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;

