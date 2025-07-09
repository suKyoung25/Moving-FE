"use server";

import nodemailer from "nodemailer";
import { delay } from "../../../../delay";

// 문의 지원 메일 전송 함수
export async function createSupport(_: unknown, formData: FormData) {
   await delay(2000); // (임시 지연용) 2초 대기 - 나중에 삭제 예정

   try {
      // 폼에서 전달받은 데이터 추출
      const email = {
         name: formData.get("name") as string,
         email: formData.get("email") as string,
         title: formData.get("title") as string,
         number: formData.get("number") as string,
         content: formData.get("content") as string,
      };

      // 파일 데이터 추출
      const file = formData.get("file") as File | null;

      const attachments = [];

      // 파일이 있을 경우 첨부파일 배열에 추가
      if (file && file.size > 0) {
         const buffer = Buffer.from(await file.arrayBuffer());

         attachments.push({
            filename: file.name,
            content: buffer,
            contentType: file.type,
         });
      }

      // Gmail SMTP 설정
      const transporter = nodemailer.createTransport({
         host: "smtp.gmail.com",
         port: 465,
         secure: true,
         auth: {
            user: process.env.SUPPORT_USER,
            pass: process.env.SUPPORT_PASS,
         },
      });

      // 메일 전송
      await transporter.sendMail({
         to: process.env.SUPPORT_USER,
         from: process.env.SUPPORT_USER,
         replyTo: email.email,
         subject: email.title,
         attachments,
         html: `
        <h2>제목 : ${email.title}</h2>
        <p>${email.content}</p>
        ${email.number ? `<p><strong>연락처:</strong> ${email.number}</p>` : ""}
        <p><strong>보낸 사람:</strong> ${email.name}</p>
        <p><strong>보낸 사람 이메일:</strong> ${email.email}</p>
      `,
      });

      // 성공 응답 반환
      return {
         success: true,
         message: "무빙에 문의 사항 전송 완료",
      };
   } catch (error) {
      // 에러 발생 시 콘솔 출력 및 실패 응답 반환
      console.error(error);
      return {
         success: false,
         message: "메일 전송 실패, 다음에 다시 시도해 주세요",
      };
   }
}
