FROM nginx:alpine
 
RUN apk update && apk add bash

EXPOSE 8000

COPY nginx.conf.template /nginx.conf.template

CMD ["/bin/sh" , "-c" , "envsubst '$FE_SERVER $BE_SERVER' < /nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]