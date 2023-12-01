/**************************************
 * 
 * sql.js
 * 
 * This file contains parameterized SQL
 * statements that are used by the end-
 * points
 * 
 **************************************/
module.exports = {

    // SQL used by empty route "/"
    all_franchise_names: `
    SELECT
        object_construct('franchise_id', o.franchise_id, 'truck_brands', array_agg(distinct o.truck_brand_name)) as franchise
    FROM FROSTBYTE_TASTY_BYTES.APP.ORDERS o
    GROUP BY o.franchise_id
    ORDER BY o.franchise_id, COUNT(o.order_id) DESC;
    `,

    // SQL used by route "franchise/:franchise/"
    trucks_by_franchise: `
    SELECT
        array_agg(distinct o.truck_brand_name) as truck_brand_names
    FROM FROSTBYTE_TASTY_BYTES.APP.ORDERS o
    WHERE o.franchise_id = :1
    ORDER BY o.truck_brand_name;
    `,

    // SQL used by route /:franchise/countries/
    // 4.3.3 Update SQL for Top selling countries for franchise
    top_10_countries: `
    TBD
    `,

    // SQL used by route /:franchise/trucks/:truckbrandname/sales_topitems
    // 4.3.5 Update SQL for Top selling items by truck
    top_selling_items_by_truck: `
    TBD
    `,
    

    // SQL used by route /:franchise/trucks/
    // Top 10 trucks for franchise
    top_10_trucks: `
    SELECT
        TOP 10 truck_brand_name,
        sum(price) AS revenue
    FROM
        FROSTBYTE_TASTY_BYTES.APP.app.orders
    WHERE
        date(order_ts) >= :2
        AND date(order_ts) <= :3
        AND franchise_id = :1
    GROUP BY
        truck_brand_name
    ORDER BY
        sum(price) desc;
    `,

    // SQL used by route /:franchise/revenue/:year
    // Revenue by country for a franchise
    ytd_revenue_by_country: `
    -- Revenue for Year by Country
    -- The year is intentionally hardcoded here to show the entire years worth of data 
    SELECT
        country,
        month(order_ts) as date,
        sum(price) AS revenue
    FROM
        FROSTBYTE_TASTY_BYTES.APP.ORDERS
    WHERE
         year(order_ts) = :2
        AND franchise_id = :1
    GROUP BY
        country,
        month(order_ts)
    ORDER BY
        sum(price) desc;
    `,

    // SQL used by route /:franchise/trucks/:truckbrandname/sales_dayofweek
    // Revenue by day of week for a franchise and truck brand
    sales_by_day_of_week: `
    -- Top Selling Items by Day of Week
    SELECT
        dayofweek(order_ts) as DoW,
        sum(price) AS revenue
    FROM
        FROSTBYTE_TASTY_BYTES.APP.ORDERS
    WHERE
        date(order_ts) >= :2
        AND date(order_ts) <= :3
        AND truck_brand_name = :4
        AND franchise_id = :1
    GROUP BY
        dayofweek(order_ts)
    ORDER BY
        dayofweek(order_ts),
         sum(price) desc;
    `,

    // SQL used by route /:franchise/trucks/:truckbrandname/sales_topitems_dayofweek
    // Top selling items by day of week for a franchise and truck brand
    top_selling_items_by_day_of_week: `
    -- Top Selling Items by Day of Week
    SELECT
        dayofweek(order_ts) as DoW,
        menu_item_name,
        sum(price) AS revenue
    FROM
        FROSTBYTE_TASTY_BYTES.APP.ORDERS
    WHERE
        date(order_ts) >= :2
        AND date(order_ts) <= :3
        AND truck_brand_name = :4
        AND franchise_id = :1
    GROUP BY
        dayofweek(order_ts),
        menu_item_name
    ORDER BY
        dayofweek(order_ts),
         sum(price) desc;
    `,

    // SQL used by route /:franchise/trucks/:truckbrandname/locations
    // Top selling locations for a franchise and truck brand
    best_cities_by_day_ofweek: `
    --  Top Cities by DoW
    SELECT
        dayofweek(order_ts) as DoW,
        primary_city,
        sum(price) AS revenue
    FROM
        FROSTBYTE_TASTY_BYTES.APP.ORDERS
    WHERE
        date(order_ts) >= :2
        AND date(order_ts) <= :3
        AND truck_brand_name = :4
        AND franchise_id = :1
    GROUP BY
        dayofweek(order_ts),
        primary_city
    ORDER BY
        dayofweek(order_ts),
        sum(price) desc;
    `,

    // SQL used by the login endpoint /login
    // Get user_id and hashed_password matching user name
    verify_user: `
    SELECT USER_ID, USER_NAME, HASHED_PASSWORD, FRANCHISE_ID FROM FROSTBYTE_TASTY_BYTES.APP.USERS WHERE USER_NAME = :1;
    `,
  };
  