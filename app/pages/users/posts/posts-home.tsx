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
    <div className="p-6 flex flex-col">
      Posts Home
      <pre>{JSON.stringify(user, null, 2) || "nothing to preview"}</pre>
    </div>
  );
}
