import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user } = useAuthStore();
  return (
    <div className="pt-20 h-full flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-sm w-full sm:border-1 sm:rounded-md space-y-4 flex flex-col  justify-center p-8 bg-black/40"
      >
        <div className=" flex flex-col gap-2">
          <h3 className="text-lg text-gray-300 font-semibold">Username :</h3>
          <p className="text-md border border-gray-200 font-semibold text-gray-300 rounded-md px-4 py-2">{user?.name}</p>
        </div>
        <div className=" flex flex-col gap-2">
          <h3 className="text-lg text-gray-300 font-semibold">Email Adress :</h3>
          <p className="text-md border border-gray-200 rounded-md text-gray-300 font-semibold px-4 py-2">{user?.email}</p>
        </div>
      </motion.div>
    </div>
  );
};
export default ProfilePage;
