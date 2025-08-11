// 주소 앞에 두 단어만 (영어일 때 뒤에 두 단어만)
export default function formatAddress(address: string, locale: string) {
   const parts = address.split(" ");

   if (locale === "en") {
      return parts.length >= 2
         ? `${parts[parts.length - 2]} ${parts[parts.length - 1]}`
         : address;
   } else {
      return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : address;
   }
}
