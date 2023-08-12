import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Loader from "../../components/loader";

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

  return <Loader text="Signing you out..." />;
}

export default SignOut;
