import { CustomLayout } from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <Header />
         <CustomLayout>{children}</CustomLayout>
      </>
   );
}
