import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { commitSession, getSession, requireUserSession } from "~/sessions";
import Api from "../../api";

export async function loader({ request }: LoaderArgs) {
  await requireUserSession(request);
  const api = new Api();
  await api.setToken(request);

  const response = await api.getTasks();
  return response.data;
}

export async function action({ request }: ActionArgs) {
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  session.unset("credentials");

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

const Dashboard = () => {
  const data = useLoaderData();

  return (
    <div>
      <h2>Super secret protected dashboard</h2>
      <h2>Tasks</h2>
      <div>
        {data.map((task: any, index: string) => {
          return (
            <div key={task.id}>
              <p>
                {index + 1}. {task.title}
              </p>
            </div>
          );
        })}
      </div>

      <Form method="post">
        <div>
          <button type="submit" value="logout">
            Logout
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Dashboard;
