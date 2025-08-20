import { tokenFetch } from "@/lib/utils";

export const toggleFavoriteMover = async (moverId: string) => {
   return await tokenFetch(`/movers/${moverId}/toggle-favorite`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
         "Content-Type": "application/json",
      },
   });
};
