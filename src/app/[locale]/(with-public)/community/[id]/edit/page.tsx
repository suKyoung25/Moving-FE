import CommunityForm from "@/components/domain/community/CommunityForm";
import getCommunity from "@/lib/api/community/requests/getCommunity";

interface EditCommunityPageProps {
   params: Promise<{ id: string; locale: string }>;
}

export default async function EditCommunityPage({
   params,
}: EditCommunityPageProps) {
   const { id, locale } = await params;
   const { data } = await getCommunity(id, locale);

   return (
      <CommunityForm
         mode="edit"
         communityId={id}
         initialData={{
            title: data.title,
            content: data.content,
         }}
      />
   );
}
