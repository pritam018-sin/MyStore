import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // 🖼️ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // preview image
    }
  };

  // 📦 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const { data } = await createProduct(formData);

      if (data?.error) {
        toast.error(data.error || "Product create failed");
      } else {
        toast.success(`${data?.name || "Product"} created successfully`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen text-white">
      <AdminMenu />
      <div className="w-full max-w-4xl rounded-2xl bg-gradient-to-br from-purple-600 via-rose-500 to-orange-500 p-[3px] shadow-lg">
        <div className="bg-gray-900 rounded-2xl p-8">
          <h2 className="text-center text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Create Product
          </h2>

          {preview && (
            <div className="text-center mb-4">
              <img
                src={preview}
                alt="preview"
                className="block mx-auto max-h-[250px] rounded-lg border-4 border-gradient-to-r from-purple-500 to-pink-600 shadow-lg"
              />
            </div>
          )}

          <label className="block w-full text-center border-dashed border-4 border-gray-500 rounded-lg py-12 cursor-pointer bg-gray-800 hover:bg-gray-900 transition">
            <span className="text-gray-300">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Name"
              className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Brand"
              className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="col-span-2 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="p-4 rounded-lg bg-gray-700 text-white"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose Category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock Count"
              className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <button
              type="submit"
              className="col-span-2 mt-6 w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
