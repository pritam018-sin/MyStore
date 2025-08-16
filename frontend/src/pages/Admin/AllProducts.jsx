import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { useEffect, useRef } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e, index) => {
      const card = cardRefs.current[index];
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    };

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      card.addEventListener("mousemove", (e) => handleMouseMove(e, index));
    });

    return () => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        card.removeEventListener("mousemove", (e) =>
          handleMouseMove(e, index)
        );
      });
    };
  }, [products]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto px-6 py-6 flex flex-col items-center">
      <div className="text-center text-4xl font-bold text-white mb-10">
        All Products ({products.length})
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {products.map((product, index) => (
          <Link
            key={product._id}
            to={`/admin/product/update/${product._id}`}
            ref={(el) => (cardRefs.current[index] = el)}
            className="group relative w-[24rem] rounded-xl p-[2px] bg-black/10 backdrop-blur-xl transition-all duration-500 shadow-2xl"
            style={{
              background: `
                radial-gradient(
                  600px circle at var(--x, 50%) var(--y, 50%),
                  rgba(255, 255, 255, 0.1),
                  transparent 80%
                )
              `,
            }}
          >
            <div className="relative bg-black/40 rounded-xl p-6 flex flex-col h-full overflow-hidden z-10">
              <div className="relative z-10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 border border-transparent group-hover:border-fuchsia-500 transition-all duration-300"
                />

                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-lg font-semibold text-white">
                    {product.name}
                  </h5>
                  <p className="text-sm text-gray-300">
                    {moment(product.createdAt).format("MMMM Do YYYY")}
                  </p>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {product.description?.substring(0, 100)}...
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <Link
                    to={`/admin/product/update/${product._id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg shadow-md hover:scale-105 transition-transform"
                  >
                    Update Product
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 14 10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </Link>

                  <p className="text-lg font-bold text-white">
                    ₹ {product.price}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full mt-10">
        <AdminMenu />
      </div>
    </div>
  );
};

export default AllProducts;
