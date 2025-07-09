/**
 * validateEmail
 *
 * 이메일이 8자 이상이며, 올바른 이메일 형식인지 검증하는 함수
 *
 * @param email 검사할 이메일 문자열
 * @returns 유효하면 true, 아니면 false
 */
// export function validateEmail(email: string): {
//   success: boolean;
//   message: string;
// } {
//   const schema = z
//     .string()
//     .email("올바른 이메일 형식이 아닙니다.")
//     .min(8, "이메일은 8자 이상이어야 합니다.");

//   const result = schema.safeParse(email);

//   if (result.success) {
//     return { success: true, message: "유효한 이메일입니다." };
//   } else {
//     // 여러 이슈가 있을 수 있지만, 첫 번째 메시지만 반환
//     return { success: false, message: result.error.issues[0].message };
//   }
// }

// 위 작성은 예시 작성입니다.
