// 주소 앞에 두 단어만 (영어일 때 뒤에 두 단어만)
export default function formatAddress(address: string, locale: string) {
   let parts = address.split(" ").filter(Boolean); // 공백 제거

   if (locale === "en") {
      // "Republic of" 제거
      const filteredParts: string[] = [];
      for (let i = 0; i < parts.length; i++) {
         // "Republic" 다음에 "of"가 오는 경우 스킵
         if (
            parts[i].toLowerCase() === "republic" &&
            parts[i + 1]?.toLowerCase() === "of"
         ) {
            i++; // "of"도 같이 건너뛰기
            continue;
         }
         filteredParts.push(parts[i]);
      }

      return filteredParts.length >= 2
         ? `${filteredParts[filteredParts.length - 2]} ${filteredParts[filteredParts.length - 1]}`
         : filteredParts.join(" ");
   } else {
      return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : address;
   }
}
