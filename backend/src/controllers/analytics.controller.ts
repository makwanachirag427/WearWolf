import { Response } from "express";
import { AnalyticsData, RequestType } from "../types";
import { HandleError } from "../uitls/error";
import User from "../models/user.model";
import Order from "../models/order.model";
import Product from "../models/product.model";

export const getData = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);
    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    HandleError(res, error, "getData controller");
  }
};

async function getAnalyticsData(): Promise<AnalyticsData> {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // it groups all document
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
}

async function getDailySalesData(
  startDate: Date,
  endDate: Date
): Promise<
  {
    date: string;
    sales: number;
    revenue: number;
  }[]
> {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    //  example of daily sales data
    //  [
    //   {
    //     _id : "2025-08-08",
    //     sales : 1,
    //     revenue : 5023.12,
    //   }
    //  ]

    const dateArray = getDateInRange(startDate, endDate);

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
}

function getDateInRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// export const placeholder = async (
//   req: RequestType,
//   res: Response
// ): Promise<void> => {
//   try {
//   } catch (error) {
//     HandleError(res, error, "placeholder controller");
//   }
// };
