import SupportForm from "@/components/support/SupportForm";

export default function SupportPage() {
   return (
      <div className="h-full w-full">
         <p className="text-16-medium md:text-28-medium">
            무빙이 당신과 함께하겠습니다.
         </p>
         <h2 className="mt-2.5 text-5xl font-bold md:mt-5 md:text-7xl">
            Let’s Work Together
         </h2>
         <SupportForm />
      </div>
   );
}
