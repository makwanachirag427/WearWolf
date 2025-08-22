import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="pt-20 border h-full bg-black/30  p-8">
      <div className="flex flex-col gap-3 text-center justify-center items-center h-full">
        <h1 className="text-7xl font-bold text-red-600">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-neutral-400 text-center  max-w-md">
          This page is out of style. But don’t worry, our latest collection is
          waiting for you.
        </p>
        <Link
          to="/"
          className="px-8 py-2 rounded-md bg-red-600 hover:bg-red-700 transition font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
export default NotFoundPage;
