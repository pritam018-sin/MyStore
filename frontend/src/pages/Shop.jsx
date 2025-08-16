import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { FaFilter } from "react-icons/fa";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showFilter, setShowFilter] = useState(false); // 🔄 Toggle filter panel

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter((product) =>
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null);
      dispatch(setProducts(filteredProductsQuery.data));
    } else {
      setSelectedBrand(brand);
      const productsByBrand = filteredProductsQuery.data?.filter((product) => product.brand === brand);
      dispatch(setProducts(productsByBrand));
    }
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="relative ml-16 p-6 min-h-screen text-white">
      {/* Toggle Filter Button */}
      <button
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg fixed top-7 right-16 z-50"
        onClick={() => setShowFilter((prev) => !prev)}
      >
        <FaFilter /> Filters
      </button>

      {/* Sidebar Filter Panel */}
      {showFilter && (
        <div className="w-72 float-left top-6 left-16 z-40 bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-lg font-bold text-center py-2 border border-white/10 mb-4 rounded-lg">
            Filter by Categories
          </h2>
          <div className="space-y-2">
            {categories?.map((c) => (
              <label key={c._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked.includes(c._id)}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="accent-purple-500 w-4 h-4"
                />
                <span className="text-sm">{c.name}</span>
              </label>
            ))}
          </div>

          <h2 className="text-lg font-bold text-center py-2 border border-white/10 mb-4 mt-6 rounded-lg">
            Filter by Brands
          </h2>
          <div className="space-y-2">
            {uniqueBrands?.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === brand}
                  onChange={() => handleBrandClick(brand)}
                  className="accent-red-500 w-4 h-4"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>

          <h2 className="text-lg font-bold text-center py-2 border border-white/10 mb-4 mt-6 rounded-lg">
            Filter by Price
          </h2>
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full p-2 rounded-lg text-black focus:ring-2 focus:ring-pink-400"
          />

          <button
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition duration-300"
            onClick={() => window.location.reload()}
          >
            Reset
          </button>
        </div>
      )}

      {/* Product Listing */}
      <div className={`transition-all duration-300 ${showFilter ? "ml-[20rem]" : "ml-0"}`}>
        <h2 className="text-3xl font-bold mb-6 underline underline-offset-4 decoration-purple-500">
          {products?.length} Products Found
        </h2>
        <div className="flex flex-wrap gap-6">
          {products.length === 0 ? (
            <Loader />
          ) : (
            products?.map((p) => (
              <div key={p._id} className="transition-transform duration-300 hover:scale-105">
                <ProductCard p={p} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
