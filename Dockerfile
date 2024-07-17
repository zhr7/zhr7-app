# 编译环境
FROM node:12.22.12 as builder

WORKDIR /go/src/github.com/lecex/app
# 添加更新证书和时区的步骤
RUN apk add --no-cache --update tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apk add --no-cache ca-certificates && update-ca-certificate
    
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
