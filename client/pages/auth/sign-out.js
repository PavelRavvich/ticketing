import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

function SignOut() {
  const { doRequest } = useRequest({
    url: "/api/users/signOut",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
}

export default SignOut;
