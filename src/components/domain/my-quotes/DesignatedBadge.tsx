"use client";
import MoveChip from "@/components/common/MoveChip";
import { useAuth } from "@/context/AuthContext";

type DesignatedRequestItem = {
   moverId: string;
};

export default function DesignatedBadge({
   designatedRequest,
}: {
   designatedRequest: DesignatedRequestItem[];
}) {
   const { user } = useAuth();

   if (!user) return null;

   const isDesignated = designatedRequest.some(
      (mover) => mover.moverId === user.id,
   );

   return isDesignated ? <MoveChip type="DESIGNATED" /> : null;
}
