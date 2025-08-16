const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-purple-600 via-rose-500 to-orange-500 rounded-2xl shadow-lg p-[3px] flex flex-col gap-4"
      >
        <div className="bg-gray-800 text-white p-6 rounded-2xl">
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:ring-2 hover:ring-purple-400"
            placeholder="Write category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg shadow-lg hover:shadow-fuchsia-400 transition-all duration-300 hover:scale-105"
            >
              {buttonText}
            </button>

            {handleDelete && (
              <button
                onClick={handleDelete}
                className="w-full py-2 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-pink-400 transition-all duration-300 hover:scale-105"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
