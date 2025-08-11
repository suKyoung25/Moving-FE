// 주소 앞에 두 단어만 (영어일 때 뒤에 두 단어만)
export default function formatAddress(address: string, locale: string) {
   const parts = address.split(" ").filter(Boolean); // 공백 제거

   if (locale === "en") {
      // "Republic of" 제거
      const filteredParts = parts.filter(
         (_, idx) =>
            !(
               parts[idx].toLowerCase() === "republic" &&
               parts[idx + 1]?.toLowerCase() === "of"
            ),
      );

      return filteredParts.length >= 2
         ? `${filteredParts[filteredParts.length - 2]} ${filteredParts[filteredParts.length - 1]}`
         : filteredParts.join(" ");
   } else {
      return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : address;
   }
}
