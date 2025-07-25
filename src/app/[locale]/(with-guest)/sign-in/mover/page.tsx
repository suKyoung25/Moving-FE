import EasyLoginForm from "@/components/domain/auth/EasyLoginForm";
import MoverTitle from "@/components/domain/auth/MoverTitle";
import SignInForm from "@/components/domain/auth/SignInForm";

export default function MoverSignInPage() {
   return (
      <section className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160">
         {/* 제목 + 일반유저 페이지로 링크 이동 */}
         <MoverTitle type="login" />

         {/* 서식 */}
         <SignInForm userType="mover" />

         {/* 간편 회원가입 */}
         <EasyLoginForm />
      </section>
   );
}
