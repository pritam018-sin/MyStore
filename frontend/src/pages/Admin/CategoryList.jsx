import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="ml-[6rem] flex flex-col md:flex-row p-6">
      <AdminMenu />
      <div className="md:w-full p-3">
        <div className="text-4xl font-bold mb-6 text-white text-center">Manage Categories</div>

        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {categories?.map((category) => (
            <div
              key={category._id}
              className={`
                bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl transition-all duration-300 
                hover:border-green-400 hover:shadow-2xl cursor-pointer
                ${selectedCategory?._id === category._id ? 'border-green-500' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setModalVisible(true);
                setUpdatingName(category.name);
              }}
            >
              <div className="text-center text-white font-semibold text-lg">
                {category.name}
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  className="bg-white text-green-600 py-2 px-4 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                  onClick={() => {
                    setSelectedCategory(category);
                    setModalVisible(true);
                    setUpdatingName(category.name);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-white text-red-600 py-2 px-4 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                  onClick={() => {
                    setSelectedCategory(category);
                    handleDeleteCategory();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;