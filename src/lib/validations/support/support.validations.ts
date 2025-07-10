import * as supportSchema from './support.schema'

// 작성자 검증
export function supportNameValidate(name : string) {
    return supportSchema.supportNameSchema.safeParse(name);
}

// 이메일 검증
export function supportEmailValidate(email : string) {
    return supportSchema.supportEmailSchema.safeParse(email);
}

// 글 제목 검증
export function supportTitleValidate(title : string) {
    return supportSchema.supportTitleSchema.safeParse(title);
}

// 연락처 검증
export function supportPhoneValidate(phone : string) {
    return supportSchema.supportPhoneSchema.safeParse(phone);
}

// 글 내용 검증
export function supportContentValidate(content : string) {
    return supportSchema.supportContentSchema.safeParse(content);
}

// 파일 업로드 검증
export function supportFileValidate(file : File) {
    return supportSchema.supportFilesSchema.safeParse(file);
}