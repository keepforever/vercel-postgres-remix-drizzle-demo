import { Link, json, useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { useUserLayoutData } from "~/pages/users/hooks";

export const loader = async () => {
  const users = await db.query.user.findMany();

  return json({ users: users || [] });
};

export default function UsersHome() {
  const loaderData = useLoaderData<typeof loader>();
  const slashUsersMatch = useUserLayoutData();

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

        <h3 className="mt-4 font-semibold">Loader Data From Parent Route</h3>
        <p>
          Could have been any parent or child route that was matched on the
          page, but, I targeted
          <code>/users</code> in this case.
        </p>

        <pre>
          {JSON.stringify(slashUsersMatch, null, 2) || "nothing to preview"}
        </pre>
      </div>
    </div>
  );
}
