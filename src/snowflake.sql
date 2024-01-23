USE ROLE TASTY_APP_ADMIN_ROLE;
USE DATABASE FROSTBYTE_TASTY_BYTES;
USE SCHEMA APP;
SHOW IMAGE REPOSITORIES;

-- DROP SERVICE backend_service; -- Run if you are recreating service
CREATE SERVICE backend_service
  IN COMPUTE POOL tasty_app_compute_pool
  FROM SPECIFICATION $$
spec:
  container:
  - name: backend
    image: /frostbyte_tasty_bytes/app/tasty_app_repository/backend_service_image:tutorial
    env:
        ACCESS_TOKEN_SECRET: {INSERT A VERY RANDOM STRING HERE}
        REFRESH_TOKEN_SECRET: {INSERT ANOTHER VERY RANDOM STRING HERE}
        PORT: 3000
        CLIENT_VALIDATION: Snowflake
  endpoint:
  - name: apiendpoint
    port: 3000
    public: true
$$
  MIN_INSTANCES=1
  MAX_INSTANCES=1
;
GRANT USAGE ON SERVICE backend_service TO ROLE spcs_ext_role;

-- Examine the status of the service
SHOW SERVICES;
SELECT SYSTEM$GET_SERVICE_STATUS('backend_service'); 
DESCRIBE SERVICE backend_service;
CALL SYSTEM$GET_SERVICE_LOGS('backend_service', '0', 'backend', 50);

-- Suspend/Resume the service
ALTER SERVICE backend_service SUSPEND;
ALTER SERVICE backend_service RESUME;


-- DROP SERVICE frontend_service; -- Run if you are recreating service
CREATE SERVICE frontend_service
  IN COMPUTE POOL tasty_app_compute_pool
  FROM SPECIFICATION $$
spec:
  container:
  - name: frontend
    image: /frostbyte_tasty_bytes/app/tasty_app_repository/frontend_service_image:tutorial
    env:
      PORT: 4000
      FRONTEND_SERVICE_PORT: 4000
      REACT_APP_BACKEND_SERVICE_URL: /api
      REACT_APP_CLIENT_VALIDATION: Snowflake
  - name: router
    image: /frostbyte_tasty_bytes/app/tasty_app_repository/router_service_image:tutorial
    env:
      FRONTEND_SERVICE: localhost:4000
      BACKEND_SERVICE: backend-service:3000
  endpoint:
  - name: routerendpoint
    port: 8000
    public: true
$$
  MIN_INSTANCES=1
  MAX_INSTANCES=1
;
GRANT USAGE ON SERVICE frontend_service TO ROLE spcs_ext_role;

-- Examine the status of the service
SHOW SERVICES;
SHOW ENDPOINTS IN SERVICE frontend_service;
SELECT SYSTEM$GET_SERVICE_STATUS('frontend_service'); 
DESCRIBE SERVICE frontend_service;
CALL SYSTEM$GET_SERVICE_LOGS('frontend_service', '0', 'frontend', 50);
CALL SYSTEM$GET_SERVICE_LOGS('frontend_service', '0', 'router', 50);

-- Suspend/Resume the service
ALTER SERVICE frontend_service SUSPEND;
ALTER SERVICE frontend_service RESUME;