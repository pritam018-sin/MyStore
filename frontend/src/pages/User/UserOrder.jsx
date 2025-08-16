import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-8 tracking-wide text-center">
        My Orders
      </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
          <table className="min-w-full text-sm text-white">
            <thead>
              <tr className="text-left text-gray-300 border-b border-white/10">
                <th className="px-6 py-4">IMAGE</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">TOTAL</th>
                <th className="px-6 py-4">PAID</th>
                <th className="px-6 py-4">DELIVERED</th>
                <th className="px-6 py-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="transition-all duration-300 hover:bg-white/5 border-b border-white/5"
                >
                  <td className="px-6 py-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-20 h-20 object-cover rounded-lg shadow-md"
                    />
                  </td>

                  <td className="px-6 py-4">{order._id.slice(0, 10)}...</td>
                  <td className="px-6 py-4">{order.createdAt.substring(0, 10)}</td>
                  <td className="px-6 py-4">₹ {order.totalPrice}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isPaid
                          ? "bg-green-500/20 text-green-300 border border-green-400/30"
                          : "bg-red-500/20 text-gray-300 border  border-red-400/30"
                      }`}
                    >
                      {order.isPaid ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isDelivered
                          ? "bg-green-500/20 text-green-300 border border-green-400/30"
                          : "bg-red-500/20 text-red-300 border border-red-400/30"
                      }`}
                    >
                      {order.isDelivered ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Link to={`/order/${order._id}`}>
                      <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500/60 to-fuchsia-500/60 border border-white/10 hover:border-fuchsia-400/40 rounded-lg shadow-md hover:shadow-fuchsia-600 transition-all duration-300 backdrop-blur-lg hover:scale-105">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
