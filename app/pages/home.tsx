import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { db } from "../db.server";
import {
  Form,
  Link,
  json,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { deleteUser, insertUser } from "~/utils/user.server";
import { faker } from "@faker-js/faker";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export function getNewUserPayload() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(["admin", "customer"]),
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const intent = formData.get("intent") as string;

  switch (intent) {
    case "add-user": {
      await insertUser({
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as unknown as "admin" | "customer",
      });

      return json({
        message: "The following user was added successfully",
      });
    }

    case "delete-user": {
      await deleteUser(Number(formData.get("id") as string));
      return json({ message: "User deleted successfully" });
    }

    default:
      return json({ message: "Invalid Intent" }, { status: 400 });
  }
};

export const loader = async () => {
  const users = await db.query.user.findMany();

  return json({ users: users || [] });
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  /* faker data */
  const newUserPayload = getNewUserPayload();

  return (
    <div className="font-sans p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">
        Hello Remix, Drizzle, Postgresql
      </h1>

      {/* Navbar */}

      <nav className="flex items-center gap-2">
        <Link className="text-blue-500 underline" to="/users">
          Users
        </Link>
      </nav>

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
            Link to /test-error
          </button>
        </Link>
      </div>

      {/* Add User */}

      <Form method="post">
        <input type="hidden" name="name" value={newUserPayload.name} />
        <input type="hidden" name="email" value={newUserPayload.email} />
        <input type="hidden" name="password" value={newUserPayload.password} />
        <input type="hidden" name="role" value={newUserPayload.role} />
        <input type="hidden" name="intent" value="add-user" />

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

      {/* Users List */}

      <div className="mt-4">
        <h2 className="font-semibold">Users List</h2>
        <ul>
          {loaderData.users.map((user) => (
            <li key={user.id} className="flex items-center gap-2 mb-2">
              <span className="font-semibold">ID:</span> {user.id} -{" "}
              <span className="font-semibold">Name:</span> {user.name}
              <Link
                className="ml-2 text-blue-500 underline"
                to={`/users/${user.id}`}
              >
                Visit
              </Link>
              <Form method="post">
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="intent" value="delete-user" />
                <button
                  className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                  type="submit"
                >
                  Delete
                </button>
              </Form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
