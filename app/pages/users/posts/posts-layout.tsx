import { LoaderFunctionArgs } from '@remix-run/node'
import { NavLink, Outlet, json, useLoaderData } from '@remix-run/react'
import clsx from 'clsx'
import { getPostsByUserId } from '~/utils/posts.server'
import { getUser } from '~/utils/user.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId as string
  const fetchedUser = await getUser(Number(userId))
  const userPosts = await getPostsByUserId(Number(userId))

  return json({ user: fetchedUser, posts: userPosts })
}

export default function PostsLayout() {
  const { user, posts } = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap pt-2">
        {/* Posts list */}
        <div className="flex flex-col items-center gap-2 flex-1">
          {/* Create Post Button */}

          <div className="flex gap-2 flex-wrap w-full">
            <h2 className="text-2xl font-bold text-gray-800">User Posts</h2>
          </div>

          {/* Posts List */}

          <div className="flex flex-col gap-2">
            {posts.map(post => {
              return (
                <NavLink
                  key={post.id}
                  to={`/users/${user?.id}/posts/${post.id}`}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center py-2 px-2 rounded justify-between border border-gray-300 overflow-hidden gap-4 max-w-[275px] truncate',
                      {
                        'bg-gray-200 text-gray-700 w-full hover:bg-gray-300': isActive,
                        'text-gray-500 hover:bg-gray-200 hover:text-gray-700': !isActive,
                      },
                    )
                  }
                >
                  <div title={String(post?.name)} className="truncate flex-1">
                    {post.name}
                  </div>
                </NavLink>
              )
            })}
          </div>
        </div>

        {/* User Details */}
        <div className="flex flex-col flex-[5]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
