import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import clsx from "clsx";
import { Form, NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import { deleteUser, getAllUsers, insertUser } from "~/utils/user.server";
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const intent = formData.get("intent") as string;

  switch (intent) {
    case "add-user": {
      await insertUser({
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as unknown as "admin" | "customer",
      });

      return json({
        message: "The following user was added successfully",
      });
    }

    case "delete-user": {
      await deleteUser(Number(formData.get("id") as string));
      return json({ message: "User deleted successfully" });
    }

    default:
      return json({ message: "Invalid Intent" }, { status: 400 });
  }
};

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
            <ul className="space-y-2">
              {loaderData.users.map((user) => (
                <li key={user.id}>
                  <NavLink
                    to={`/users/${user.id}`}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center py-2 px-2 rounded justify-between border border-gray-300 overflow-hidden gap-4",
                        {
                          "bg-gray-200 text-gray-700 w-full hover:bg-gray-300":
                            isActive,
                          "text-gray-500 hover:bg-gray-200 hover:text-gray-700":
                            !isActive,
                        }
                      )
                    }
                  >
                    <div className="truncate flex-1">{user.name}</div>

                    {/* <Form method="post" className="flex-shrink-0"> */}
                    <Form method="post" className="flex-shrink-0">
                      <input type="hidden" name="id" value={user.id} />
                      <input type="hidden" name="intent" value="delete-user" />
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded"
                        type="submit"
                      >
                        Delete
                      </button>
                    </Form>
                  </NavLink>
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
