import ClientTitle from "../../../../components/sign-up-in/ClientTitle";
import EasyLoginForm from "../../../../components/sign-up-in/EasyLoginForm";
import ClientLoginForm from "@/components/sign-up-in/ClientLoginForm";

export default function ClientSignInPage() {
   return (
      <section className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160">
         {/* 제목 + 기사 페이지로 링크 이동 */}
         <ClientTitle type="login" />

         {/* 서식 */}
         <ClientLoginForm />

         {/* 간편 회원가입 */}
         <EasyLoginForm />
      </section>
   );
}
