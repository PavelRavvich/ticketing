# Ticketing (P2P exchange)

[![Run Node.js Tests](https://github.com/PavelRavvich/ticketing/actions/workflows/ci.yaml/badge.svg)](https://github.com/PavelRavvich/ticketing/actions/workflows/ci.yaml)

Ticketing is a microservices application that allows users to buy and sell tickets to events. It is built using Node.js, Express, NATS, React MongoDB and Redis.

Requirements:
- Nodejs (https://nodejs.org/en/download/)
- Docker (https://docs.docker.com/get-docker/)
- Kubectl (https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- Minikube (https://kubernetes.io/docs/tasks/tools/install-minikube/)
- Ingress-nginx (https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)
- Add secret for [stripe](https://dashboard.stripe.com/test/apikeys) and jwt
    * `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<youre_jwt_secret_key>`
    * `kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<youre_stripe_secret_key>`
    * `kubectl create secret generic stripe-pub-secret --from-literal NEXT_PUBLIC_STRIPE_KEY=<youre_stripe_public_key>`
- Skaffold (https://skaffold.dev/docs/install/)

### How to update common module
1. Increment `version` prop in `package.json` in `common` module and commit changes.
2. Delete `/build/` folder in `common` module.
3. Run `$ tsc` in `common` module.
4. Run `$ npm publish` in `common` module.

## How to run
### Development
1. Clone this repo
2. Update your hosts file with the following entry: `127.0.0.1 ticketing.dev`
3. Run `skaffold dev` in the root directory
4. Open your browser and navigate to http://ticketing.dev. If Ingress-nginx show warning you type `thisisunsafe` to continue.

### Production
// todo...
