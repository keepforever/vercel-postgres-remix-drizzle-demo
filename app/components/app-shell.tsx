/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import {
  SignalIcon,
  Bars3Icon,
  FolderIcon,
  HomeIcon,
  XMarkIcon,
  CubeIcon,
  PuzzlePieceIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline'
import { NavLink, useMatches } from '@remix-run/react'

function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const matches = useMatches()

  const rootData = matches.find(match => match.id === 'root')?.data as { userId: string | undefined } | undefined

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Users', href: '/users', icon: PuzzlePieceIcon },
    {
      name: 'UseFetcher Example',
      href: '/use-fetcher-example',
      icon: FolderIcon,
    },
    {
      name: 'Defer Example',
      href: '/defer-example',
      icon: FolderIcon,
    },
    {
      name: 'This route will crash the app',
      href: '/test-error',
      icon: CubeIcon,
    },
    {
      name: 'Conform Zod Demo',
      href: '/conform-zod-demo',
      icon: CubeIcon,
    },

    {
      name: 'OpenAI',
      href: '/openai',
      icon: CubeIcon,
    },
    // sign-up and sign-in routes
    ...(!rootData?.userId
      ? [
          { name: 'Sign Up', href: '/sign-up', icon: SignalIcon },
          { name: 'Sign In', href: '/sign-in', icon: BeakerIcon },
        ]
      : []),
  ]

  return (
    <>
      <div>
        <Transition show={sidebarOpen}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <TransitionChild
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <TransitionChild
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <NavLink to="/">
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/mark.svg?color=white"
                          alt="Your Company"
                        />
                      </NavLink>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul className="-mx-2 space-y-1">
                            {navigation.map(item => (
                              <li key={item.name}>
                                <NavLink
                                  to={item.href}
                                  className={({ isActive }) => {
                                    return classNames(
                                      isActive
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                    )
                                  }}
                                >
                                  <item.icon className={classNames('h-6 w-6 shrink-0')} aria-hidden="true" />
                                  {item.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className="mt-auto">{/* <UserButton /> */}</li>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map(item => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) => {
                            return classNames(
                              isActive
                                ? 'bg-indigo-700 text-white'
                                : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            )
                          }}
                        >
                          <item.icon className={classNames('h-6 w-6 shrink-0')} aria-hidden="true" />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* <li className="mt-auto">
                  user-button
                </li> */}
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 md:hidden">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <main className="">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
