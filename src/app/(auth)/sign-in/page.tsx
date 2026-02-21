"use client";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();
  const signOut = () => {
    // Implement sign out logic here
  };

  const signIn = () => {
    // Implement sign in logic here
  };
  if (status === "authenticated") {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button className="btn btn-sm btn-success" onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
