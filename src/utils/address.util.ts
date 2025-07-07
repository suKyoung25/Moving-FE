export const loadPostcodeScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById("daum-postcode-script")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = "daum-postcode-script";
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => resolve();
    script.onerror = () => reject("주소 API 로드 실패");
    document.body.appendChild(script);
  });
};
