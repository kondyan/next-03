"use server";

import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(
  prevState: { errors?: string[] | undefined } | null,
  formData: FormData
) {
  const title = formData.get("title")?.toString() ?? "";
  const image = (formData.get("image") as File) ?? "";
  const content = formData.get("content")?.toString() ?? "";

  console.log(title, image, content);

  const errors = [];

  if (!title) {
    errors.push("Title is required");
  } else if (!content) {
    errors.push("Content is required.");
  } else if (!image || !(image instanceof File) || image.size === 0) {
    errors.push("Image is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }
  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    console.log(error);
    throw new Error(
      "Image upload failed, post was not created. Please try again later."
    );
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: 1,
  });

  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function togglePostLikeStatus(postId: number) {
  updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
}
