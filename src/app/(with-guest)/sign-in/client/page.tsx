import ClientTitle from "../../../../components/sign-up-in/ClientTitle";
import EasyLoginForm from "../../../../components/sign-up-in/EasyLoginForm";
import LoginForm from "@/components/sign-up-in/LoginForm";

export default function ClientSignInPage() {
  return (
    <section className="mt-18 mb-31 flex flex-col items-center w-82 lg:w-160 mx-auto">
      {/* 제목 + 기사 페이지로 링크 이동 */}
      <ClientTitle type="login" />

      {/* 서식 */}
      <LoginForm />

      {/* 간편 회원가입 */}
      <EasyLoginForm />
    </section>
  );
}
