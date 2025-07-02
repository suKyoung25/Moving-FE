// 'use client'
// import { useActionState } from "react";
// import SupportInput from "./common/SupportInput";
// import SupportSubmitButton from "./common/SupportSubmitButton";
// import {createSupport} from "@/actions/support/support.action"

// export default function SupportForm() {

//     const [state, formData, isPending] = useActionState(createSupport,null);

//     return (
//         <form
//             action={formData}
//             className="w-full flex flex-col"
//         >
//             <div className="md:flex md:gap-10 lg:gap-20">
//                 <SupportInput name="name" label="작성자 성함" important={true} />
//                 <SupportInput name="email" label="이메일" important={true} />
//             </div>
//             <div className="md:flex md:gap-10 lg:gap-20">
//                 <SupportInput name="title" label="글제목" important={true} />
//                 <SupportInput name="number" label="연락처" important={false} />
//             </div>
//             <div>
//                 <SupportInput
//                     name="content"
//                     label="문의내용"
//                     important={true}
//                     textarea={true}
//                 />
//                 <SupportInput
//                     name="file"
//                     label="첨부파일업로드"
//                     important={false}
//                     fileupload={true}
//                 />
//             </div>
//             <div className="flex justify-center mt-12">
//                <SupportSubmitButton />
//             </div>
//         </form>
//     )
// }


