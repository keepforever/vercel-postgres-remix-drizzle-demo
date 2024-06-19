import type { MetaFunction } from "@remix-run/node";
import { db } from "../db.server";
import { user } from "src/schema";
import {
  Form,
  Link,
  json,
  useActionData,
  useLoaderData,
} from "@remix-run/react";

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

  return json({
    message: "The following user was added successfully",
    createdUser: resp[0],
  });
};

export const loader = async () => {
  const users = await db.query.user.findMany();

  return json({ users: users || [] });
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">
        Hello Remix, Drizzle, Postgresql
      </h1>

      {/* Throw client sentry error */}

      <div className="flex items-center gap-2 flex-wrap">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={() => {
            throw new Error("Some Custom Message");
          }}
        >
          Throw Client Side Error
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Link to="/test-error">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Test Serverside Error in Loader
          </button>
        </Link>
      </div>

      {/* Add User */}

      <Form method="post">
        <button
          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Add User
        </button>
      </Form>

      {actionData && (
        <p className="text-green-600 font-semibold">{actionData.message}</p>
      )}

      {actionData && (
        <div className="flex flex-col gap-2">
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
      {/* Users List */}
      {/* To nuke users */}
      {/* DELETE FROM project1_user; */}
      <div className="mt-4">
        <h2 className="font-semibold">Users List</h2>
        <ul>
          {loaderData.users.map((user) => (
            <li key={user.id}>
              <span className="font-semibold">ID:</span> {user.id} -{" "}
              <span className="font-semibold">Name:</span> {user.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
