import { tokenFetch } from "@/lib/utils";

// 기사님 프로필 이미지 생성,수정 (AWS)
export default async function updateProfileImage(formdata: FormData) {
   const url = "/images/upload?access=public";

   const res = await tokenFetch(url, {
      method: "POST",
      body: formdata,
   });

   return res;
}

// 기사님 프로필 이미지 생성,수정 (cloudinary)
export const uploadToCloudinary = async (file: File) => {
   const formData = new FormData();
   formData.append("file", file);
   formData.append("upload_preset", "moving_users_profile");

   // Cloudinary API 엔드포인트
   const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
   const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

   const response = await fetch(url, {
      method: "POST",
      body: formData,
   });

   const data = await response.json();
   return data;
};
