import SignUpForm from "@/components/domain/auth/SignUpForm";
import ClientTitle from "@/components/domain/auth/ClientTitle";
import EasyLoginForm from "@/components/domain/auth/EasyLoginForm";

export default function ClientSignUpPage() {
   return (
      <section className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160">
         {/* 제목 + 기사 페이지로 링크 이동 */}
         <ClientTitle type="signup" />

         {/* 서식 */}
         <SignUpForm userType="client" />

         {/* 간편 회원가입 */}
         <EasyLoginForm />
      </section>
   );
}
