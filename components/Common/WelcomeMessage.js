import { Icon, Message, Divider } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

export const HeaderMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";
  return (
    <Message
    className="welcome-msg"
      attached
      header={signupRoute ? "Get Started" : "Welcome Back!"}
      icon={signupRoute ? "settings" : "privacy"}
      content={signupRoute ? "Create New Account" : "Login"}
    />
  );
};

export const FooterMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";

  return (
    <>
      {signupRoute ? (
        <>
          <Message attached="bottom" className="new-user-msg">
            <Icon name="help" />
            Existing user?
            <Link href="/login">Login here</Link>
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          <Message attached="bottom" info>
            <Icon name="lock" />
            <Link href="/rest">Forgot Password?</Link>
          </Message>

          <Message attached="bottom" className="new-user-msg">
            <Icon name="help" />
            New User?
            <Link href="/signup">Signup here</Link>
          </Message>
        </>
      )}
    </>
  );
};
