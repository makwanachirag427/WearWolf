import { useState, type ChangeEvent } from "react";
import type { updateAddressFormType, updateAddressProps } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const UpdateAddress = ({ setIsUpdatingAddress }: updateAddressProps) => {
  const { user,loading, updateAddress } = useAuthStore();
  const address = user?.address;

  const [formData, setFormData] = useState<updateAddressFormType>({
    fullName: address?.fullName || "",
    phone: address?.phone || "",
    street:address?.street || "",
    city:address?.city || "",
    state: address?.state || "",
    postalCode:address?.postalCode || "",
    country: address?.country || "",
  });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Please Enter full name");
    if (!formData.phone.trim()) return toast.error("Please Enter phone number");
    if (formData.phone.trim().length < 10)
      return toast.error("Phone number must be atleast 10 digit long");
    if (!formData.street.trim()) return toast.error("Please Enter street");
    if (!formData.postalCode.trim())
      return toast.error("Please Enter postal code");
    if (formData.postalCode.trim().length < 4)
      return toast.error("Postal Code must be atleast 4 to 5 digit long");
    if (!formData.city.trim()) return toast.error("Please Enter city");
    if (!formData.state.trim()) return toast.error("Please Enter state");
    if (!formData.country.trim()) return toast.error("Please Enter country");

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = validateForm();

    if (success !== true) return;
    updateAddress(formData);
    setIsUpdatingAddress(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    if (e.target === e.currentTarget) {
      setIsUpdatingAddress(false); // close if clicking outside modal
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div className="bg-neutral-900 border border-gray-400 text-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            if (loading) return;
            setIsUpdatingAddress(false);
          }}
          className="absolute top-3 right-3 text-white hover:text-red-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Update Address</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* fullname  */}
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="block font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-400 rounded-lg px-4 py-1.5  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
            />
          </div>
          {/* phone and street  */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="phone" className="block font-medium">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full border border-gray-400 rounded-lg px-4 py-1.5  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="street" className="block font-medium">
                Street
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter your street"
                className="w-full border border-gray-400 rounded-lg px-4 py-1.5  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              />
            </div>
          </div>
          {/* city and state  */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="city" className="block font-medium">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                className="w-full border border-gray-400 rounded-lg px-4 py-1.5  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="state" className="block font-medium">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
                className="w-full border border-gray-400 rounded-lg px-4 py-1.5  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              />
            </div>
          </div>

          {/* postacode and country */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="postalCode" className="block font-medium">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter your postal code"
                className="w-full border border-gray-400 rounded-lg px-4 py-1.5  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="country" className="block font-medium">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter your country"
                className="w-full border border-gray-400 rounded-lg px-4 py-1.5  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition flex justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            {loading ? (
              <Loader className="animate-spin stroke-3" />
            ) : (
              "Save Address"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAddress;
