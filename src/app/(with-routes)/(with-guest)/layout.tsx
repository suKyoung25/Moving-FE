export default function Layout({children} : {children : React.ReactNode}) {
    return (
        // 비로그인 시 입장 가능, 로그인 시 입장 불가능
        <>
            {children}
        </>
    )
}
