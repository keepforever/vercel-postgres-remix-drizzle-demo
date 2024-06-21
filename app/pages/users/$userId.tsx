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
    <div className="p-6 flex flex-col">
      {/* <h3 className="text-3xl font-semibold text-black bg-green-300 px-3 py-1">
        {user.name}
      </h3> */}

      {/* User Nav */}

      <nav className="flex items-center gap-2">
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
      </nav>

      <Outlet />
    </div>
  );
}
