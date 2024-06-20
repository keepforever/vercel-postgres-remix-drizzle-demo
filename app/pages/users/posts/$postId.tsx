import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPostById, getPostWithAuthor } from "~/utils/posts.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const postId = params.postId as string;
  const post = await getPostById(Number(postId));
  const postWithAuthor = await getPostWithAuthor(Number(postId));

  if (!post) {
    throw new Error("Post not found");
  }

  return json({ post, postWithAuthor });
};

export default function User() {
  const data = useLoaderData<typeof loader>();
  const postWithAuthor = data.postWithAuthor?.[0];

  return (
    <div className="p-6 flex flex-col justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Post Details</h1>
      <h2 className="text-xl font-bold mb-4">Post without join</h2>
      <ul className="bg-white p-8 rounded-lg shadow-md w-full max-w-md list-disc list-inside">
        <li>
          <strong>Post Name:</strong> {data.post.name}
        </li>
        <li>
          <strong>Author ID:</strong> {data.post.authorId}
        </li>
        <li>
          <strong>Created At:</strong>{" "}
          {new Date(data.post.createdAt).toLocaleString()}
        </li>
        {data.post.updatedAt && (
          <li>
            <strong>Updated At:</strong>{" "}
            {new Date(data?.post?.updatedAt).toLocaleString()}
          </li>
        )}
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-4">Post with join</h2>

      <ul className="bg-white p-8 rounded-lg shadow-md w-full max-w-md list-disc list-inside">
        <li>
          {postWithAuthor.post.name} by {postWithAuthor.user?.name}
        </li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-4">
        Preview of getPostWithAuthor
      </h2>

      <pre>
        {JSON.stringify(data.postWithAuthor, null, 2) || "nothing to preview"}
      </pre>
    </div>
  );
}
