import {
  BarChart,
  PlusCircle,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import CreateProductForm from "../components/CreateProductForm";
import ProductList from "../components/ProductList";
import AnalyticsTab from "../components/AnalyticsTab";
import { useState } from "react";

const tabs: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<string>("create");
  

  return (
    <div className="pt-20 h-full w-full">
      <div className="pt-8 h-full flex flex-col gap-8  items-center">
        <motion.h1
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-bold text-4xl"
        >
          Admin Dashboard
        </motion.h1>
        <div className="flex justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex  items-center gap-1 sm:gap-5  px-2 py-1.5 sm:px-5 sm:py-2 
             font-semibold text-white text-sm sm:text-lg
             rounded-md  transition-all duration-300 ease-in-out ${
               activeTab === tab.id
                 ? "bg-red-600 hover:bg-red-700"
                 : "bg-gray-600 hover:bg-gray-700"
             }
             `}
            >
              <tab.icon className="size-4 sm:size-5" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductList />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
};
export default AdminPage;
