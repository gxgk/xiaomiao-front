FROM node:12-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
  apk add git
RUN mkdir -p /home/src
WORKDIR /home/src

COPY . /home/src

CMD nohup sh -c 'npm install && npm run build'