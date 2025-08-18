import styles from "@/components/effects/SearchSpinner.module.css";

export default function SearchSpinner() {
   return (
      <div className="">
         <div className={styles.loader}></div>
      </div>
   );
}
