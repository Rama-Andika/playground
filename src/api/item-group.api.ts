// import type { TSelectOption } from "@/components/ui/SelectReact";
// import axiosInstance from "./axiosInstance";
// import type { TResponse } from "@/types/response.type";

// export const getItemGroupForSelect = async (): Promise<TSelectOption[]> => {
//   const response = await axiosInstance.get("/api/item-group/select");
//   const result: TResponse<ItemGroupForSelectView[]> = response.data;

//   if (result.data) {
//     const options = result.data?.map((itemGroup) => {
//       itemGroup.subCategories.unshift({ id: "", name: "All" });

//       return {
//         value: itemGroup.id,
//         label: itemGroup.name,
//         subCategories: itemGroup.subCategories.map((subCategory) => ({
//           value: subCategory.id,
//           label: subCategory.name,
//         })),
//       };
//     });

//     options.unshift({ value: "", label: "All", subCategories: [] });

//     return options;
//   } else {
//     return [];
//   }
// };
