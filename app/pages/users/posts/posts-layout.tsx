import { Link, Outlet } from "@remix-run/react";

export default function UsersLayout() {
  return (
    <div className="p-6">
      <div className="text-xl font-medium text-black bg-red-300 px-3 py-1">
        Posts Layout, Outlet below
      </div>

      <nav>
        <Link to="new" className="text-blue-500 underline text-2xl">
          New Post
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}
