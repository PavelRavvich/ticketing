import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signIn',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className="container d-flex justify-content-center align-items-center ht-75">
      <form onSubmit={onSubmit} className="col-md-4">
        <h1 className="text-center mb-4">Sign In</h1>
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            value={email}
            autoComplete="username"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            id="userPassword"
            autoComplete="current-password"
            type="password"
            value={password}
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary w-100">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
