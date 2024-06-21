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
    <div className="flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Post without join
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-sm">
              <strong className="text-gray-600">Post Name:</strong>
              <span>{data.post.name}</span>
            </li>
            <li className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-sm">
              <strong className="text-gray-600">Author ID:</strong>
              <span>{data.post.authorId}</span>
            </li>
            <li className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-sm">
              <strong className="text-gray-600">Created At:</strong>
              <span>{new Date(data.post.createdAt).toLocaleString()}</span>
            </li>
            {data.post.updatedAt && (
              <li className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-sm">
                <strong className="text-gray-600">Updated At:</strong>
                <span>{new Date(data.post.updatedAt).toLocaleString()}</span>
              </li>
            )}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Post with join
          </h2>
          <ul className="space-y-4">
            <li className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <span className="text-gray-600">
                {postWithAuthor?.post?.name}
              </span>
              <span className="text-gray-600">by</span>
              <span className="text-gray-800 font-semibold">
                {postWithAuthor?.user?.name}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
