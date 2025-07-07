import DefaultLayout from "@/components/layout/DefaultLayout"
import ExampleLayout from "@/components/layout/ExampleLayout"
import Header from "@/components/layout/Header"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="
                min-h-screen
                bg-bg-100
            "
        >
            <Header>
                {/* 여기에 서브 헤더 컴포넌트 추가 */}
                <ExampleLayout />
            </Header>

            <DefaultLayout>
                {children}
            </DefaultLayout>
        </div>
    )
}