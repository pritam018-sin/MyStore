import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleOrders = () => {
    window.location.href = "/user-orders";
  };

  return (
    <section className="min-h-screen flex items-center justify-center text-white p-4">
      <div className="w-full max-w-5xl bg-[#1a1a2e] rounded-2xl p-8 shadow-2xl border border-purple-700">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Form Section */}
          <div className="w-full md:w-2/3">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500 mb-6">
              Update Profile
            </h2>
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Username</label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-3 bg-[#222244] rounded-lg text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full px-4 py-3 bg-[#222244] rounded-lg text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full px-4 py-3 bg-[#222244] rounded-lg text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  className="mt-1 w-full px-4 py-3 bg-[#222244] rounded-lg text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-pink-500/30"
                disabled={loadingUpdateProfile}
              >
                {loadingUpdateProfile ? "Updating..." : "Update Profile"}
              </button>
              {loadingUpdateProfile && <Loader />}
            </form>
          </div>

          {/* Orders Button */}
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <button
              onClick={handleOrders}
              className="w-full py-5 px-6 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/40"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
