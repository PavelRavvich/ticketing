# Ticketing (P2P exchange)
Ticketing is a microservices application that allows users to buy and sell tickets to events. It is built using Node.js, Express, NATS, React, and MongoDB.

Requirements:
- Nodejs (https://nodejs.org/en/download/)
- Docker (https://docs.docker.com/get-docker/)
- Kubectl (https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- Ingress-nginx (https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)
- Add secret `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<youre_jwt_secret_key>`
- Skaffold (https://skaffold.dev/docs/install/)

## How to run
### Development
1. Clone this repo
2. Update your hosts file with the following entry: `127.0.0.1 ticketing.dev`
3. Run `skaffold dev` in the root directory
4. Open your browser and navigate to http://ticketing.dev. If Ingress-nginx show warning you type `thisisunsafe` to continue.

### Production
// todo...
