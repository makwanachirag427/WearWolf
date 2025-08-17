import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import SpotlightCard from "../components/SpotlightCard/SpotlightCard";
import type { ProductFiltersType } from "../types";
import ProductFilters from "../components/ProductFilters";

const HomePage = () => {
  const [filters, setFilters] = useState<ProductFiltersType>({
    category: undefined,
    min: 0,
    max: 5000,
    sort: undefined,
    featured: false,
  });
  const { products, loading, currentPage, totalPages, getProducts } =
    useProductStore();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [page,setPage]  = useState<number>(currentPage);

  useEffect(() => {
    getProducts({
      category: filters.category,
      min: filters.min,
      max: filters.max,
      sort: filters.sort,
      featured: filters.featured,
      page,
    });
  }, [
    filters,
    page,
    getProducts
  ]);
  return (
    <div className="h-full pt-14">
      <div className="h-full  flex flex-col md:flex-row gap-6 p-6 md:gap-0 md:p-0">
        {/* sidebar filters for desktop  */}
        <div className="hidden md:block fixed top-14  left-0 md:w-64 h-full">
          <ProductFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Mobile filter button */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 flex gap-1 items-center font-semibold bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            <Filter />
            Filters
          </button>
        </div>

        {/* Products Grid */}

        {loading ? (
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3  gap-4 px-4 py-10 md:ml-64">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <SpotlightCard
                  key={index}
                  className="custom-spotlight-card"
                  spotlightColor="rgba(0, 229, 255, 0.2)"
                />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 px-5 py-10 md:ml-64">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 my-6 md:ml-64">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 font-semibold hover:text-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft />
              </button>

              <span className="px-3 py-1 font-semibold">
                Page {page} of {totalPages}
              
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 hover:text-red-700 transition-all duration-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* Mobile filter Drawer  */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 flex">
            <motion.div
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.2 }}
              className="w-3/4 max-w-xs bg-neutral-900 h-full p-4 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-white hover:text-gray-700 transition"
                >
                  <X />
                </button>
              </div>
              <ProductFilters filters={filters} setFilters={setFilters} />
            </motion.div>
            {/* Click outside closes drawer */}
            <div className="flex-1" onClick={() => setShowFilters(false)}></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
