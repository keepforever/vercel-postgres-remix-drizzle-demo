import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { getPostsByUserId } from "~/utils/posts.server";
import { getUser } from "~/utils/user.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId as string;
  const fetchedUser = await getUser(Number(userId));
  const userPosts = await getPostsByUserId(Number(userId));

  return json({ user: fetchedUser, posts: userPosts });
};

export default function User() {
  const { user } = useLoaderData<typeof loader>();

  if (!user) return null;

  return (
    <div className="flex flex-col text-2xl">
      Select a post to see it's details
    </div>
  );
}
