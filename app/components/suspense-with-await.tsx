import React, { Suspense } from "react";
import { Await } from "react-router-dom";

type WidgetData = {
  title: string;
  content: string;
  author: string;
  date: string;
  status: string;
};

interface SuspenseWithAwaitProps {
  fallback: JSX.Element;
  resolve: Promise<WidgetData>;
  errorElement: JSX.Element;
  children: (data: WidgetData) => JSX.Element;
}

export const SuspenseWithAwait: React.FC<SuspenseWithAwaitProps> = ({
  fallback,
  resolve,
  errorElement,
  children,
}) => (
  <Suspense fallback={fallback}>
    <Await resolve={resolve} errorElement={errorElement}>
      {children}
    </Await>
  </Suspense>
);
