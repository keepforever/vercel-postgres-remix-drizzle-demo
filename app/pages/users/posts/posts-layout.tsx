import { LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { getPostsByUserId } from "~/utils/posts.server";
import { getUser } from "~/utils/user.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId as string;
  const fetchedUser = await getUser(Number(userId));
  const userPosts = await getPostsByUserId(Number(userId));

  return json({ user: fetchedUser, posts: userPosts });
};

export default function PostsLayout() {
  const { user, posts } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-8 flex-wrap pt-2">
        {/* Posts list */}
        <div className="flex flex-col items-center gap-2 flex-1">
          {/* Create Post Button */}

          <NavLink
            to={`new`}
            className={({ isActive }) =>
              clsx(
                "bg-green-500 hover:bg-green-600 text-gray-800 py-2 px-4 rounded w-full",
                {
                  "bg-green-700 text-white": isActive,
                }
              )
            }
          >
            Create Post
          </NavLink>

          {/* Posts List */}

          {!posts?.length ? (
            <div className="">No posts found for this user</div>
          ) : (
            posts.map((post) => {
              return (
                <NavLink
                  key={post.id}
                  to={`/users/${user?.id}/posts/${post.id}`}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center py-2 px-2 rounded justify-between border border-gray-300 overflow-hidden gap-4 w-full",
                      {
                        "bg-gray-200 text-gray-700 w-full hover:bg-gray-300":
                          isActive,
                        "text-gray-500 hover:bg-gray-200 hover:text-gray-700":
                          !isActive,
                      }
                    )
                  }
                >
                  <div className="truncate flex-1">{post.name}</div>

                  {/* <Form method="post" className="flex-shrink-0">
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="intent" value="delete-post" />
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gray-500 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded"
                      type="submit"
                    >
                      Delete
                    </button>
                  </Form> */}
                </NavLink>
              );
            })
          )}
        </div>

        {/* User Details */}
        <div className="flex flex-col flex-[5]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
