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
    <div className="p-6 flex">
      <div className="bg-slate-200 p-2 rounded-md shadow-md">
        <div className="text-xl font-medium text-black">User</div>
        <p className="">ID: {user.id}</p>
        <p className="">Name: {user.name}</p>
        <p className="">Email: {user.email}</p>
        <p className="">Role: {user.role}</p>
        <p className="">Created At: {user.createdAt}</p>
        <p className="">Updated At: {user.updatedAt}</p>
      </div>
    </div>
  );
}
