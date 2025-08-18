[**한국어**](/README.md) | [English](/docs/en/README.md) | [简体字](/docs/zh/README.md)

# Moving

<img width="3212" height="2023" alt="image" src="https://github.com/user-attachments/assets/a3260d6e-ac5c-4918-a846-bb25362c4798" />

---

## Table of Contents

- [Project Introduction](#project-introduction)
- [Key Features](#key-features)
- [Team Composition](#team-composition)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Detailed Features](#detailed-features)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

---

## Project Introduction

Moving is a smart moving comparison platform that helps users easily compare quotes from multiple drivers and choose the most suitable expert for their needs.

It simplifies the previously complex and opaque moving quote process, allowing users to quickly find experts who match their desired conditions (moving type, location, schedule, etc.).

Additionally, from the driver's perspective, efficient customer matching is possible, providing a transparent transaction environment and convenient service experience.

### Links
- **Team Notion**: [Go to](https://www.notion.so/4Team-Moving-Ops-Board-2153fde0e1948005ad04c1585430e77f)
- **Backend Repository**: [GitHub Repository](https://github.com/az0319h/6th-Moving-4Team-BE)

---

## Key Features

### Customer Features
- **AI Quote Calculator**: OpenAI GPT-4 based intelligent quote calculation system
- **Driver Search**: Location, service type, and rating-based filtering and sorting
- **Quote Request**: Step-by-step wizard-style quote request system
- **Quote Management**: Review received quotes, approve/reject, and track progress
- **Favorites**: Save and manage preferred drivers
- **Review System**: Write reviews and manage ratings after moving completion

### Driver Features
- **Quote Response**: Provide detailed quotes for received quote requests
- **Profile Management**: Manage company information, service areas, and career information
- **Received Request Management**: Request management through filtering and search
- **Review Management**: Check and respond to received reviews

### Common Features
- **Multi-language Support**: Complete support for Korean (default), English, and Chinese
- **Real-time Notifications**: Firebase-based real-time notification system
- **Community**: User communication and information sharing space
- **Customer Support**: Inquiry submission and file upload support
- **Social Login**: Google, Kakao, Naver social login support
- **Real-time Chat**: Real-time communication between customers and drivers

---
### Basic Features
<table>
  <thead>
    <tr>
      <th align="center">Login & Logout</th>
      <th align="center">Random Points</th>
      <th align="center">Photo Card Creation</th>
      <th align="center">Filter, Infinite Scroll</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/0fd8cbad-fcb1-4ef8-80c3-1f1890872548" alt="Login and Logout" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/0fd51b67-6e94-4edc-8a4b-78f71a0319c4" alt="Random Points" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/c69f5edc-e626-4c41-9c80-c4669cd7f5df" alt="Photo Card Creation" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/eb7fb19e-308b-49d4-9848-e54a34c9e9f4" alt="Filter Infinite Scroll" width="200">
      </td>
    </tr>
  </tbody>
</table>

### Transaction Features
<table>
  <thead>
    <tr>
      <th align="center">Photo Card Sales</th>
      <th align="center">Photo Card Edit</th>
      <th align="center">Photo Card Sales Removal</th>
      <th align="center">Photo Card Purchase</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/7746a772-e58f-4ae6-9935-2e3312ae3647" alt="Photo Card Sales" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/5dbc3427-2def-4205-b05a-c6230767d6fa" alt="Photo Card Edit" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/dd3f1d2e-54f2-4765-9a42-d72c9672908c" alt="Photo Card Sales Removal" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/392dda2b-aa79-4715-a9e7-e4ebc360dc10" alt="Photo Card Purchase" width="200">
      </td>
    </tr>
  </tbody>
</table>

### Notification and Exchange Features
<table>
  <thead>
    <tr>
      <th align="center">Notification Check</th>
      <th align="center">Exchange Request</th>
      <th align="center">Buyer's Exchange Request Cancel</th>
      <th align="center">Seller's Exchange Approval & Cancel</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/741a866e-f4cc-4fc3-9eba-54d511b05117" alt="Notification Check" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/67c8d1a3-545f-4d07-86c7-cd688d03678f" alt="Exchange Request" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/f51510c9-ad11-451b-89f4-ea125f667d5a" alt="Buyer's Exchange Request Cancel" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/1ae2e3f3-a830-46c5-8ea9-b1737db5f74f" alt="Seller's Exchange Approval & Cancel" width="200">
      </td>
    </tr>
  </tbody>
</table>

---

## Team Composition

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
          <img src="https://github.com/az0319h.png?size=100" width="100px" alt="Hong Seonghun"/>
          <br />
          <b>Hong Seonghun</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/fiivxyxxng">
          <img src="https://github.com/fiivxyxxng.png?size=100" width="100px" alt="Oh Hayoung"/>
          <br />
          <b>Oh Hayoung</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/writing-sky">
          <img src="https://github.com/writing-sky.png?size=100" width="100px" alt="Yang Seongkyung"/>
          <br />
          <b>Yang Seongkyung</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/suKyoung25">
          <img src="https://github.com/suKyoung25.png?size=100" width="100px" alt="Kim Sukyung"/>
          <br />
          <b>Kim Sukyung</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/jbinyim">
          <img src="https://github.com/jbinyim.png?size=100" width="100px" alt="Lim Jungbin"/>
          <br />
          <b>Lim Jungbin</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Shinmilli">
          <img src="https://github.com/Shinmilli.png?size=100" width="100px" alt="Shin Sumin"/>
          <br />
          <b>Shin Sumin</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/shimyubin">
          <img src="https://github.com/shimyubin.png?size=100" width="100px" alt="Shim Yubin"/>
          <br />
          <b>Shim Yubin</b>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center">
        <a href="https://pointed-afternoon-24b.notion.site/2173fde0e19480728178dce120cbdabb" target="_blank">Personal Report</a>
      </td>
      <td align="center">
        <a href="https://immediate-conga-b1b.notion.site/217fb120f2ad80ea85b2e44377f62a58" target="_blank">Personal Report</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/3-21788b3cb86180698299f89f0ee4ff53" target="_blank">Personal Report</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/21783b8d694c801db314d01f63cd68c4" target="_blank">Personal Report</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/217e8b00d07a8036a583ddb33c62345d" target="_blank">Personal Report</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/2177a895c9ac8039a81fc7aad5fdbaed" target="_blank">Personal Report</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/1c4c0886ab1380968ff8febb837182c7" target="_blank">Personal Report</a>
      </td>
    </tr>
  </tbody>
</table>

<details>
<summary><strong>Team Member's Main Work Content</strong></summary>
<div markdown="1">

- **Hong Seonghun**  
  - Received quotes page  
  - Sent quotes list page  
  - Rejected quotes list page  
  - Landing page  
  - Customer support page  
  - Received quotes and sent quotes detail page writing  

- **Oh Hayoung**  
  - Quote request page (moving type/moving date/address)  
  - Quote request in progress page  
  - Kakao address API  
  - Notification feature  

- **Yang Seongkyung**  
  - Global state management  
  - General user/driver login/signup components  
  - General user login/signup pages  
  - General user profile registration/edit pages  
  - Social login feature  
  - Profile dropdown menu in header  

- **Kim Sukyung**  
  - General user/driver profile components  
  - Driver login/signup pages  
  - Driver profile registration/edit pages  
  - Driver basic information edit page  
  - Social login feature  
  - Account withdrawal feature implementation  

- **Lim Jungbin**  
  - Pending quotes page  
  - Pending quotes detail page  
  - Received quotes page  
  - Received quotes detail page  

- **Shin Sumin**  
  - General user/non-member driver search page  
  - General user/non-member driver detail page  
  - Driver my page  

- **Shim Yubin**  
  - Button component implementation  
  - Favorite drivers page  
  - Writable reviews page  
  - My written reviews page  
  - Multi-language feature  

</div>
</details>

---

## System Architecture

<img width="3212" height="2023" alt="fa68b90569ee2253" src="https://github.com/user-attachments/assets/b271e73e-7096-412c-8cfa-a7b8318607f2" />

---

## Technology Stack

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

## Detailed Features

### Core Features Detail

### AI Quote Calculator
- **OpenAI GPT-4** based intelligent quote calculation
- Considers moving type, distance, date, elevator availability, etc.
- Provides real-time basic quote and AI quote comparison
- Fallback quote system when quota is exceeded

### Real-time Chat
- **Firebase Realtime Database** based
- Real-time message synchronization
- Unread message notifications
- Chat room join/leave management
- System message support

### Driver Search
- Location-based search
- Service type filtering (small/home/office)
- Sorting by rating, review count, quote count
- Favorites feature
- Infinite scroll pagination

### Quote Request System
- Step-by-step wizard format
- Real-time form validation
- Draft save functionality (local/server)
- Progress tracking

## Multi-language Support

This project fully supports the following languages:

- 🇰🇷 **Korean (ko)** - Default language
- 🇺🇸 **English (en)**
- 🇨🇳 **Chinese (zh)**

You can change the language through the settings in the hub at the bottom right using the locale parameter in the URL.

### Translation File Location
```
messages/
├── ko.json    # Korean translation
├── en.json    # English translation
└── zh.json    # Chinese translation
```

## Authentication System

### Supported Login Methods
- **Email/Password** login
- **Google** social login
- **Kakao** social login
- **Naver** social login

### User Types
- **Client** - General customers
- **Mover** - Drivers

## Responsive Design

- **Mobile-first** design
- **Tablet** and **Desktop** optimization
- **Tailwind CSS** based responsive layout
- **Accessibility** consideration (ARIA labels, keyboard navigation)

## Performance Optimization

- **Next.js App Router** based server components
- **React Suspense** and **lazy loading**
- **TanStack Query** caching strategy
- **Image optimization** (Next.js Image component)
- **Code splitting** and **bundle optimization**

---

## Troubleshooting

### 1. Korean Input Chat Duplicate Send Issue (Mac / Safari / macOS Environment)

**Problem Situation**  
- In Windows environment, chat sends normally with one Enter key press  
- In Mac / Safari / macOS environment, when pressing Enter key after Korean composition input, the same message is sent twice  
- Mainly occurs when using composition input (IME, Input Method Editor)  

**Cause Analysis**  
- In macOS, Korean input event flow is as follows:  
  `keydown → compositionstart → compositionupdate → compositionend → keydown`  
- After compositionend, keydown event occurs again, causing Enter event to be called twice  
- Current message sending logic only detects Enter key events, so Enter is called twice after composition completion, causing duplicate sending  

**Solution**  
- Ignore Enter events during Korean input composition (`compositionstart` ~ `compositionend`)  
- Check `isComposing` state in `onKeyDown` event handler to determine message sending  
- Tested identical behavior across Windows / Mac / mobile environments

```typescript
const [isComposing, setIsComposing] = useState(false);

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
if (e.key === "Enter" && !e.shiftKey && !isComposing) {
e.preventDefault();
sendMessage();
}
};

 <textarea onCompositionStart={() => setIsComposing(true)} onCompositionEnd={() => setIsComposing(false)} onKeyDown={handleKeyDown} />
```

## 2. Quote Request Form Draft Save and Synchronization Issue

### Problem Situation
- When requesting quotes, form intermediate state is automatically saved to server, designed to load server-saved draft initially and update server through `saveDraft` logic when form state updates  
- However, despite `savedDraft` reflecting the latest state, when querying draft again, previous state is returned, causing latest saved state not to be reflected on refresh or page navigation  

### Cause Analysis
- Using `debouncedSave` caused timing issues where latest state wasn't fully reflected to server  
- React Query application caused previous draft cache to persist, preventing latest data reflection  
- `currentStep` value wasn't initialized in context and was reset to previous state, causing mismatch between server draft and local state  

### Solution
- **Remove debouncedSave**: Eliminate timing issues and change to immediate save  
- **Apply dual save structure**: Update both `localStorage` and server draft when form state updates → maintain identical state on refresh/page navigation  
- **Initial loading priority**: Prioritize `localStorage` value if it exists, otherwise load server draft as initial state  
- **Improve currentStep synchronization**: Initialize based on server draft's `currentStep` and ensure both local/server reflection on client updates  

---

## Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── [locale]/                 # Multi-language routing (ko, en, zh)
│   │   ├── (marketing)/          # Marketing page (landing page)
│   │   ├── (with-guest)/         # Guest-only pages (login/signup)
│   │   ├── (with-public)/        # Public pages
│   │   │   ├── community/        # Community
│   │   │   ├── estimate-calculator/ # AI quote calculator
│   │   │   ├── mover-search/     # Driver search
│   │   │   └── support/          # Customer support
│   │   └── (with-protected)/     # Authentication required pages
│   │       └── dashboard/        # Dashboard (for drivers)
│   │       └── favorite-movers/  # Favorites
│   │       └── my-quotes/        # My quote management
│   │       └── profile/          # Profile management
│   │       └── received-requests/# Received request management
│   │       └── request/          # Quote request
│   │       └── reviews/          # Review management
│   └── api/                      # API routes
│       ├── auth/                 
│       ├── google-maps/        
│       ├── openai/              
│       └── sentry-example-api/   
├── components/                   # Reusable components
│   ├── common/                   # Common components
│   │   ├── Chatbutton.tsx       
│   │   ├── ConfirmModal.tsx     
│   │   ├── EmptyState.tsx       
│   │   ├── Pagination.tsx       
│   │   ├── Spinner.tsx          
│   │   └── ToastPopup.tsx       
│   ├── domain/                   # Domain-specific components
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
│   ├── effects/                  # Animation effects
│   │   ├── PaperPlane.tsx      
│   │   └── *.json               
│   └── layout/                   # Layout components
│       ├── ChatRoom.tsx        
│       ├── ChatRoomList.tsx    
│       ├── DefaultLayout.tsx   
│       ├── Header.tsx        
│       ├── PageTitle.tsx        
│       └── SupportHub.tsx      
├── lib/                         # Utilities and configuration
│   ├── actions/                 # Server actions
│   │   ├── favorite.action.ts  
│   │   ├── request.action.ts   
│   │   └── support.action.ts   
│   ├── api/                     # API-related functions
│   │   ├── auth/               
│   │   ├── community/          
│   │   ├── estimate/           
│   │   ├── estimate-calculator/
│   │   ├── favorite/           
│   │   ├── mover/              
│   │   ├── notification/      
│   │   ├── request/            
│   │   └── review/             
│   ├── firebase/                # Firebase configuration
│   │   ├── firebase.ts          
│   │   ├── firebaseChat.ts      
│   │   └── createChatRoomIfNotExists.ts 
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuthError.ts    
│   │   ├── useClientProfilePostForm.ts
│   │   └── useClientProfileUpdateForm.ts 
│   ├── schemas/                 # Zod schemas
│   │   ├── auth.schema.ts      
│   │   ├── client.schema.ts    
│   │   ├── dashboard.schema.ts 
│   │   └── common/             
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.types.ts       
│   │   ├── client.types.ts     
│   │   ├── community.types.ts  
│   │   ├── estimate.types.ts   
│   │   ├── firebase.types.ts    
│   │   ├── mover.types.ts       
│   │   ├── notification.types.ts 
│   │   ├── request.types.ts     
│   │   └── review.types.ts     
│   └── utils/                   # Utility functions
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
├── constants/                   # Constant definitions
│   ├── index.ts                
│   ├── mover.constants.ts      
│   ├── profile.constants.ts     
│   └── received-requests.constants.ts 
├── i18n/                       # Internationalization settings
│   ├── navigation.ts           
│   ├── request.ts              
│   └── routing.ts              
└── assets/                     # Static assets
    └── images/                 
```

---

<div align="center">
  
**Trusted, Expert Matching Service (Moving)**

</div>
