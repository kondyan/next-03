import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";

export default function NewPostPage() {
  async function createPost(formData: FormData) {
    "use server";
    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");

    console.log(title, image, content);

    let errors = [];

    if (!title) {
      errors.push("Title is required");
    } else if (!content) {
      errors.push("Content is required.");
    } else if (!image) {
      errors.push("Image is required.");
    }

    if (errors.length > 0) {
      return { errors };
    }

    await storePost({
      imageUrl: "",
      title,
      content,
      userId: 1,
    });

    redirect("/feed");
  }
}
