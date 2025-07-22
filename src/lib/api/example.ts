// 이 폴더는 프론트엔드에서 TanStack Query(구 React Query)를 활용한 API 요청 관리를 담당합니다.
// server actions(또는 API 라우트)와의 연결을 기반으로, 각 도메인별로 데이터 조회(query) 및 변경(mutation) 로직을 나누어 구성합니다.

// src/
// └── lib/
//     └── api/
//         └── auth/
//             ├── requests/
//             │   ├── getMe.ts
//             │   ├── login.ts
//             │   └── logout.ts
//                 └── postSomething.ts
//             ├── query.ts         // useMe 등
//             ├── mutation.ts      // postSomething 등
