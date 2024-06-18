import type { MetaFunction } from "@remix-run/node";
import { db } from "../db.server";
import { user } from "src/schema";
import { Form, json, useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async () => {
  const randomEmailStringPrefix = Math.random().toString(36).substring(7);
  const randomNameString = Math.random().toString(36).substring(7);

  const resp = await db
    .insert(user)
    .values({
      name: randomNameString,
      email: `${randomEmailStringPrefix}@example.com`.toLowerCase(),
      password: "password",
      role: "admin",
    })
    .returning({
      id: user.id,
      name: user.name,
    });

  return json({ message: "User added", createdUser: resp[0] });
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="font-sans p-4">
      <Form method="post">
        <button type="submit">add user</button>
      </Form>
      {actionData && <p>{actionData.message}</p>}

      {actionData && (
        <div className="flex flex-col items-center gap-2">
          <div>
            <span className="font-semibold">ID:</span>{" "}
            {actionData.createdUser.id}
          </div>
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {actionData.createdUser.name}
          </div>
        </div>
      )}
    </div>
  );
}
