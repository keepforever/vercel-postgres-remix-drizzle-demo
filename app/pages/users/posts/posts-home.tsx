import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { getPostsByUserId } from "~/utils/posts.server";
import { getUser } from "~/utils/user.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId as string;
  const fetchedUser = await getUser(Number(userId));
  const userPosts = await getPostsByUserId(Number(userId));

  return json({ user: fetchedUser, posts: userPosts });
};

export default function User() {
  const { user, posts } = useLoaderData<typeof loader>();

  if (!user) return null;

  return (
    <div className="p-6 flex flex-col space-y-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-700">Posts Home</h1>
      <div className="text-lg font-medium text-gray-600">
        User Name: {user?.name}
      </div>

      <h1 className="text-xl font-bold text-gray-700">Posts</h1>

      {posts.map((post) => {
        return (
          <div key={post.id} className="p-2 bg-white rounded-lg shadow-sm">
            <Link to={`/users/${user.id}/posts/${post.id}`}>{post.name}</Link>
          </div>
        );
      })}
    </div>
  );
}
