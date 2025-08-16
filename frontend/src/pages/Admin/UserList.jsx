import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-black to-purple-900 min-h-screen shadow-glow text-white flex">
      {/* Left Side Purple Card with Animation and Gradient */}
      <AdminMenu />
      <div className="w-1/4 p-4 rounded-md bg-gradient-to-r from-purple-600 via-red-500 to-purple-800 transform hover:scale-105 transition-all duration-500 ease-in-out shadow-lg animate-pulse">
        <div className="text-white mb-4">
          <h2 className="text-xl font-semibold">User Information</h2>
          <p className="mt-2">Details about users will be displayed here.</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-4">
        <h1 className="text-3xl font-semibold mb-6">Users</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="w-full max-w-[115%] mx-auto table-auto">
              <thead className="bg-gradient-to-r from-purple-600 via-red-500 to-purple-800 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:via-red-600 hover:to-purple-900 transition-all duration-300">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Admin</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-100 hover:ring-4 hover:ring-purple-500 hover:scale-105 transition-all duration-300"
                  >
                    <td className="px-4 py-2 text-blue-500 font-semibold hover:text-purple-700">
                      {user._id}
                    </td>
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 hover:ring-4 hover:ring-blue-500 transition-all duration-300"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-black">{user.username}</span>{" "}
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            className="ml-2 text-purple-600 hover:text-purple-800 hover:ring-4 hover:ring-purple-500 transition-all duration-300"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 hover:ring-4 hover:ring-blue-500 transition-all duration-300"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <a
                            href={`mailto:${user.email}`}
                            className="text-purple-600 hover:text-purple-800 hover:ring-4 hover:ring-purple-500 transition-all duration-300"
                          >
                            {user.email}
                          </a>{" "}
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            className="ml-2 text-purple-600 hover:text-purple-800 hover:ring-4 hover:ring-purple-500 transition-all duration-300"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {!user.isAdmin && (
                        <div className="flex">
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg hover:ring-4 hover:ring-red-500 transition-all duration-300"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;

