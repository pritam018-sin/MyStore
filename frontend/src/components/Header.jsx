import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Main Wrapper */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        {/* Grid layout for small products */}
        <div className="hidden xl:grid grid-cols-1 md:grid-cols-2 gap-4 w-full xl:w-1/2">
          {data?.slice(0, 2).map((product) => (
            <SmallProduct key={product._id} product={product} />
          ))}
        </div>

        {/* Product Carousel (Image Slider) */}
        <div className="w-full xl:w-1/2">
          <ProductCarousel />
        </div>
      </div>
    </div>
  );
};

export default Header;






