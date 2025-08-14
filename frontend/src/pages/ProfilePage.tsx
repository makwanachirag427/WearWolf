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
        className="max-w-md w-full sm:border-2 sm:rounded-lg space-y-4 flex flex-col  justify-center sm:py-15 sm:px-8 p-8"
      >
        <div className=" flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Username :</h3>
          <p className="text-lg border-2 rounded-lg px-4 py-2 font-semibold">{user?.name}</p>
        </div>
        <div className=" flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Email Adress :</h3>
          <p className="text-lg border-2 rounded-lg px-4 py-2 font-semibold">{user?.email}</p>
        </div>
      </motion.div>
    </div>
  );
};
export default ProfilePage;
