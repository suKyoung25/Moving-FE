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
                bg-bg-100
            "
      >
        <Header>
          {/* 여기에 서브 헤더 컴포넌트 추가 */}
          <MyQuotesLayout />
        </Header>

        <DefaultLayout>{children}</DefaultLayout>
      </div>
    </MyQuotesProvider>
  );
}
