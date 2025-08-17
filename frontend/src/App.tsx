import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, Suspense, lazy } from "react";
import LoaderScreen from "./components/LoaderScreen";

//using lazy loading using suspense and lazy

const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LogInPage = lazy(() => import("./pages/LogInPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const App = () => {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoaderScreen />;
  }

  return (
    <div className="min-h-screen  app-bg text-white flex">
      <Navbar />
      <main className="flex-1 w-full min-h-full">
        <Suspense fallback={<LoaderScreen />}>
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
        </Suspense>
      </main>

      <ToastContainer autoClose={1500} position="top-center" />
    </div>
  );
};
export default App;
