import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/user.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId as string;
  const fetchedUser = await getUser(Number(userId));

  return json({ user: fetchedUser });
};

export default function User() {
  const { user } = useLoaderData<typeof loader>();

  if (!user) return null;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div>
        <div className="text-xl font-medium text-black">User</div>
        <p className="text-gray-500">ID: {user.id}</p>
        <p className="text-gray-500">Name: {user.name}</p>
        <p className="text-gray-500">Email: {user.email}</p>
        <p className="text-gray-500">Role: {user.role}</p>
        <p className="text-gray-500">Created At: {user.createdAt}</p>
        <p className="text-gray-500">Updated At: {user.updatedAt}</p>
      </div>
    </div>
  );
}
