import { defer, useLoaderData } from "@remix-run/react";
import { SuspenseWithAwait } from "~/components/suspense-with-await";
import { faker } from "@faker-js/faker";

type WidgetData = {
  title: string;
  content: string;
  author: string;
  date: string;
  status: string;
};

const getWidgetData = (delay: number): Promise<WidgetData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: faker.lorem.words(3),
        content: faker.lorem.sentences(2),
        author: faker.name.fullName(),
        date: faker.date.recent().toISOString().split("T")[0],
        status: faker.helpers.arrayElement(["Active", "Inactive", "Pending"]),
      });
    }, delay);
  });
};

export const loader = async () => {
  const widget1Promise = getWidgetData(1000);
  const widget2Promise = getWidgetData(3000);
  const widget3Promise = getWidgetData(1800);

  return defer({
    widget1: widget1Promise,
    widget2: widget2Promise,
    widget3: widget3Promise,
    notDeferredData: {
      title: faker.lorem.words(3),
      content: faker.lorem.sentences(2),
    },
  });
};

const WidgetFallback = ({ title }: { title: string }) => (
  <div className="p-4 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-2">
      <span className="bg-gray-200 animate-pulse">Loading {title}...</span>
    </h2>
    <p>
      <span className="bg-gray-200 animate-pulse block h-4 w-full">&nbsp;</span>
    </p>
    <p className="text-gray-600 mt-2">
      <span className="bg-gray-200 animate-pulse block h-4 w-1/2">&nbsp;</span>
    </p>
    <p className="text-gray-600">
      <span className="bg-gray-200 animate-pulse block h-4 w-1/4">&nbsp;</span>
    </p>
    <p className="mt-2 inline-block px-3 py-1 rounded-full bg-gray-200 animate-pulse">
      &nbsp;
    </p>
  </div>
);

const WidgetComponent = ({ widget }: { widget: WidgetData }) => (
  <div className="p-4 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-2">{widget.title}</h2>
    <p>{widget.content}</p>
    <p className="text-gray-600 mt-2">Author: {widget.author}</p>
    <p className="text-gray-600">Date: {widget.date}</p>
    <p
      className={`mt-2 inline-block px-3 py-1 rounded-full ${
        widget.status === "Active"
          ? "bg-green-200 text-green-800"
          : widget.status === "Inactive"
          ? "bg-red-200 text-red-800"
          : "bg-yellow-200 text-yellow-800"
      }`}
    >
      {widget.status}
    </p>
  </div>
);

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SuspenseWithAwait
          fallback={<WidgetFallback title="Widget 1" />}
          resolve={data.widget1}
          errorElement={
            <p className="text-center text-red-500">Error loading Widget 1!</p>
          }
        >
          {(widget: WidgetData) => <WidgetComponent widget={widget} />}
        </SuspenseWithAwait>

        <SuspenseWithAwait
          fallback={<WidgetFallback title="Widget 2" />}
          resolve={data.widget2}
          errorElement={
            <p className="text-center text-red-500">Error loading Widget 2!</p>
          }
        >
          {(widget: WidgetData) => <WidgetComponent widget={widget} />}
        </SuspenseWithAwait>

        <SuspenseWithAwait
          fallback={<WidgetFallback title="Widget 3" />}
          resolve={data.widget3}
          errorElement={
            <p className="text-center text-red-500">Error loading Widget 3!</p>
          }
        >
          {(widget: WidgetData) => <WidgetComponent widget={widget} />}
        </SuspenseWithAwait>
      </div>

      <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">
          {data.notDeferredData.title}
        </h2>
        <p>{data.notDeferredData.content}</p>
      </div>
    </main>
  );
}
