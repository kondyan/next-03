"use server";

import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { redirect } from "next/dist/server/api-utils";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  console.log(title, image, content);

  let errors = [];

  if (!title) {
    errors.push("Title is required");
  } else if (!content) {
    errors.push("Content is required.");
  } else if (!image || image.size === 0) {
    errors.push("Image is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }
  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
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

  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  updatePostLikeStatus(postId, 2);
}
