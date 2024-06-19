import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPostById } from "~/utils/posts.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const postId = params.postId as string;
  const post = await getPostById(Number(postId));

  if (!post) {
    throw new Error("Post not found");
  }

  return json({ post });
};

export default function User() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-6 flex flex-col justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Post Details</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <div className="text-gray-700 font-bold mb-2">Post Name</div>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {data.post.name}
          </div>
        </div>
        <div className="mb-4">
          <div className="text-gray-700 font-bold mb-2">Author ID</div>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {data.post.authorId}
          </div>
        </div>
        <div className="mb-4">
          <div className="text-gray-700 font-bold mb-2">Created At</div>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {new Date(data.post.createdAt).toLocaleString()}
          </div>
        </div>

        {data.post.updatedAt && (
          <div className="mb-4">
            <div className="text-gray-700 font-bold mb-2">Updated At</div>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
              {new Date(data?.post?.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
