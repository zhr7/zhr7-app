# 编译环境
FROM node:12.22.12 as builder

WORKDIR /go/src/github.com/lecex/app
# 更正命令以适用于基于Debian或Ubuntu的镜像
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apt-get install -y ca-certificates && \
    update-ca-certificates
COPY . .
RUN yarn
RUN yarn run build:h5

# 运行环境自动构建
FROM nginx:alpine

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
WORKDIR /usr/share/nginx/html
COPY --from=builder /go/src/github.com/lecex/app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /go/src/github.com/lecex/app/dist/build/h5 .
COPY --from=builder /go/src/github.com/lecex/app/static ./static
COPY --from=builder /go/src/github.com/lecex/app/src/manifest.json ./manifest.json
COPY --from=builder /go/src/github.com/lecex/app/unpackage/release/ .
COPY run.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/run.sh
