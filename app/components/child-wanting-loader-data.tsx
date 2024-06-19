import React from "react";
import { useUserLayoutData } from "~/pages/users/hooks";

export const ChildWantingLoaderData: React.FC = () => {
  const userLayoutData = useUserLayoutData();

  return (
    <div>
      <h3>Hello child-wanting-loader-data</h3>

      <pre>{JSON.stringify(userLayoutData, null, 2)}</pre>
    </div>
  );
};
