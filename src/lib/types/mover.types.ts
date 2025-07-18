export interface Mover {
   id: string;
   name?: string;
   profileImage?: string;
   nickName: string;
   career: number;
   introduction?: string;
   description?: string;
   serviceType?: string[];
   serviceArea?: string[];
   favoriteCount: number;
   estimateCount: number;
   averageReviewRating: number;
   reviewCount: number;
   isFavorite?: boolean;
}
