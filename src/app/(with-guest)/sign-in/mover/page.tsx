import EasyLoginForm from "@/components/sign-up-in/EasyLoginForm";
import MoverTitle from "@/components/sign-up-in/MoverTitle";
import MoverLoginForm from "@/components/sign-up-in/MoverLoginForm";

export default function MoverSignInPage() {
   return (
      <section className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160">
         {/* 제목 + 기사 페이지로 링크 이동 */}
         <MoverTitle type="login" />

         {/* 서식 */}
         <MoverLoginForm />

         {/* 간편 회원가입 */}
         <EasyLoginForm />
      </section>
   );
}
