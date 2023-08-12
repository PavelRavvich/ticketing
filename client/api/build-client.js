import axios from "axios";

export default function buildClient({ req }) {
  const isServerSideReq = typeof window === 'undefined';
  const baseURL = isServerSideReq ? 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local' : '/';
  const headers = isServerSideReq ? req.headers : {};

  return axios.create({ baseURL, headers });
};
