FROM node:alpine

WORKDIR /index
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]
