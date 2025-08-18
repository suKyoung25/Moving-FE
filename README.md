[**한국어**](/README.md) | [English](/docs/en/README.md) | [简体字](/docs/zh/README.md)

# Moving
*스마트한 이사 비교 플랫폼*

<img width="3212" height="2023" alt="image" src="https://github.com/user-attachments/assets/a3260d6e-ac5c-4918-a846-bb25362c4798" />

---

## Table of Contents

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [팀 구성](#팀-구성)
- [시스템 아키텍처](#시스템-아키텍처)
- [기술 스택](#기술-스택)
- [상세 기능](#상세-기능)
- [트러블 슈팅](#트러블-슈팅)
- [프로젝트 구조](#프로젝트-구조)

---

## 프로젝트 소개

Moving은 사용자가 손쉽게 여러 기사님의 견적을 비교하고, 자신에게 가장 적합한 전문가를 선택할 수 있도록 돕는 스마트 이사 비교 플랫폼입니다.

기존의 복잡하고 불투명했던 이사 견적 과정을 간소화하여, 사용자가 원하는 조건(이사 유형, 지역, 일정 등)에 맞는 전문가를 빠르게 찾을 수 있습니다.

또한 기사님 입장에서도 효율적인 고객 매칭이 가능해, 투명한 거래 환경과 편리한 서비스 경험을 제공합니다.

### 링크
- **팀 노션**: [바로가기](https://www.notion.so/4Team-Moving-Ops-Board-2153fde0e1948005ad04c1585430e77f)
- **백엔드 저장소**: [GitHub Repository](https://github.com/az0319h/6th-Moving-4Team-BE)

---

## 주요 기능

### 고객 기능
- **AI 견적 계산기**: OpenAI GPT-4 기반의 지능형 견적 계산 시스템
- **기사 검색**: 위치, 서비스 유형, 평점 기반 필터링 및 정렬
- **견적 요청**: 단계별 마법사 형태의 견적 요청 시스템
- **견적 관리**: 받은 견적 확인, 승인/거절, 진행 상황 추적
- **즐겨찾기**: 선호하는 기사님 저장 및 관리
- **리뷰 시스템**: 이사 완료 후 리뷰 작성 및 평점 관리

### 기사님 기능
- **견적 응답**: 받은 견적 요청에 대한 상세 견적 제공
- **프로필 관리**: 업체 정보, 서비스 영역, 경력 정보 관리
- **받은 요청 관리**: 필터링 및 검색을 통한 요청 관리
- **리뷰 관리**: 받은 리뷰 확인 및 응답

### 공통 기능
- **다국어 지원**: 한국어(기본), 영어, 중국어 완전 지원
- **실시간 알림**: Firebase 기반 실시간 알림 시스템
- **커뮤니티**: 사용자 간 소통 및 정보 공유 공간
- **고객 지원**: 문의사항 접수 및 파일 업로드 지원
- **소셜 로그인**: Google, Kakao, Naver 소셜 로그인 지원
- **실시간 채팅**: 고객과 기사의 실시간 소통

---
### 기본 기능
<table>
  <thead>
    <tr>
      <th align="center">로그인 및 로그아웃</th>
      <th align="center">랜덤 포인트</th>
      <th align="center">포토카드 생성</th>
      <th align="center">필터, 무한스크롤</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/0fd8cbad-fcb1-4ef8-80c3-1f1890872548" alt="로그인및로그아웃" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/0fd51b67-6e94-4edc-8a4b-78f71a0319c4" alt="랜덤포인트" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/c69f5edc-e626-4c41-9c80-c4669cd7f5df" alt="포토카드생성" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/eb7fb19e-308b-49d4-9848-e54a34c9e9f4" alt="필터무한스크롤" width="200">
      </td>
    </tr>
  </tbody>
</table>

### 거래 기능
<table>
  <thead>
    <tr>
      <th align="center">포토카드 판매</th>
      <th align="center">포토카드 수정</th>
      <th align="center">포토카드 판매 내리기</th>
      <th align="center">포토카드 구매</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/7746a772-e58f-4ae6-9935-2e3312ae3647" alt="포토카드 판매" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/5dbc3427-2def-4205-b05a-c6230767d6fa" alt="포토카드 수정" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/dd3f1d2e-54f2-4765-9a42-d72c9672908c" alt="포토카드 판매 내리기" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/392dda2b-aa79-4715-a9e7-e4ebc360dc10" alt="포토카드 구매" width="200">
      </td>
    </tr>
  </tbody>
</table>

### 알림 및 교환 기능
<table>
  <thead>
    <tr>
      <th align="center">알림 확인</th>
      <th align="center">교환 요청</th>
      <th align="center">구매자의 교환 요청 취소</th>
      <th align="center">판매자의 교환 승인 및 취소</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/741a866e-f4cc-4fc3-9eba-54d511b05117" alt="알림 확인" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/67c8d1a3-545f-4d07-86c7-cd688d03678f" alt="교환 요청" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/f51510c9-ad11-451b-89f4-ea125f667d5a" alt="구매자의 교환 요청 취소" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/1ae2e3f3-a830-46c5-8ea9-b1737db5f74f" alt="판매자의 교환 승인 및 취소" width="200">
      </td>
    </tr>
  </tbody>
</table>

---

## 팀 구성

<table align="center">
  <tbody>
    <tr>
      <th>Team Leader</th>
      <th>Deputy Team Leader</th>
      <th>Team Member</th>
      <th>Team Member</th>
      <th>Team Member</th>
      <th>Team Member</th>
      <th>Team Member</th>
    </tr>
    <tr>
      <td align="center">
        <a href="https://github.com/az0319h">
          <img src="https://github.com/az0319h.png?size=100" width="100px" alt="홍성훈"/>
          <br />
          <b>홍성훈</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/fiivxyxxng">
          <img src="https://github.com/fiivxyxxng.png?size=100" width="100px" alt="오하영"/>
          <br />
          <b>오하영</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/writing-sky">
          <img src="https://github.com/writing-sky.png?size=100" width="100px" alt="양성경"/>
          <br />
          <b>양성경</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/suKyoung25">
          <img src="https://github.com/suKyoung25.png?size=100" width="100px" alt="김수경"/>
          <br />
          <b>김수경</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/jbinyim">
          <img src="https://github.com/jbinyim.png?size=100" width="100px" alt="임정빈"/>
          <br />
          <b>임정빈</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Shinmilli">
          <img src="https://github.com/Shinmilli.png?size=100" width="100px" alt="신수민"/>
          <br />
          <b>신수민</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/shimyubin">
          <img src="https://github.com/shimyubin.png?size=100" width="100px" alt="심유빈"/>
          <br />
          <b>심유빈</b>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center">
        <a href="https://pointed-afternoon-24b.notion.site/2173fde0e19480728178dce120cbdabb" target="_blank">개인 리포트</a>
      </td>
      <td align="center">
        <a href="https://immediate-conga-b1b.notion.site/217fb120f2ad80ea85b2e44377f62a58" target="_blank">개인 리포트</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/3-21788b3cb86180698299f89f0ee4ff53" target="_blank">개인 리포트</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/21783b8d694c801db314d01f63cd68c4" target="_blank">개인 리포트</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/217e8b00d07a8036a583ddb33c62345d" target="_blank">개인 리포트</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/2177a895c9ac8039a81fc7aad5fdbaed" target="_blank">개인 리포트</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/1c4c0886ab1380968ff8febb837182c7" target="_blank">개인 리포트</a>
      </td>
    </tr>
  </tbody>
</table>

<details>
<summary><strong>팀원별 주요 작업 내용</strong></summary>
<div markdown="1">

- **홍성훈**  
  - 받은 견적 페이지  
  - 보낸 견적 목록 페이지  
  - 반려 견적 목록 페이지  
  - 랜딩 페이지  
  - 고객 지원 페이지  
  - 받은 견적 및 보낸 견적 상세 페이지 작성  

- **오하영**  
  - 견적 요청 페이지(이사종류/이사날짜/주소)  
  - 견적 요청 진행 중인 경우 페이지  
  - 카카오 주소 API  
  - 알림 기능  

- **양성경**  
  - 전역 상태관리  
  - 일반유저/기사님 로그인/회원가입 컴포넌트  
  - 일반유저 로그인/회원가입 페이지  
  - 일반유저 프로필 등록/수정 페이지  
  - 소셜 로그인 기능  
  - 헤더에서 프로필 드롭다운 메뉴  

- **김수경**  
  - 일반유저/기사님 프로필 컴포넌트  
  - 기사님 로그인/회원가입 페이지  
  - 기사님 프로필 등록/수정 페이지  
  - 기사님 기본정보 수정 페이지  
  - 소셜 로그인 기능  
  - 회원 탈퇴 기능 구현  

- **임정빈**  
  - 대기 중인 견적 페이지  
  - 대기 중인 견적 상세 페이지  
  - 받았던 견적 페이지  
  - 받았던 견적 상세 페이지  

- **신수민**  
  - 일반유저/비회원 기사님 찾기 페이지  
  - 일반유저/비회원 기사님 상세 페이지  
  - 기사님 마이페이지  

- **심유빈**  
  - 버튼 컴포넌트 구현  
  - 찜한 기사님 페이지  
  - 작성 가능한 리뷰 페이지  
  - 내가 작성한 리뷰 페이지  
  - 다국어 기능  

</div>
</details>

---

## 시스템 아키텍처

<img width="3212" height="2023" alt="fa68b90569ee2253" src="https://github.com/user-attachments/assets/b271e73e-7096-412c-8cfa-a7b8318607f2" />

---

## 기술 스택

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-770C56?style=flat-square&logo=date-fns&logoColor=white)
![react-icons](https://img.shields.io/badge/react--icons-E91E63?style=flat-square&logo=react&logoColor=white)
![react-hook-form](https://img.shields.io/badge/react--hook--form-EC5990?style=flat-square&logo=reacthookform&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=react-query&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)




### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Cookie-Parser](https://img.shields.io/badge/Cookie--Parser-8A2BE2?style=flat-square&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-00BFFF?style=flat-square&logo=lock&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=flat-square&logo=passport&logoColor=white)


### Deployment
![EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazon-ec2&logoColor=white)
![RDS](https://img.shields.io/badge/AWS_RDS-527FFF?style=flat-square&logo=amazon-rds&logoColor=white)
![S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat-square&logo=amazon-s3&logoColor=white)
![Route 53](https://img.shields.io/badge/Route_53-8C4FFF?style=flat-square&logo=amazon-route-53&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)


### Etc
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat-square&logo=sentry&logoColor=white)
![DeepL](https://img.shields.io/badge/DeepL-0F2B46?style=flat-square&logo=deepl&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)



---


## 상세 기능

### 핵심 기능 상세

### AI 견적 계산기
- **OpenAI GPT-4** 기반 지능형 견적 계산
- 이사 유형, 거리, 날짜, 엘리베이터 유무 등 고려
- 실시간 기본 견적과 AI 견적 비교 제공
- 할당량 초과 시 fallback 견적 시스템

### 실시간 채팅
- **Firebase Realtime Database** 기반
- 실시간 메시지 동기화
- 읽지 않은 메시지 알림
- 채팅방 참여/퇴장 관리
- 시스템 메시지 지원

### 기사님 검색
- 위치 기반 검색
- 서비스 유형 필터링 (소형/가정/사무실)
- 평점, 리뷰 수, 견적 수 기준 정렬
- 즐겨찾기 기능
- 무한 스크롤 페이지네이션

### 견적 요청 시스템
- 단계별 마법사 형태
- 실시간 폼 유효성 검사
- 임시 저장 기능 (로컬/서버)
- 진행 상황 추적

## 다국어 지원

이 프로젝트는 다음 언어를 완전히 지원합니다:

- 🇰🇷 **한국어 (ko)** - 기본 언어
- 🇺🇸 **영어 (en)**
- 🇨🇳 **중국어 (zh)**

URL의 locale 파라미터를 오른쪽 밑 허브에 있는 설정을 통해 변경할 수 있습니다

### 번역 파일 위치
```
messages/
├── ko.json    # 한국어 번역
├── en.json    # 영어 번역
└── zh.json    # 중국어 번역
```

## 인증 시스템

### 지원하는 로그인 방식
- **이메일/비밀번호** 로그인
- **Google** 소셜 로그인
- **Kakao** 소셜 로그인
- **Naver** 소셜 로그인

### 사용자 유형
- **Client** - 일반 고객
- **Mover** - 기사님

## 반응형 디자인

- **모바일 우선** 디자인
- **Tablet** 및 **Desktop** 최적화
- **Tailwind CSS** 기반 반응형 레이아웃
- **접근성** 고려 (ARIA 라벨, 키보드 네비게이션)

## 성능 최적화

- **Next.js App Router** 기반 서버 컴포넌트
- **React Suspense** 및 **lazy loading**
- **TanStack Query** 캐싱 전략
- **이미지 최적화** (Next.js Image 컴포넌트)
- **코드 스플리팅** 및 **번들 최적화**

---

## 트러블 슈팅

### 1. 이미지 업로드 방식 변경 (Multer → Cloudinary)

**문제 상황**
- Multer를 사용한 서버 로컬 저장 방식
- Render 재배포 시 이미지 파일 손실 문제

**해결 방법**
- Cloudinary 외부 호스팅 서비스 도입
- 프론트엔드에서 직접 업로드 후 URL만 백엔드 전달
- 재배포와 무관한 안정적 이미지 저장 구현

```typescript
export async function upLoadImage(file) {
  const url = 'https://api.cloudinary.com/v1_1/[yourId]/image/upload';
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'primary-key');

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: data,
    });

    if (!res.ok) {
      throw new Error('Image Upload Failed!');
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
```

### 2. 구매 후 UI 즉각 반영 (useEffect → React Query useMutation)

**문제 상황**
- useEffect 기반 상태 업데이트의 지연
- 구매 직후 잔여 수량이 즉시 반영되지 않는 UX 문제

**해결 방법**
- React Query의 `useMutation` 활용
- 비동기 요청과 로컬 상태 변경을 하나의 플로우로 통합
- 성공 시 즉시 UI 반영으로 사용자 경험 개선

```typescript
const { mutate, isPending } = useMutation({
  mutationFn: () => storeService.purchaseCard(cardId, quantity),
  onSuccess: (data) => {
    setLocalRemaining((prev) => prev - quantity); // 즉시 UI 반영
    if (onSuccess) onSuccess(data);
    openStateModal(200, "구매", { grade, name: cardName, count: quantity });
  },
  onError: (err) => {
    openStateModal(err.status || 400, "구매", { grade, name: cardName, count: quantity });
  },
});
```

---

## 프로젝트 구조

```
src/
├── app/                           # Next.js App Router
│   ├── [locale]/                 # 다국어 라우팅 (ko, en, zh)
│   │   ├── (marketing)/          # 마케팅 페이지 (랜딩 페이지)
│   │   ├── (with-guest)/         # 게스트 전용 페이지 (로그인/회원가입)
│   │   ├── (with-public)/        # 공개 페이지
│   │   │   ├── community/        # 커뮤니티
│   │   │   ├── estimate-calculator/ # AI 견적 계산기
│   │   │   ├── mover-search/     # 기사님 검색
│   │   │   └── support/          # 고객 지원
│   │   └── (with-protected)/     # 인증 필요 페이지
│   │       └── dashboard/        # 대시보드 (기사님용)
│   │       └── favorite-movers/  # 즐겨찾기
│   │       └── my-quotes/        # 내 견적 관리
│   │       └── profile/          # 프로필 관리
│   │       └── received-requests/# 받은 요청 관리
│   │       └── request/          # 견적 요청
│   │       └── reviews/          # 리뷰 관리
│   └── api/                      # API 라우트
│       ├── auth/                 
│       ├── google-maps/        
│       ├── openai/              
│       └── sentry-example-api/   
├── components/                   # 재사용 가능한 컴포넌트
│   ├── common/                   # 공통 컴포넌트
│   │   ├── Chatbutton.tsx       
│   │   ├── ConfirmModal.tsx     
│   │   ├── EmptyState.tsx       
│   │   ├── Pagination.tsx       
│   │   ├── Spinner.tsx          
│   │   └── ToastPopup.tsx       
│   ├── domain/                   # 도메인별 컴포넌트
│   │   ├── auth/                
│   │   ├── community/           
│   │   ├── dashboard/           
│   │   ├── estimate-calculator/ 
│   │   ├── favorite-movers/    
│   │   ├── marketing/          
│   │   ├── mover-search/       
│   │   ├── my-quotes/          
│   │   ├── profile/            
│   │   ├── received-requests/  
│   │   ├── request/             
│   │   ├── reviews/           
│   │   └── support/            
│   ├── effects/                  # 애니메이션 효과
│   │   ├── PaperPlane.tsx      
│   │   └── *.json               
│   └── layout/                   # 레이아웃 컴포넌트
│       ├── ChatRoom.tsx        
│       ├── ChatRoomList.tsx    
│       ├── DefaultLayout.tsx   
│       ├── Header.tsx        
│       ├── PageTitle.tsx        
│       └── SupportHub.tsx      
├── lib/                         # 유틸리티 및 설정
│   ├── actions/                 # 서버 액션
│   │   ├── favorite.action.ts  
│   │   ├── request.action.ts   
│   │   └── support.action.ts   
│   ├── api/                     # API 관련 함수
│   │   ├── auth/               
│   │   ├── community/          
│   │   ├── estimate/           
│   │   ├── estimate-calculator/
│   │   ├── favorite/           
│   │   ├── mover/              
│   │   ├── notification/      
│   │   ├── request/            
│   │   └── review/             
│   ├── firebase/                # Firebase 설정
│   │   ├── firebase.ts          
│   │   ├── firebaseChat.ts      
│   │   └── createChatRoomIfNotExists.ts 
│   ├── hooks/                   # 커스텀 훅
│   │   ├── useAuthError.ts    
│   │   ├── useClientProfilePostForm.ts
│   │   └── useClientProfileUpdateForm.ts 
│   ├── schemas/                 # Zod 스키마
│   │   ├── auth.schema.ts      
│   │   ├── client.schema.ts    
│   │   ├── dashboard.schema.ts 
│   │   └── common/             
│   ├── types/                   # TypeScript 타입 정의
│   │   ├── auth.types.ts       
│   │   ├── client.types.ts     
│   │   ├── community.types.ts  
│   │   ├── estimate.types.ts   
│   │   ├── firebase.types.ts    
│   │   ├── mover.types.ts       
│   │   ├── notification.types.ts 
│   │   ├── request.types.ts     
│   │   └── review.types.ts     
│   └── utils/                   # 유틸리티 함수
│       ├── address.util.ts      
│       ├── ai.utils.ts          
│       ├── auth.util.ts         
│       ├── date.util.ts         
│       ├── file.util.ts         
│       ├── format.util.ts       
│       ├── image.util.ts        
│       ├── notification.util.ts 
│       ├── price.util.ts        
│       ├── query.util.ts        
│       ├── rating.util.ts      
│       ├── search.util.ts       
│       └── validation.util.ts  
├── context/                     # React Context
│   ├── AuthContext.tsx         
│   ├── ChatContext.tsx         
│   ├── FormWizardContext.tsx    
│   ├── NotificationContext.tsx  
│   ├── SupportHubContext.tsx    
│   └── ToastConText.tsx         
├── constants/                   # 상수 정의
│   ├── index.ts                
│   ├── mover.constants.ts      
│   ├── profile.constants.ts     
│   └── received-requests.constants.ts 
├── i18n/                       # 국제화 설정
│   ├── navigation.ts           
│   ├── request.ts              
│   └── routing.ts              
└── assets/                     # 정적 자산
    └── images/                 
```

---

<div align="center">
  
**믿을 수 있는, 전문가 매칭 서비스(무빙)**

</div>
