declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        width?: string;
        height?: string;
      }) => {
        embed: (element: HTMLElement | null) => void;
      };
    };
  }

  interface DaumPostcodeData {
    address: string;
    addressType: "R" | "J";
    bname: string;
    buildingName: string;
    roadAddress: string;
    jibunAddress: string;
    zonecode: string;
    userSelectedType: "R" | "J";
  }
}

export {};
