import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen text-white">
      <AdminMenu />
      <div
        className="w-full max-w-4xl  rounded-2xl bg-gradient-to-br from-purple-600 via-rose-500 to-orange-500 shadow-lg p-[3px] hover:shadow-[0_0_30px_5px_rgba(236,72,153,0.7)] transition-all hover:scale-105"
      >
        <div className="bg-gray-900 rounded-2xl p-8">
          <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
            Create Product
          </h2>
          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[250px] rounded-lg border-4 border-gradient-to-r from-purple-500 to-pink-600 shadow-lg"
              />
            </div>
          )}
          <label className="block w-full text-center border-dashed border-4 border-gray-500 rounded-lg py-12 cursor-pointer bg-gray-800 hover:bg-gray-900 transition">
            <span className="text-gray-300">Upload Image</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
            />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm text-gray-300 mb-2">
                Price
              </label>
              <input
                id="price"
                type="number"
                placeholder="Price"
                className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm text-gray-300 mb-2">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                placeholder="Quantity"
                className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm text-gray-300 mb-2">
                Brand
              </label>
              <input
                id="brand"
                type="text"
                placeholder="Brand"
                className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Description"
                className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                className="w-full p-4 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm text-gray-300 mb-2">
                Stock Count
              </label>
              <input
                id="stock"
                type="number"
                placeholder="Stock Count"
                className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="block mx-auto mt-6 w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-fuchsia-400 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
