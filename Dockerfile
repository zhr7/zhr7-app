# 编译环境
FROM node:10.23.1 as builder

WORKDIR /go/src/github.com/lecex/app
COPY . .
RUN npm install
RUN npm run build:h5

# 运行环境自动构建
FROM nginx:alpine

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
WORKDIR /usr/share/nginx/html
COPY --from=builder /go/src/github.com/lecex/app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /go/src/github.com/lecex/app/dist/build/h5 .
COPY --from=builder /go/src/github.com/lecex/app/static ./static
COPY run.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/run.sh
