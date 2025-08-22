import type { AnalyticsCardProps } from "../types";
import SpotlightCard from "./SpotlightCard/SpotlightCard";

const AnalyticsCard = ({ title, value, icon: Icon }: AnalyticsCardProps) => {
  return (
    <SpotlightCard
      className="custom-spotlight-card w-full h-fit overflow-hidden"
      spotlightColor="rgba(255, 0, 0, 0.10)"
    >
      <div className="relative flex justify-between items-center p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm text-gray-200">{title}</h3>
          <p className="font-bold text-4xl text-green-500">{value}</p>
        </div>
        <Icon className="size-32  opacity-10  absolute  -right-4" />
      </div>
    </SpotlightCard>
  );
};
export default AnalyticsCard;
