FROM openresty/openresty:alpine-fat

# Install git (needed for luarocks sometimes)
RUN apk add --no-cache git

# adding lua-resty-jwt and lua-resty-hmac manually
RUN mkdir -p /usr/local/openresty/lualib/resty && \
    git clone https://github.com/SkyLothar/lua-resty-jwt.git /tmp/lua-resty-jwt && \
    git clone https://github.com/jkeys089/lua-resty-hmac.git /tmp/lua-resty-hmac && \
    cp -r /tmp/lua-resty-jwt/lib/resty/* /usr/local/openresty/lualib/resty/ && \
    cp -r /tmp/lua-resty-hmac/lib/resty/* /usr/local/openresty/lualib/resty/ && \
    rm -rf /tmp/lua-resty-jwt /tmp/lua-resty-hmac
