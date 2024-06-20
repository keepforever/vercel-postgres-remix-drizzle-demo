import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, json, useLoaderData } from "@remix-run/react";
import { getAllUsers } from "~/utils/user.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = await getAllUsers();
  return json({ myDataFromUsersLayout: request.url, users });
};

export default function UsersLayout() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="pt-2 h-screen">
      <div className="text-xl font-medium text-black bg-blue-300 px-3 py-1">
        Users Layout, Outlet below
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* Users list */}
        <div className="flex flex-col flex-1">
          <div className="mt-4">
            <h2 className="font-semibold">Users List</h2>
            <ul>
              {loaderData.users.map((user) => (
                <li key={user.id} className="flex items-center gap-2 mb-2">
                  {user.name}
                  <Link
                    className="ml-2 text-blue-500 underline"
                    to={`/users/${user.id}`}
                  >
                    Visit
                  </Link>
                  <Form method="post">
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="intent" value="delete-user" />
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                      type="submit"
                    >
                      Delete
                    </button>
                  </Form>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Details */}
        <div className="flex flex-col flex-[5]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
