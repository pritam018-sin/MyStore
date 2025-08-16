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
    return <h1 className="text-center text-red-500">ERROR</h1>;
  }

  return (
    <div className="container mx-auto p-3">
      {/* Main Wrapper */}
      <div className="flex justify-between gap-4">
        {/* Grid layout for small products, with added flexibility to prevent collapsing */}
        <div className="grid grid-cols-1 gap-4 w-1/2">
          {data.slice(0, 2).map((product) => (
            <SmallProduct key={product._id} product={product} />
          ))}
        </div>

        {/* Product Carousel (Image Slider) */}
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;






