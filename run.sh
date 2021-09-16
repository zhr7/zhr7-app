url=${BASE_URL//\//\\\/}
sed -i "s/\/rpc/$url/g" /usr/share/nginx/html/index.html
payQrcodeUrl=${PAY_QRCODE_URL//\//\\\/}
sed -i "s/\/pages\/pay\/qrcode\/index/$payQrcodeUrl/g" /usr/share/nginx/html/index.html
