// lib/api/mover/getMoverProfile.ts
import { tokenFetch } from "@/lib/utils/fetch-client";
import { Mover } from "@/lib/types/auth.types";

/**
 * 현재 로그인한 기사님의 프로필 정보를 가져옵니다.
 */
export const getMoverProfile = async (): Promise<Mover> => {
  try {
    // 인증 실패 시 로그인 페이지로 리다이렉트
    const handleAuthFail = () => {
      console.warn('인증 실패: 로그인 페이지로 이동');
      window.location.href = '/login';
    };

    // 기사님 전용 프로필 엔드포인트 호출
    const data = await tokenFetch("/mover/profile", { 
      method: 'GET' 
    }, handleAuthFail);
    
    console.log('API 응답 데이터:', data); // 디버깅용
    
    // API 응답 구조 확인 및 데이터 추출
    const userData = data.data || data.user || data;
    
    // Mover 타입에 맞게 데이터 매핑
    const moverProfile: Mover = {
      id: userData.id || userData.userId || userData.moverId || '',
      name: userData.name || userData.userName || '',
      nickName: userData.nickName || userData.nickname || userData.name || '이름 없음',
      email: userData.email || '',
      phone: userData.phone || userData.phone || '',
      userType: 'mover', // 기사님 타입 고정
      
      // 기사님 전용 필드들
      career: Number(userData.career) || 0,
      serviceType: Array.isArray(userData.serviceType) ? userData.serviceType : [],
      serviceArea: Array.isArray(userData.serviceArea) ? userData.serviceArea : [],
      
      // 통계 정보
      favoriteCount: Number(userData.favoriteCount) || 0,
      estimateCount: Number(userData.estimateCount) || 0,
      averageReviewRating: Number(userData.averageReviewRating) || 0,
      reviewCount: Number(userData.reviewCount) || 0,
      
      // 소개 정보
      description: userData.description || "고객님의 물품을 안전하게 운송해 드립니다.",
      introduction: userData.introduction || null,
      profileImage: userData.profileImage || userData.profileImageUrl || null,
      
      // 프로필 완성도 체크 (필수 필드)
      isProfileCompleted: Boolean(
        userData.isProfileCompleted ?? 
        (userData.name && userData.email && userData.serviceType?.length > 0 && userData.serviceArea?.length > 0)
      ),
    };
    
    console.log('매핑된 기사님 프로필:', moverProfile); // 디버깅용
    
    return moverProfile;
    
  } catch (error) {
    console.error('기사님 프로필 조회 실패:', error);
    
    // 구체적인 에러 메시지 제공
    if (error && typeof error === 'object' && 'status' in error) {
      const fetchError = error as { status: number; body?: { message?: string } };
      
      switch (fetchError.status) {
        case 401:
          throw new Error('로그인이 필요합니다. 다시 로그인해 주세요.');
        case 403:
          throw new Error('기사님 정보에 접근할 권한이 없습니다.');
        case 404:
          throw new Error('기사님 프로필을 찾을 수 없습니다.');
        case 500:
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        default:
          throw new Error(fetchError.body?.message || `프로필 조회 실패 (${fetchError.status})`);
      }
    }
    
    if (error instanceof Error) {
      throw new Error(`프로필 조회 실패: ${error.message}`);
    }
    
    throw new Error('프로필 정보를 불러오는데 실패했습니다.');
  }
};

/**
 * 기사님 프로필 정보를 업데이트합니다.
 */
export const updateMoverProfile = async (profileData: Partial<Mover>): Promise<Mover> => {
  try {
    const handleAuthFail = () => {
      window.location.href = '/login';
    };

    // 업데이트할 데이터 정리
    const updateData = {
      name: profileData.name,
      nickName: profileData.nickName,
      phone: profileData.phone,
      description: profileData.description,
      introduction: profileData.introduction,
      career: profileData.career,
      serviceType: profileData.serviceType,
      serviceArea: profileData.serviceArea,
      profileImage: profileData.profileImage,
    };

    // null/undefined 값 제거
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] == null) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const data = await tokenFetch("/mover/profile", {
      method: 'PATCH',
      body: updateData as unknown as BodyInit,
    }, handleAuthFail);
    
    // 업데이트된 데이터를 getMoverProfile과 같은 방식으로 매핑
    const userData = data.data || data.user || data;
    
    return {
      ...userData,
      userType: 'mover',
      favoriteCount: Number(userData.favoriteCount) || 0,
      estimateCount: Number(userData.estimateCount) || 0,
      averageReviewRating: Number(userData.averageReviewRating) || 0,
      reviewCount: Number(userData.reviewCount) || 0,
      description: userData.description || "고객님의 물품을 안전하게 운송해 드립니다.",
      serviceArea: Array.isArray(userData.serviceArea) ? userData.serviceArea : [],
      serviceType: Array.isArray(userData.serviceType) ? userData.serviceType : [],
      // 프로필 완성도 업데이트
      isProfileCompleted: Boolean(
        userData.isProfileCompleted ?? 
        (userData.name && userData.email && userData.serviceType?.length > 0 && userData.serviceArea?.length > 0)
      ),
    };
    
  } catch (error) {
    console.error('기사님 프로필 업데이트 실패:', error);
    
    if (error && typeof error === 'object' && 'status' in error) {
      const fetchError = error as { status: number; body?: { message?: string } };
      throw new Error(fetchError.body?.message || '프로필 업데이트에 실패했습니다.');
    }
    
    throw new Error('프로필 업데이트에 실패했습니다.');
  }
};

/**
 * 기사님 프로필 존재 여부 확인
 */
export const checkMoverProfileExists = async (): Promise<boolean> => {
  try {
    await getMoverProfile();
    return true;
  } catch (error) {
    console.warn('기사님 프로필 확인:', error);
    return false;
  }
};