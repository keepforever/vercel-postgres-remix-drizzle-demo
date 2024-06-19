import { useMatches } from "@remix-run/react";
import { loader as userLayoutLoader } from "../users-layout";

/* reusable function to access to the loader data from the parent route */
export const useUserLayoutData = () => {
  const matches = useMatches();
  const slashUsersMatchData = matches.find(
    (match) => match.pathname === "/users"
  )?.data as ReturnType<typeof userLayoutLoader>;

  return slashUsersMatchData;
};
