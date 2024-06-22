import { json, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useParams, redirect } from "@remix-run/react";
import {
  deletePost,
  getPostById,
  getPostWithAuthor,
} from "~/utils/posts.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "delete-post": {
      await deletePost(Number(formData.get("postId") as string));
      return redirect(`/users/${formData.get("userId")}/posts`);
    }
    default:
      return json({ message: "Invalid Intent" }, { status: 400 });
  }
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const postId = params.postId as string;
  const post = await getPostById(Number(postId));
  const postWithAuthor = await getPostWithAuthor(Number(postId));

  if (!post) {
    throw new Error("Post not found");
  }

  return json({ post, postWithAuthor });
};

const DeletePostButton = () => {
  const params = useParams();
  return (
    <Form method="post">
      <input type="hidden" name="postId" value={params.postId} />
      <input type="hidden" name="userId" value={params.userId} />
      <input type="hidden" name="intent" value="delete-post" />
      <button
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-500 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded"
        type="submit"
      >
        Delete
      </button>
    </Form>
  );
};

export default function User() {
  const data = useLoaderData<typeof loader>();
  const postWithAuthor = data.postWithAuthor?.[0];
  const post = data.post;

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{post.name}</h2>
          <p className="text-lg text-gray-700">{post.content}</p>
        </section>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <p className="text-lg text-gray-700">
            {" by "}
            <span className="text-indigo-600">
              {postWithAuthor?.user?.name}
            </span>
          </p>
          <DeletePostButton />
        </div>
      </div>
    </div>
  );
}
