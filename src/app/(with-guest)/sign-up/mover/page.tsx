import EasyLoginForm from "@/components/domain/auth/EasyLoginForm";
import MoverTitle from "@/components/domain/auth/MoverTitle";
import SignUpForm from "@/components/domain/auth/SignUpForm";

export default function MoverSignUpPage() {
   return (
      <section className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160">
         {/* 제목 + 기사 페이지로 링크 이동 */}
         <MoverTitle type="signup" />

         {/* 서식 */}
         <SignUpForm userType="mover" />

         {/* 간편 회원가입 */}
         <EasyLoginForm />
      </section>
   );
}
