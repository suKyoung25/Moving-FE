"use server";

export async function createMoverProfile(state: any, formData: FormData) {
  try {
    const profile = {
      image: formData.get("image") as string,
      alias: formData.get("alias") as string,
      career: Number(formData.get("career")),
      onelineIntoduction: formData.get("onelineIntoduction") as string,
      detailDescription: formData.get("detailDescription") as string,
      serviceType: formData.get("serviceType") as string,
      area: formData.get("area") as string,
    };

    console.log("서버에서 받은 데이터", profile);
    return { success: true };
  } catch (error) {
    console.error(error);
  }
}
