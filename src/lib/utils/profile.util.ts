"use client";

import { serviceTypeMap } from "@/constants";
import { Region } from "../types";
import { useCallback } from "react";
import { CropCircle } from "@/components/domain/profile/ImageEditModal";

// Region[] > string[] 으로 변환 (regionName만 추출)
// (서비스 지역과 서비스 종류의 데이터 타입을 string[]으로 일치시키기 위함)
export function extractRegionNames(
   serviceArea: Region[] | undefined,
): string[] {
   if (!serviceArea) return [];
   return serviceArea.map((area) => area.regionName);
}

// (역매핑용) 한글 라벨("소형이사") > enum 값("SMALL")
export const labelToEnumMap = Object.fromEntries(
   Object.entries(serviceTypeMap).map(([key, value]) => [value, key]),
);

// (프로필 이미지 수정 시) 크롭 원이 이미지를 벗어나지 않도록
export function getConstrainedPosition(
   x: number,
   y: number,
   radius: number,
   containerRect: DOMRect,
) {
   const constrainedX = Math.min(
      Math.max(x, radius),
      containerRect.width - radius,
   );
   const constrainedY = Math.min(
      Math.max(y, radius),
      containerRect.height - radius,
   );
   return { x: constrainedX, y: constrainedY };
}

// (프로필 이미지 수정 시) 캔버스에 이미지를 그리고, url 생성
export function createCroppedImage(
   img: HTMLImageElement,
   cropCircle: CropCircle,
   containerRect: DOMRect,
   maxPreviewSize = 160,
): string | null {
   const scaleX = img.naturalWidth / containerRect.width;
   const scaleY = img.naturalHeight / containerRect.height;

   const cropX = (cropCircle.x - cropCircle.radius) * scaleX;
   const cropY = (cropCircle.y - cropCircle.radius) * scaleY;
   const cropWidth = cropCircle.radius * 2 * scaleX;
   const cropHeight = cropCircle.radius * 2 * scaleY;

   const canvas = document.createElement("canvas");

   const cropAspectRatio = cropWidth / cropHeight;

   let canvasWidth = maxPreviewSize;
   let canvasHeight = maxPreviewSize;

   if (cropAspectRatio > 1) {
      canvasHeight = 160 / cropAspectRatio;
   } else {
      canvasWidth = 160 * cropAspectRatio;
   }

   canvas.width = canvasWidth;
   canvas.height = canvasHeight;

   const ctx = canvas.getContext("2d");
   if (!ctx) return null;

   ctx.clearRect(0, 0, canvasWidth, canvasHeight);

   const radius = Math.min(canvasWidth, canvasHeight) / 2;

   ctx.beginPath();
   ctx.arc(canvasWidth / 2, canvasHeight / 2, radius, 0, Math.PI * 2);
   ctx.clip(); // 이 영역 밖은 투명 처리

   ctx.drawImage(
      // 캡버스에 그리기
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvasWidth,
      canvasHeight,
   );

   // 새로운 크롭 이미지 url 생성, base64URL로 변환
   return canvas.toDataURL("image/png");
}
