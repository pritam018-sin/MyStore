import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import { FaShoppingCart } from "react-icons/fa"; // Importing the shop icon

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword && <Header />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Title & Shop Button */}
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-8 px-3">
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-orange-400 rounded-lg shadow-md hover:scale-105 hover:shadow-violet-400 transition-all mt-4 md:mt-0"
            >
              <FaShoppingCart className="mr-2" /> Shop
            </Link>
          </div>

          {/* Product Listing */}
          <div className="container mx-auto mt-6 px-4">
            <div className="grid grid-cols- sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.products?.length > 0 ? (
                data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))
              ) : (
                <p className="text-center text-gray-500">No products available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;



