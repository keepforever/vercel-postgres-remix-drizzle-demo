import { Outlet } from "@remix-run/react";

export default function UsersLayout() {
  return (
    <div className="p-6">
      <div className="text-xl font-medium text-black bg-blue-300 px-3 py-1">
        Posts Layout, Outlet below
      </div>

      <Outlet />
    </div>
  );
}
