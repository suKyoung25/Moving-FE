// favoriteMover.api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/movers`
  : "http://localhost:4000/movers";

export const toggleFavoriteMover = async (
  moverId: string,
  token: string
) => {
  const res = await fetch(`${API_BASE}/${moverId}/toggle-favorite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || "찜 처리 실패");
    } catch {
      throw new Error("찜 처리 실패");
    }
  }

  return res.json();
};
