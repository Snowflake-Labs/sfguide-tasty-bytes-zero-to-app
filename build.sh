#!/bin/bash
set -e

docker buildx build --platform=linux/amd64 -t sfsenorthamerica-fcto-spc.registry.snowflakecomputing.com/bculberson/test/bculberson/router_service .
docker push sfsenorthamerica-fcto-spc.registry.snowflakecomputing.com/bculberson/test/bculberson/router_service

docker buildx build --platform=linux/amd64 -t sfsenorthamerica-fcto-spc.registry.snowflakecomputing.com/bculberson/test/bculberson/backend_service ./backend
docker push sfsenorthamerica-fcto-spc.registry.snowflakecomputing.com/bculberson/test/bculberson/backend_service

docker buildx build --platform=linux/amd64 -t sfsenorthamerica-fcto-spc.registry.snowflakecomputing.com/bculberson/test/bculberson/frontend_service ./frontend
docker push sfsenorthamerica-fcto-spc.registry.snowflakecomputing.com/bculberson/test/bculberson/frontend_service

