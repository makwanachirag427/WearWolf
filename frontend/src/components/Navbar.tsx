import { Link } from "react-router-dom";
import {
  CircleUser,
  Lock,
  LogIn,
  LogOut,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";

  

  return (
    <header className="fixed top-0 left-0 w-full border-b-1 border-gray-700 p-3 z-20 bg-neutral-900">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex justify-between items-center max-w-7xl mx-auto z-50"
      >
        <Link
          to={"/"}
          className=" text-xl sm:text-3xl font-semibold  hover:opacity-90 transition-all duration-300 ease-in-out "
        >
          WearWolf
        </Link>

        <div className="flex  gap-2.5 sm:gap-4 items-center">
          <Link
            to={"/"}
            className="hover:underline font-semibold hover:text-red-500 transition-all duration-300"
          >
            Home
          </Link>
          { user ?  (
            <>
              <Link
                to={"/cart"}
                className="flex gap-1 items-center  relative font-semibold hover:text-red-500 transition-all duration-300"
              >
                <ShoppingCart className="size-5" />
                <span className="hidden sm:flex">Cart</span>
                {/* <span className="absolute  -top-2.5 -left-2 bg-red-500 size-5.5 rounded-full flex justify-center items-center  text-sm font-semibold text-white">2</span> */}
              </Link>
              {isAdmin && (
                <Link
                  to={"/admin-dashboard"}
                  className="flex items-center gap-2  p-2 sm:px-4 sm:py-1 
             font-bold text-white bg-red-600 
             rounded-lg  transition-all duration-300 ease-in-out
             hover:bg-red-700"
                >
                  <Lock className="size-4" strokeWidth={"2.5px"} />
                  <span className="hidden sm:flex">Dashboard</span>
                </Link>
              )}
              <button
                className="flex items-center gap-2 p-2 sm:px-4 sm:py-1.5 
             font-semibold text-black bg-slate-50 
             rounded-lg  transition-all duration-300 ease-in-out
             hover:bg-gray-200"
                onClick={logout}
              >
                <LogOut className="size-4 sm:size-5" strokeWidth={"1.8px"} />
                <span className="hidden sm:flex">Log Out</span>
              </button>
              <Link to={"/profile"}>
                <CircleUser className="size-7 hover:text-red-500 transition-all duration-300 ease-in-out" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to={"/signup"}
                className="flex items-center gap-2  p-2 sm:px-4 sm:py-1.5 
             font-semibold text-white bg-red-600 
             rounded-lg  transition-all duration-300 ease-in-out
             hover:bg-red-700"
              >
                <UserPlus className="size-5" strokeWidth={"2.5px"} />
                <span className="hidden sm:flex">Sign Up</span>
              </Link>
              <Link
                to={"/login"}
                className="flex items-center gap-2 p-2 sm:px-4 sm:py-1.5
             font-semibold text-black bg-white 
             rounded-lg  transition-all duration-300 ease-in-out
             hover:bg-gray-200"
              >
                <LogIn className="size-5" strokeWidth={"1.8px"} />
                <span className="hidden sm:flex">Log In</span>
              </Link>
            </>
          )}
        </div>
      </motion.nav>
    </header>
  );
};
export default Navbar;
