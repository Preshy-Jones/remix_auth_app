import { redirect, createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  credentials: {
    token: string;
    user: {
      email: string;
      name: string;
    };
  };
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",

      httpOnly: true,
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET as string],
      secure: true,
    },
  });

export async function requireUserSession(request: Request) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  // check if session has the credentials
  console.log(session.get("credentials"));
  console.log(session.has("credentials"));
  
  
  if (!session.has("credentials")) {
    console.log(session.get("credentials"));

    // if there is no user session, redirect to login
    throw redirect("/");
  }

  return session;
}

export { getSession, commitSession, destroySession };
