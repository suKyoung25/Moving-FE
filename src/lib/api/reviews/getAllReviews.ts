// 예시 데이터 불러오기

export async function getAllReviews() {
   try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
         cache: "no-store",
      });

      if (!res.ok) throw new Error("목록을 불러오지 못했습니다.");

      return res.json();
   } catch (error) {
      console.error(error);
      return [];
   }
}
