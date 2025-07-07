export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        // 로그인된 사용자만 들어올 수 있도록 경로 방어
        <>
            { children }
        </>
    )
}
