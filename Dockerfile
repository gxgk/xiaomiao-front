FROM node:12-alpine

RUN mkdir -p /home/src
WORKDIR /home/src

COPY . /home/src

CMD nohup sh -c 'npm install && npm run build'
