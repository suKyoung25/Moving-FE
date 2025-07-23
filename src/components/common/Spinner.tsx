import styles from "@/components/effects/Spinner.module.css";

export default function Spinner() {
   return (
      <div className="bg-bg-200 fixed top-0 left-0 flex min-h-screen w-full items-center justify-center">
         <div className={styles.loader}></div>
      </div>
   );
}
