import { Link, json, useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";

export const loader = async () => {
  const users = await db.query.user.findMany();

  return json({ users: users || [] });
};

export default function UsersHome() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="p-6 flex">
      <div className="p-2">
        <div className="font-medium text-black">
          Users Home; rendered into the Outlet of <code>users-layout.tsx</code>
        </div>

        {/* Users list with link */}
        <div className="mt-4">
          <h2 className="font-semibold">Users List</h2>
          <ul>
            {loaderData.users.map((user) => (
              <li key={user.id} className="flex items-center gap-2 mb-2">
                <span className="font-semibold">ID:</span> {user.id} -{" "}
                <span className="font-semibold">Name:</span> {user.name}
                <Link
                  className="ml-2 text-blue-500 underline"
                  to={`${user.id}`}
                >
                  Visit
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
