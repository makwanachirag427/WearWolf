import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, Suspense, lazy } from "react";
import LoaderScreen from "./components/LoaderScreen";
import { useCartStore } from "./store/useCartStore";

//using lazy loading using suspense and lazy

const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LogInPage = lazy(() => import("./pages/LogInPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const PurchaseSuccessPage = lazy(() => import("./pages/PurchaseSuccessPage"));
const PurchaseCancelPage = lazy(() => import("./pages/PurchaseCancelPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));

const App = () => {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [user, getCartItems]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoaderScreen />;
  }

  return (
    <div className="min-h-screen  app-bg text-white flex">
      <Navbar />
      <main className="flex-1 w-full min-h-full bg-black/50">
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
            <Route
              path={"/purchase-cancel"}
              element={
                user ? <PurchaseCancelPage /> : <Navigate to={"/login"} />
              }
            />
            <Route
              path={"/purchase-success"}
              element={
                user ? <PurchaseSuccessPage /> : <Navigate to={"/login"} />
              }
            />
            <Route
              path={"/cart"}
              element={user ? <CartPage /> : <Navigate to={"/login"} />}
            />
            <Route path={"/product/:product_id"} element={<ProductPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <ToastContainer autoClose={1500} position="top-center" />
    </div>
  );
};
export default App;
