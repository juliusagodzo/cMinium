import React from 'react';
import { useSession, signOut } from 'next-auth/client';
import { Button, Card, Container, Grid } from "semantic-ui-react";
import { useRouter } from "next/router";
const Nav = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  if (!session) return null;
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-brand d-flex">
          <span className="ms-1">cMinium</span>
          <Button primary onClick={() => router.push("/condomini/")}>
            Condomini
          </Button>
        </div>


        <div className="d-flex align-items-center">
          <img src={session.user.image}
            className="img-fluid rounded-circle"
            referrerpolicy="no-referrer"
            alt="logo"
            width={35} height={35} />

          <h5 className="me-3 ms-1 mt-1 text-danger text-capitalize">
            {session.user.name}
          </h5>

          <button className="btn btn-outline-danger"
            onClick={() => signOut()}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;