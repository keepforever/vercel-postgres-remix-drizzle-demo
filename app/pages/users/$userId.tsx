import type { LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/user.server";
import clsx from "clsx";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId as string;
  const fetchedUser = await getUser(Number(userId));

  return json({ user: fetchedUser });
};

export default function User() {
  const { user } = useLoaderData<typeof loader>();

  if (!user) return null;

  return (
    <div className="flex flex-col">
      <h3 className="text-3xl font-semibold text-black bg-green-300 px-3 py-1">
        {user.name}
      </h3>

      {/* User Nav */}

      <nav className="flex items-center gap-4 p-2">
        <NavLink
          to="posts"
          className={({ isActive }) =>
            clsx("text-lg", {
              underline: isActive,
              "": !isActive,
            })
          }
        >
          Posts
        </NavLink>

        <NavLink
          to={`/users/${user.id}/posts/new`}
          className={({ isActive }) =>
            clsx(
              "bg-green-300 hover:bg-green-400 text-gray-800 py-1 px-2 rounded text-xs transition-colors duration-200 ease-in-out",
              {
                "bg-green-500 text-white": isActive,
              }
            )
          }
        >
          Create Post
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
