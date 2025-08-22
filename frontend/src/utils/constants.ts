export const categories: string[] = [
  "t-shirts",
  "shirts",
  "jeans",
  "shoes",
  "jackets",
  "accessories",
];

export const sizesOptions: string[] = ["S", "M", "L", "XL", "XXL"];

export const getOptimizedImage = (url: string) => {
  return url.replace("/upload/", "/upload/w_400,q_auto,f_auto/");
};