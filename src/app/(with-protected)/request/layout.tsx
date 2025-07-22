import ProgressBar from "@/components/domain/request/ProgressBar";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import { FormWizardProvider } from "@/context/FormWizardContext";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-bg-200 min-h-screen">
         <FormWizardProvider>
            <Header>
               <ProgressBar />
            </Header>
            <DefaultLayout>{children}</DefaultLayout>
         </FormWizardProvider>
      </div>
   );
}
