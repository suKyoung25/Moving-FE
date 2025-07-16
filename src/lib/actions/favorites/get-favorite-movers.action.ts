"use server";

import { getFavoriteMovers } from "@/lib/api/favorites/getFavoriteMovers";

export async function getFavoriteMoversAction(page = 1, limit = 6) {
   return getFavoriteMovers(page, limit);
}
