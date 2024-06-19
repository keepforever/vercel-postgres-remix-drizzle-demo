import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, json } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ myDataFromUsersLayout: request.url });
};

export default function UsersLayout() {
  return (
    <div className="p-6">
      <div className="text-xl font-medium text-black bg-blue-300 px-3 py-1">
        Users Layout, Outlet below
      </div>

      <Outlet />
    </div>
  );
}
