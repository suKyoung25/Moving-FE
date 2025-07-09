// 임시 지연 함수
export function delay(count: number) {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve("read");
      }, count);
   });
}
