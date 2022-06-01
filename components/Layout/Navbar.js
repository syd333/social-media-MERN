import React from "react";
import { Container, Menu, Icon, Header } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

function Navbar() {
  const router = useRouter();

    const isActive = (route) => router.pathname === route;

  return (
    <Menu secondary>
      <Container
        text
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <Header style={{ paddingTop: "1rem", marginRight: "auto" }}>
          {" "}
          social media app
        </Header>
        <Link href="/login">
          <Menu.Item
            header
            active={isActive("/login")}
            style={{ marginLeft: "auto" }}
          >
            <Icon size="large" name="sign in" />
            Login
          </Menu.Item>
        </Link>

        <Link href="/signup">
          <Menu.Item header active={isActive("/signup")}>
            <Icon size="large" name="signup" />
            Signup
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
}

export default Navbar;
