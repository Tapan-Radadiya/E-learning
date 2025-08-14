require("resty.core")

ngx.log(ngx.OK, "Starting Lua Script")
local cjson = require "cjson"
local jwt = require "resty.jwt"
local jwt_secret = "363dc8567faa897eb0fdef041f4997e0"

local auth_header = ngx.var.http_Authorization

ngx.log(ngx.OK, "Auth Header", auth_header)

if not auth_header then
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.say("Missing Auth Header")
    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
end

local _, _, token = string.find(auth_header, "Bearer%s+(.+)")

if not token then
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.say("Invalid Auth Header Format")
    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
end

local jwt_obj = jwt:verify(jwt_secret, token)
if not jwt_obj["verified"] then
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.say("Invalid JWT Token")
    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
end

if jwt_obj["verified"] then
    ngx.log(ngx.OK, "JWT Verified")
end

ngx.req.set_header("X-user-id", jwt_obj.payload.id)
ngx.req.set_header("X-user-email", jwt_obj.payload.email)
ngx.req.set_header("X-user-role", jwt_obj.payload.role)

return
