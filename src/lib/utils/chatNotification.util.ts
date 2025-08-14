// 현재 보고 있는 채팅방 ID
let currentChatId: string | null = null;

// 오디오 컨텍스트 관리 (다국어 지원)
let audioContext: AudioContext | null = null;
const audioBuffers: Map<string, AudioBuffer> = new Map(); // 언어별 오디오 버퍼
let isAudioInitialized = false;

// 지원하는 언어 목록
const SUPPORTED_LANGUAGES = ["kr", "en", "zh"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// URL에서 현재 언어 감지 (Next.js i18n 지원)
export const getCurrentLanguage = (): SupportedLanguage => {
   if (typeof window === "undefined") return "kr";

   const path = window.location.pathname;

   const langMatch = path.match(/^\/([a-z]{2,3})(?:\/|$)/);
   const detectedLang = langMatch?.[1];

   // Next.js locale 매핑
   switch (detectedLang) {
      case "ko":
         return "kr"; // 한국어
      case "en":
         return "en"; // 영어
      case "zh":
      case "zh-cn":
      case "zh-tw":
         return "zh"; // 중국어
      default:
         return "kr"; // 기본값
   }
};

// Next.js useRouter를 사용한 언어 감지 (옵션)
// import { useRouter } from 'next/router';
export const getCurrentLanguageFromRouter = (
   locale?: string,
): SupportedLanguage => {
   // Next.js router.locale 사용 시
   if (locale) {
      switch (locale) {
         case "ko":
            return "kr";
         case "en":
            return "en";
         case "zh":
         case "zh-CN":
         case "zh-TW":
            return "zh";
         default:
            return "kr";
      }
   }

   // 폴백: URL 파싱
   return getCurrentLanguage();
};

// 알림 설정 관리
export const getNotificationEnabled = (userId: string): boolean => {
   if (typeof window === "undefined") return true;
   const setting = localStorage.getItem(`notification_${userId}`);
   return setting !== "false";
};

export const setNotificationEnabled = (userId: string, enabled: boolean) => {
   if (typeof window === "undefined") return;
   localStorage.setItem(`notification_${userId}`, enabled.toString());
};

// 특정 언어의 오디오 파일 로드
const loadAudioForLanguage = async (
   language: SupportedLanguage,
): Promise<AudioBuffer | undefined> => {
   try {
      const response = await fetch(`/sounds/notification_${language}.mp3`);
      if (!response.ok) {
         throw new Error(
            `Failed to load audio for ${language}: ${response.status}`,
         );
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContext!.decodeAudioData(arrayBuffer);

      audioBuffers.set(language, buffer);

      return buffer;
   } catch (error) {
      console.error(`${language} 언어 알림음 로드 실패:`, error);
      return undefined;
   }
};

// 오디오 컨텍스트 초기화 (사용자 상호작용 후 호출)
export const initializeAudioContext = async (): Promise<boolean> => {
   if (typeof window === "undefined") return false;

   try {
      // AudioContext 생성
      audioContext = new (window.AudioContext ||
         (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();

      // 현재 언어의 알림음 우선 로드
      const currentLang = getCurrentLanguage();
      await loadAudioForLanguage(currentLang);

      // 백그라운드에서 다른 언어들도 미리 로드 (선택적)
      const otherLanguages = SUPPORTED_LANGUAGES.filter(
         (lang) => lang !== currentLang,
      );
      Promise.all(
         otherLanguages.map((lang) => loadAudioForLanguage(lang)),
      ).catch((error) => console.warn("일부 언어 알림음 로드 실패:", error));

      isAudioInitialized = true;

      // localStorage에 초기화 완료 표시
      localStorage.setItem("audioInitialized", "true");

      return true;
   } catch (error) {
      console.error("오디오 초기화 실패:", error);
      return false;
   }
};

// 페이지 로드 시 이전에 초기화했는지 확인
export const checkAudioInitialized = (): boolean => {
   if (typeof window === "undefined") return false;

   const wasInitialized = localStorage.getItem("audioInitialized");
   if (wasInitialized && !isAudioInitialized) {
      // 이전에 초기화했었다면 다시 초기화 시도
      initializeAudioContext().catch(console.error);
   }

   return !!wasInitialized;
};

// 현재 채팅방 설정 (채팅창 열었을 때)
export const setCurrentChatId = (chatId: string | null) => {
   if (chatId === null) {
      // ChatRoomList에 있거나 채팅 페이지를 나간 경우
      currentChatId = "NOT_IN_CHAT";
   } else {
      // 특정 채팅방에 입장한 경우
      currentChatId = chatId;
   }
};

// 새 메시지 알림 (메시지 수신시 호출)
export const handleNewMessage = (
   chatId: string,
   senderId: string,
   myUserId: string,
) => {
   // 내가 보낸 메시지면 무시
   if (senderId === myUserId) {
      return;
   }

   // 현재 그 특정 채팅방을 보고 있으면 무시 (다른 채팅방은 알림 재생)
   if (currentChatId === chatId) {
      return;
   }

   // 알림 설정이 꺼져있으면 무시
   if (!getNotificationEnabled(myUserId)) {
      return;
   }

   // 현재 언어에 맞는 알림음 재생!
   playNotificationSound();
};

// 알림음 재생 (다국어 지원 버전)
export const playNotificationSound = async () => {
   const currentLang = getCurrentLanguage();

   try {
      // 1. AudioContext 방식 (가장 안정적)
      if (isAudioInitialized && audioContext) {
         let audioBuffer = audioBuffers.get(currentLang);

         // 현재 언어의 버퍼가 없으면 동적 로드 시도
         if (!audioBuffer) {
            audioBuffer = await loadAudioForLanguage(currentLang);
         }

         if (audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            // 볼륨 조절을 위한 GainNode 추가
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.5;

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            source.start();
            return;
         }
      }

      // 2. 폴백: HTML5 Audio 방식
      const audio = new Audio(`/sounds/notification_${currentLang}.mp3`);
      audio.volume = 0.5;

      audio
         .play()
         .then(() => {})
         .catch((error) => {
            console.error(
               `HTML5 Audio ${currentLang} 알림음 재생 실패:`,
               error,
            );

            // 현재 언어 파일이 없으면 기본(한국어)으로 폴백
            if (currentLang !== "kr") {
               const fallbackAudio = new Audio("/sounds/notification_kr.mp3");
               fallbackAudio.volume = 0.5;
               fallbackAudio.play().catch(console.error);
            }
         });
   } catch (error) {
      console.error("알림음 재생 중 오류:", error);
   }
};

// 사용자 상호작용 시 호출 (버튼 클릭 등)
export const handleUserInteraction = async () => {
   if (!isAudioInitialized && typeof window !== "undefined") {
      await initializeAudioContext();
   }
};

// 현재 채팅 상태 조회
export const getCurrentChatId = (): string | null => {
   // 초기값이 null이면 NOT_IN_CHAT으로 간주
   return currentChatId || "NOT_IN_CHAT";
};

// 언어 변경 시 호출 (선택적 - 언어 변경 시 새 오디오 미리 로드)
export const onLanguageChange = async (newLanguage?: SupportedLanguage) => {
   const targetLang = newLanguage || getCurrentLanguage();

   if (isAudioInitialized && audioContext && !audioBuffers.has(targetLang)) {
      await loadAudioForLanguage(targetLang);
   }
};

// 디버깅용: 현재 로드된 언어들 확인
export const getLoadedLanguages = (): string[] => {
   return Array.from(audioBuffers.keys());
};

// React 컴포넌트에서 사용할 때 (useRouter와 함께)
export const useNotificationWithLocale = (routerLocale?: string) => {
   // 컴포넌트에서 사용 예시:
   // const router = useRouter();
   // const { playLocalizedNotification } = useNotificationWithLocale(router.locale);

   const playLocalizedNotification = () => {
      playNotificationSound();
   };

   return {
      playLocalizedNotification,
      currentLanguage: getCurrentLanguageFromRouter(routerLocale),
      loadedLanguages: getLoadedLanguages(),
   };
};
