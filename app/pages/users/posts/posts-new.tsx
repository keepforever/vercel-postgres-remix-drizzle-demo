import { Form, json, redirect, useActionData, useParams } from '@remix-run/react'
import { ActionFunctionArgs } from '@remix-run/node'
import { insertPost } from '~/utils/posts.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const intent = formData.get('intent') as string

  switch (intent) {
    case 'add-post': {
      await insertPost({
        name: formData.get('name') as string,
        authorId: Number(formData.get('authorId') as string),
        content: formData.get('content') as string,
      })

      return redirect(`/users/${formData.get('authorId')}/posts`)
    }

    default:
      return json({ message: 'Invalid Intent' }, { status: 400 })
  }
}

export default function User() {
  const params = useParams()
  const actionData = useActionData<typeof action>()
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-xl font-bold mb-6">Create a New Post</h1>
      <Form method="post" className="max-w-xl">
        <input type="hidden" name="intent" value="add-post" />
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Post Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            required
          />
        </div>

        <input type="number" id="authorId" name="authorId" className="hidden" required defaultValue={params.userId} />

        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            placeholder="Write your post content here..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-indigo-300 focus:ring-2 ring-offset-2"
        >
          Submit
        </button>
      </Form>

      {actionData?.message && (
        <div className="mt-4 bg-green-100 text-green-800 p-2 rounded-md shadow-md">{actionData.message}</div>
      )}
    </div>
  )
}
