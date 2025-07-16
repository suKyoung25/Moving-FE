import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import MyQuotesLayout from "@/components/layout/MyQuotesLayout";

import { MyQuotesProvider } from "@/context/MyQuotesContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MyQuotesProvider>
      <div
        className="
                min-h-screen
               
                bg-white
            "
      >
        {/*  bg-bg-100 */}
        <Header>
          <MyQuotesLayout />
        </Header>

        <DefaultLayout>{children}</DefaultLayout>
      </div>
    </MyQuotesProvider>
  );
}
