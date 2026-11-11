"use server";

export async function uploadRide(formData: FormData): Promise<void> {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Input is not a file.");
  if (file.size === 0) return;
  console.log(file.name, file.size);
}
