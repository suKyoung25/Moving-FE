import Header from "@/components/layout/Header";

export default function Layout({children} : {children : React.ReactNode}) {
    return (
        <>
            <Header />
            <main className="max-w-[1400px] mx-auto px-6 py-6 md:px-16 lg:px-0 lg:py-10">
                {children}
            </main>
        </>
    )
}
