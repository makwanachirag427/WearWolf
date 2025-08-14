import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  UserPlus,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

const LogInPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { loading, login } = useAuthStore();

  const validateForm = () => {
    if (!email.trim()) return toast.error("Email address is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Please enter valid email address");
    if (!password.trim()) return toast.error("Password is required.");

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      login(email, password);
    }
  };

  return (
    <div className="h-full w-full pt-20 flex flex-col justify-center items-center overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="font-bold text-3xl "
      >
        Log in to Your Account
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col justify-center items-center   w-full max-w-md mx-auto p-8"
      >
        <form
          onSubmit={handleSubmit}
          className="h-full w-full space-y-5 sm:px-8 sm:py-15 rounded-lg sm:border"
        >
          <label className="display flex  items-center border-1 px-4 py-2 rounded-lg  gap-3 w-full focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 focus-within:ring-offset-red-950 text-gray-100">
            <Mail className="size-5" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Email"
              className="outline-none  placeholder:text-gray-300"
            />
          </label>
          <label className="display flex  items-center border-1 px-4 py-2 rounded-lg  gap-3 w-full focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 focus-within:ring-offset-red-950 text-gray-100">
            <Lock className="size-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              autoComplete="new-password"
              placeholder="Password"
              className="outline-none flex-1 placeholder:text-gray-300"
            />
            {showPassword ? (
              <Eye
                className="text-gray-200 size-5"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOff
                className="text-gray-200 size-5"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </label>

          <button
            type="submit"
            className="flex justify-center items-center gap-2 font-semibold  py-2 px-4 w-full rounded-lg bg-red-600 cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="size-5 animate-spin" strokeWidth={"3px"} />
                Loading...
              </>
            ) : (
              <>
                <UserPlus className="size-5" strokeWidth={"2.5px"} /> Log In
              </>
            )}
          </button>
        </form>
        <p className="mt-5 w-full flex justify-center items-center text-gray-400">
          Not a member?
          <Link
            to={"/signup"}
            className="ml-2 text-red-500 font-semibold flex justify-center items-center hover:underline"
          >
            Sign up now
            <ArrowRight className="size-5" />
          </Link>{" "}
        </p>
      </motion.div>
    </div>
  );
};
export default LogInPage;
