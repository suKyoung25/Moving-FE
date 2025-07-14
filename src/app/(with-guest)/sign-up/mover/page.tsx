import EasyLoginForm from "@/components/sign-up-in/EasyLoginForm";
import MoverSignUpForm from "@/components/sign-up-in/MoverSignUpForm";
import MoverTitle from "@/components/sign-up-in/MoverTitle";

export default function MoverSignUpPage() {
   return (
      <section className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160">
         {/* 제목 + 기사 페이지로 링크 이동 */}
         <MoverTitle type="signup" />

         {/* 서식 */}
         <MoverSignUpForm />

         {/* 간편 회원가입 */}
         <EasyLoginForm />
      </section>
   );
}
