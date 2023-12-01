CREATE SERVICE APP IN COMPUTE POOL tutorial_compute_pool FROM @bculberson_stage SPEC='snowflake_spec.yml' MIN_INSTANCES = 1 MAX_INSTANCES=1;

