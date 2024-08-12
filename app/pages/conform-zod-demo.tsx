import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { z } from 'zod'

const SimpleFormSchema = z.object({
  name: z.string().min(7, 'Min of 7 characters'),
  email: z.string().email('Invalid email address'),
  monkey: z.string().optional(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const item = {
    id: '12321431431',
    name: 'John Doe',
    email: 'foo@bar.com',
  }

  return json({ item })
}

export async function action({ request }: ActionFunctionArgs) {
  console.log(`
  #########################################################
                  xxxx
  #########################################################
  `)

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: SimpleFormSchema })
  console.log('\n', `submission.status = `, submission.status, '\n')

  // 1 sec artificial delay
  // await new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve(0)
  //   }, 1000)
  // })

  if (submission.status !== 'success') {
    return json(
      {
        result: submission.reply({
          formErrors: ['Alpha error', 'Beta error'],
          fieldErrors: { monkey: ['Invalid monkey alpha'] },
        }),
      },
      { status: submission.status === 'error' ? 400 : 200 },
    )
  } else {
    console.log('Submission is valid', submission.value)
    console.log('\n', `submission.status = `, submission.status, '\n')
    return json(
      {
        result: submission.reply({
          formErrors: ['Ceta error', 'Deta error'],
          fieldErrors: { monkey: ['Invalid monkey beta'] },
        }),
      },
      { status: 200 },
    )
  }
}

export default function SimpleForm() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  console.log('\n', `navigation = `, navigation, '\n')

  const [form, fields] = useForm({
    id: 'simple-form',
    constraint: getZodConstraint(SimpleFormSchema),
    lastResult: actionData?.result,
    defaultValue: {
      name: '',
      email: '',
      monkey: '',
    },
  })

  console.log('\n', `actionData = `, actionData, '\n')
  console.log('\n', `form = `, form, '\n')
  console.log('\n', `form.status = `, form.status, '\n')
  console.log('\n', `fields.monkey.errors = `, fields.monkey.errors, '\n')

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Item</h1>

      <Form method="POST" {...getFormProps(form)} className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor={fields.name.id} className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...getInputProps(fields.name, { type: 'text' })}
            placeholder="John Doe"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {fields.name.errors && <span className="text-sm text-red-600 mt-1">{fields.name.errors}</span>}
        </div>

        <div>
          <label htmlFor={fields.email.id} className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...getInputProps(fields.email, { type: 'email' })}
            placeholder="your email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {fields.email.errors && <span className="text-sm text-red-600 mt-1">{fields.email.errors}</span>}
        </div>

        <button
          type="submit"
          form="simple-form"
          className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Item
        </button>
      </Form>

      <div className="mt-6">
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
          {JSON.stringify(form.errors, null, 2) || 'no form errors to show'}
        </pre>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 mt-4">
          {JSON.stringify(form.errorId, null, 2) || 'no form errorId to show'}
        </pre>
      </div>
    </div>
  )
}
