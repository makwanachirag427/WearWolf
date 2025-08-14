import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import LogInPage from "./pages/LogInPage";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="app-bg h-screen bg-neutral-950">
        <div className="h-full w-full flex justify-center items-center">
          <Loader className="size-12  text-slate-200 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  app-bg text-white flex">
      <Navbar />
      <main className="flex-1 w-full min-h-full">
        <Routes>
          <Route path={"/"} element={<HomePage />} />
          <Route
            path={"/signup"}
            element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path={"/login"}
            element={!user ? <LogInPage /> : <Navigate to={"/"} />}
          />
          <Route
            path={"/admin-dashboard"}
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to={"/"} />
            }
          />
          <Route
            path={"/profile"}
            element={user ? <ProfilePage /> : <Navigate to={"/"} />}
          />
        </Routes>
      </main>

      <ToastContainer autoClose={1500} position="top-center" />
    </div>
  );
};
export default App;
