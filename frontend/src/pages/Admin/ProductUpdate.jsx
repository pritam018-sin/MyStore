import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import AdminMenu from "./AdminMenu";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [imageFile, setImageFile] = useState(null); // 🖼️ actual file
  const [preview, setPreview] = useState(null); // preview image
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (productData) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setPreview(productData.image || "");
      setStock(productData.countInStock || 0);
    }
  }, [productData]);

  // 🖼️ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 📦 Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile); // append only if new image
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      await updateProduct({ productId: params._id, formData }).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Product update failed.");
    }
  };

  // 🗑️ Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await deleteProduct(params._id).unwrap();
      toast.success(`${response?.name || "Product"} has been deleted.`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error(err?.data?.message || "Product deletion failed.");
    }
  };

  return (
    <div className="min-h-screen sm:px-6 lg:px-16 text-white">
      <div className="flex flex-col md:flex-row gap-10">
        <AdminMenu />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full"
        >
          <h1 className="text-3xl font-bold text-center mb-8">Update / Delete Product</h1>

          <div className="glass border border-transparent hover:border-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-2xl p-[2px] transition duration-300 ease-in-out">
            <div className="bg-black/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
              
              {/* Image Upload */}
              <div className="flex flex-col items-center mb-6">
                {preview && (
                  <img
                    src={preview}
                    alt="Product"
                    className="rounded-xl w-full max-w-xs h-[280px] object-cover border border-white/10 mb-4"
                  />
                )}
                <label className="bg-gradient-to-r from-pink-600 to-orange-500 hover:from-orange-500 hover:to-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer shadow-md transition-all">
                  {preview ? "Change Image" : "Upload Image"}
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-4 rounded-lg bg-black/20 text-white"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="p-4 rounded-lg bg-black/20 text-white"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="p-4 rounded-lg bg-black/20 text-white"
                />
                <input
                  type="text"
                  placeholder="Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="p-4 rounded-lg bg-black/20 text-white"
                />
                <input
                  type="number"
                  placeholder="Stock Count"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="p-4 rounded-lg bg-black/20 text-white"
                />

                <div className="md:col-span-2">
                  <textarea
                    rows={4}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 rounded-lg bg-black/20 text-white"
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-4 rounded-lg bg-black/20 text-white"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div className="md:col-span-2 flex justify-between mt-6">
                  <button
                    type="submit"
                    className="bg-gradient-to-br from-green-500 to-teal-500 px-6 py-3 rounded-xl font-semibold"
                  >
                    Update Product
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-gradient-to-br from-red-600 to-pink-600 px-6 py-3 rounded-xl font-semibold"
                  >
                    Delete Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
