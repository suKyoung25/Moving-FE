"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Mover } from "@/lib/types/auth.types";
import { getMoverById } from "@/lib/api/mover/getMover";
import ActionButtons from "./ActionButtons";
import DetailSections from "./DetailSections";
import LineDivider from "../../common/LineDivider";
import DriverCard from "./DriverCard";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import DashboardReviewSection from "@/components/domain/dashboard/ReviewSection";

export default function MoverDetail() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mover, setMover] = useState<Mover | null>(null);

  useEffect(() => {
    const fetchMover = async () => {
      try {
        setLoading(true);
        const id = params.id as string;
        const moverData = await getMoverById(id);
        setMover(moverData);
      } catch (err) {
        console.error("Error fetching mover:", err);
        setError("기사님 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMover();
    }
  }, [params.id]);

  // 찜 상태 변경 핸들러
  const handleFavoriteChange = (moverId: string, isFavorite: boolean, favoriteCount: number) => {
    if (mover && mover.id === moverId) {
      setMover(prev => prev ? { ...prev, isFavorite, favoriteCount } : null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error || !mover) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">
          {error || "기사님 정보를 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 lg:gap-6">
      {/* Mobile Layout - Stack vertically */}
      <div className="w-80 md:w-[36rem] lg:w-[60rem] mx-auto flex flex-col gap-4 lg:hidden">
        <DriverCard mover={mover} onFavoriteChange={handleFavoriteChange} />
        <LineDivider />
        <div className="p-4">
           <SocialShareGroup text="나만 알기엔 아쉬운 기사님인가요?"/>
           <div className="pt-5 lg:hidden">
              <LineDivider />
           </div>
        </div>
        <DetailSections mover={mover} />
        <LineDivider />
        <div className="p-4">
          <DashboardReviewSection moverId={mover.id} />
        </div>
        <ActionButtons mover={mover} />
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex lg:flex-row lg:justify-between lg:gap-6">
        <div className="flex w-full flex-col gap-6 lg:w-2/3">
          <DriverCard mover={mover} onFavoriteChange={handleFavoriteChange} />
          <LineDivider />
          <DetailSections mover={mover} />
          <LineDivider />
          <DashboardReviewSection moverId={mover.id} />
        </div>

        <div className="flex w-full flex-col gap-6 lg:w-1/3">
          <ActionButtons mover={mover} />
          <div className="hidden lg:block">
            <LineDivider />
          </div>
          <div className="lg:p-5">
           <SocialShareGroup text="나만 알기엔 아쉬운 기사님인가요?"/>
           <div className="lg:hidden">
              <LineDivider />
           </div>
        </div>
        </div>
      </div>
    </div>
  );
}