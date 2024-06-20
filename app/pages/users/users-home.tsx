import { json } from "@remix-run/react";
import { db } from "~/db.server";

export const loader = async () => {
  const users = await db.query.user.findMany();

  return json({ users: users || [] });
};

export default function UsersHome() {
  return (
    <div className="p-6 flex">
      <div className="p-2">
        <div className="font-medium text-black">
          Users Home; rendered into the Outlet of <code>users-layout.tsx</code>
        </div>

        <h3>Select a user to view their details</h3>
      </div>
    </div>
  );
}
