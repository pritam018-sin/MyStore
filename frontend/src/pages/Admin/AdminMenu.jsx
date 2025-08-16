import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`fixed ${isMenuOpen ? "top-6 right-6" : "top-6 right-6"
          } z-50 p-3 rounded-2xl bg-black/5 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 
hover:shadow-2xl hover:ring-2 hover:ring-white/20 hover:bg-white/10 hover:scale-105`}


      >
        {isMenuOpen ? (
          <FaTimes className="text-white w-5 h-5" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-white my-1"></div>
            <div className="w-6 h-0.5 bg-white my-1"></div>
            <div className="w-6 h-0.5 bg-white my-1"></div>
          </>
        )}
      </button>

      {/* Menu Panel */}
      {isMenuOpen && (
        <div className="fixed top-6 right-6 z-40 rounded-2xl shadow-2xl p-6 backdrop-blur-lg bg-white/10 border border-white/20">
          <ul className="space-y-4">
            {[
              { to: "/admin/dashboard", label: "Admin Dashboard" },
              { to: "/admin/categorylist", label: "Create Category" },
              { to: "/admin/productlist", label: "Create Product" },
              { to: "/admin/allproductslist", label: "All Products" },
              { to: "/admin/userlist", label: "Manage Users" },
              { to: "/admin/orderlist", label: "Manage Orders" },
            ].map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 block rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 overflow-hidden
                    ${isActive
                      ? "text-green-300 bg-white/10"
                      : "text-white hover:text-yellow-200"
                    }`
                  }
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute inset-0 z-0 opacity-0 hover:opacity-20 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 rounded-lg transition-opacity duration-300"></span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AdminMenu;

