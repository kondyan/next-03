"use client";

import FormSubmit from "@/components/form-submit";
import { useActionState } from "react";

type State = {
  errors?: string[] | undefined;
} | null;

export type Action = (
  state: Awaited<State>,
  payload: FormData
) => State | Promise<State>;

export default function PostForm({ action }: { action: Action }) {
  const [state, formAction] = useActionState<State, FormData>(action, {});
  return (
    <>
      <h1>Create a new post</h1>
      <form action={formAction}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
            required
          />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows={5} required />
        </p>
        <FormSubmit />
        {state?.errors && (
          <ul className="form-errors">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}
