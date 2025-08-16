import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import AdminMenu from "./AdminMenu";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [image, setImage] = useState("");
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
      setImage(productData.image || "");
      setStock(productData.countInStock || 0);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully!");
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const response = await updateProduct({ productId: params._id, formData }).unwrap();

      toast.success("Product updated successfully!");
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Product update failed.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await deleteProduct(params._id).unwrap();
      toast.success(`${response?.name} has been deleted.`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error(err?.data?.message || "Product deletion failed.");
    }
  };

  return (
    <div className="min-h-screen  sm:px-6 lg:px-16 text-white">
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
              <div className="flex flex-col items-center">
                {image && (
                  <img
                    src={image}
                    alt="Product"
                    className="rounded-xl w-full max-w-xs h-[280px] object-cover border border-white/10 mb-4"
                  />
                )}
                <label className="bg-gradient-to-r from-pink-600 to-orange-500 hover:from-orange-500 hover:to-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer shadow-md transition-all">
                  {image ? "Change Image" : "Upload Image"}
                  <input type="file" onChange={uploadFileHandler} className="hidden" />
                </label>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {[
                  { label: "Name", value: name, setter: setName },
                  { label: "Price", value: price, setter: setPrice, type: "number" },
                  { label: "Quantity", value: quantity, setter: setQuantity, type: "number" },
                  { label: "Brand", value: brand, setter: setBrand },
                  { label: "Stock Count", value: stock, setter: setStock, type: "number" },
                ].map(({ label, value, setter, type = "text" }) => (
                  <div key={label}>
                    <label className="block mb-1 font-semibold">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block mb-1 font-semibold">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-black/70 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-pink"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>

              {/* Buttons */}
              <div className="flex justify-between mt-10">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-gradient-to-br from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-[0_0_15px_3px_rgba(34,197,94,0.6)] transition-all"
                >
                  Update Product
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-br from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-[0_0_15px_3px_rgba(239,68,68,0.6)] transition-all"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
