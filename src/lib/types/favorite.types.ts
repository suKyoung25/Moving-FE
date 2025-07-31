export interface FavoriteMoverState {
   id: string;
   nickName: string;
   profileImage: string | undefined;
   favoriteCount: number;
   averageReviewRating: number;
   reviewCount: number;
   career: number | null;
   estimateCount: number;
   serviceType: string[];
   isLiked: boolean;
}
