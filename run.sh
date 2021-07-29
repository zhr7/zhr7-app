url=${BASE_URL//\//\\\/}
sed -i "s/\/rpc/$url/g" /usr/share/nginx/html/index.html