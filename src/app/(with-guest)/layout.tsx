import UnauthOnlyGuard from "@/components/common/guards/UnauthOnlyGuard";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <UnauthOnlyGuard>
         <Header />
         <div className="mx-auto px-6 py-16 md:w-96 md:px-0 lg:w-[640px] lg:py-10">
            {children}
         </div>
      </UnauthOnlyGuard>
   );
}
