import middleware from "../../../../middleware/middleware.js";
import STATUS_CODES from "../../../../config/status_codes.js";
import common from "../../../../config/common.js";
import db from "../../../../config/db.js";

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }

  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return ["1", "true", "yes", "y"].includes(normalized);
};

const userModule = {
  // Fetch platform offers/banners
  async getPlatformOffers() {
    try {
      const sql = `SELECT id, image, discount_type, discount_amount 
                        FROM tbl_platform_offer 
                        WHERE is_active = 1 AND is_delete = 0 
                        ORDER BY created_at DESC 
                        LIMIT 5`;
      const offers = await db.query(sql);
      return offers || [];
    } catch (error) {
      console.error("Error fetching platform offers:", error);
      return [];
    }
  },

  // Fetch store listing with average ratings
  async fetchStoreListing() {
    try {
      console.log("Fetching store listing with average ratings");
      const sql = `SELECT 
                s.id, 
                s.name, 
                s.image_url as image, 
                s.description,
                COALESCE(AVG(sr.rating), 0) as average_rating
            FROM tbl_store s
            LEFT JOIN tbl_store_rating sr ON s.id = sr.store_id AND sr.is_active = 1 AND sr.is_delete = 0
            WHERE s.is_active = 1 AND s.is_delete = 0
            GROUP BY s.id, s.name, s.image_url, s.description
            ORDER BY average_rating DESC
            LIMIT 6`;
      const stores = await db.query(sql);
      return stores || [];
    } catch (error) {
      console.error("Error fetching store listing:", error);
      return [];
    }
  },

  // Fetch category listing for category screens and filters
  async getCategoryListing() {
    try {
      const sql = `SELECT
                id,
                parent_category_id,
                name,
                image_url
            FROM tbl_category
            WHERE is_active = 1 AND is_delete = 0
            ORDER BY parent_category_id IS NOT NULL, parent_category_id ASC, name ASC`;

      const rows = await db.query(sql);
      const mainCategories = (rows || [])
        .filter((item) => item.parent_category_id === null)
        .map((category) => ({
          id: category.id,
          name: category.name,
          image_url: category.image_url,
          sub_categories: (rows || [])
            .filter(
              (subCategory) =>
                Number(subCategory.parent_category_id) === Number(category.id),
            )
            .map((subCategory) => ({
              id: subCategory.id,
              name: subCategory.name,
              image_url: subCategory.image_url,
            })),
        }));

      return mainCategories;
    } catch (error) {
      console.error("Error fetching category listing:", error);
      return [];
    }
  },

  // Fetch top deals (products with discounts)
  async getTopDeals() {
    try {
      const sql = `SELECT 
                p.id, 
                p.name,
                p.base_price as price,
                MIN(pi.image_url) as image,
                MAX(pd.discount_value) as discount_value,
                MAX(pd.discount_type) as discount_type
            FROM tbl_product p
            LEFT JOIN tbl_product_image pi ON p.id = pi.product_id AND pi.is_active = 1 AND pi.is_delete = 0
            INNER JOIN tbl_product_discount pd ON p.id = pd.product_id AND pd.is_active = 1 AND pd.is_delete = 0
            WHERE p.is_active = 1 AND p.is_delete = 0
            GROUP BY p.id, p.name, p.base_price
            ORDER BY p.created_at DESC
            LIMIT 6`;
      const deals = await db.query(sql);
      return deals || [];
    } catch (error) {
      console.error("Error fetching top deals:", error);
      return [];
    }
  },

  // Fetch trending products (sorted by rating)
  async getTrendingProducts() {
    try {
      const sql = `SELECT 
                p.id, 
                p.name,
                p.base_price as price,
                MIN(pi.image_url) as image,
                COALESCE(AVG(pr.rating), 0) as average_rating
            FROM tbl_product p
            LEFT JOIN tbl_product_image pi ON p.id = pi.product_id AND pi.is_active = 1 AND pi.is_delete = 0
            LEFT JOIN tbl_product_rating pr ON p.id = pr.product_id AND pr.is_active = 1 AND pr.is_delete = 0
            WHERE p.is_active = 1 AND p.is_delete = 0
            GROUP BY p.id, p.name, p.base_price
            ORDER BY average_rating DESC
            LIMIT 6`;
      const trending = await db.query(sql);
      return trending || [];
    } catch (error) {
      console.error("Error fetching trending products:", error);
      return [];
    }
  },

  // Simplified product search with category filter for homepage
  async getFilteredProducts(filters = {}) {
    const { search, category_id, page = 1, limit = 12 } = filters;

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
    const offset = (safePage - 1) * safeLimit;

    // Build WHERE clause conditions
    let whereConditions = ["p.is_active = 1", "p.is_delete = 0"];
    let queryParams = [];

    if (search) {
      whereConditions.push("p.name LIKE ?");
      queryParams.push(`%${String(search).trim()}%`);
    }

    if (category_id) {
      whereConditions.push("p.category_id = ?");
      queryParams.push(Number(category_id));
    }

    // Base SQL query
    let sql = `SELECT 
            p.id,
            p.name,
            p.description,
            p.base_price as price,
            MIN(pi.image_url) as image,
            COALESCE(AVG(pr.rating), 0) as average_rating
        FROM tbl_product p
        LEFT JOIN tbl_product_image pi ON p.id = pi.product_id AND pi.is_active = 1 AND pi.is_delete = 0
        LEFT JOIN tbl_product_rating pr ON p.id = pr.product_id AND pr.is_active = 1 AND pr.is_delete = 0
        WHERE ${whereConditions.join(" AND ")}
        GROUP BY p.id, p.name, p.description, p.base_price
        ORDER BY p.created_at DESC`;

    // Count total rows
    const countSql = `SELECT COUNT(DISTINCT p.id) as total FROM tbl_product p WHERE ${whereConditions.join(" AND ")}`;
    const countResult = await db.query(countSql, queryParams);
    const totalItems = countResult[0]?.total || 0;

    // Get paginated results
    sql += ` LIMIT ? OFFSET ?`;
    queryParams.push(safeLimit, offset);

    const products = await db.query(sql, queryParams);

    return {
      items: products || [],
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: totalItems,
        total_pages: Math.ceil(totalItems / safeLimit),
      },
    };
  },

  async products(request, res) {
    try {
      const result = await this.getFilteredProducts(request.query || {});

      if (!result.items || result.items.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          result,
        );
      }

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Products_fetched_successfully",
        result,
      );
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Products_fetch_error",
        null,
      );
    }
  },

  // Simple filter API for search-result screen
  async filterProducts(request, res) {
    try {
      const {
        search,
        category_id,
        subcategory_id,
        min_price,
        max_price,
        min_rating,
        has_discount,
        sort_by,
      } = request.query || {};

      const whereConditions = ["p.is_active = 1", "p.is_delete = 0"];
      const queryParams = [];

      if (search) {
        whereConditions.push("p.name LIKE ?");
        queryParams.push(`%${String(search).trim()}%`);
      }

      if (subcategory_id) {
        whereConditions.push("p.category_id = ?");
        queryParams.push(Number(subcategory_id));
      } else if (category_id) {
        whereConditions.push("(p.category_id = ? OR c.parent_category_id = ?)");
        queryParams.push(Number(category_id), Number(category_id));
      }

      if (min_price) {
        whereConditions.push("p.base_price >= ?");
        queryParams.push(Number(min_price));
      }

      if (max_price) {
        whereConditions.push("p.base_price <= ?");
        queryParams.push(Number(max_price));
      }

      const discountOnly = parseBoolean(has_discount);

      let sql = `SELECT
                p.id,
                p.name,
                p.description,
                p.base_price AS price,
                MIN(pi.image_url) AS image,
                COALESCE(AVG(pr.rating), 0) AS average_rating,
                MAX(pd.discount_type) AS discount_type,
                MAX(pd.discount_value) AS discount_value,
                p.category_id,
                c.name AS category_name,
                c.parent_category_id
            FROM tbl_product p
            LEFT JOIN tbl_category c ON p.category_id = c.id
            LEFT JOIN tbl_product_image pi ON p.id = pi.product_id AND pi.is_active = 1 AND pi.is_delete = 0
            LEFT JOIN tbl_product_rating pr ON p.id = pr.product_id AND pr.is_active = 1 AND pr.is_delete = 0`;

      if (discountOnly) {
        sql += ` INNER JOIN tbl_product_discount pd ON p.id = pd.product_id AND pd.is_active = 1 AND pd.is_delete = 0`;
      } else {
        sql += ` LEFT JOIN tbl_product_discount pd ON p.id = pd.product_id AND pd.is_active = 1 AND pd.is_delete = 0`;
      }

      sql += ` WHERE ${whereConditions.join(" AND ")}`;
      sql += ` GROUP BY p.id, p.name, p.description, p.base_price, p.category_id, c.name, c.parent_category_id`;

      if (min_rating) {
        sql += ` HAVING AVG(pr.rating) >= ?`;
        queryParams.push(Number(min_rating));
      }

      let orderBy = "p.created_at DESC";
      if (sort_by === "price_low_to_high") orderBy = "p.base_price ASC";
      if (sort_by === "price_high_to_low") orderBy = "p.base_price DESC";
      if (sort_by === "a_to_z") orderBy = "p.name ASC";
      if (sort_by === "z_to_a") orderBy = "p.name DESC";
      if (sort_by === "rating_high_to_low") orderBy = "average_rating DESC";

      sql += ` ORDER BY ${orderBy}`;

      const items = await db.query(sql, queryParams);
      const categories = await this.getCategoryListing();

      const responseData = {
        filters_applied: {
          search: search || null,
          category_id: category_id ? Number(category_id) : null,
          subcategory_id: subcategory_id ? Number(subcategory_id) : null,
          min_price: min_price ? Number(min_price) : null,
          max_price: max_price ? Number(max_price) : null,
          min_rating: min_rating ? Number(min_rating) : null,
          has_discount: discountOnly,
          sort_by: sort_by || null,
        },
        available_filters: {
          categories: categories || [],
          sort_options: [
            "price_low_to_high",
            "price_high_to_low",
            "a_to_z",
            "z_to_a",
            "rating_high_to_low",
          ],
        },
        items: items || [],
      };

      if (!responseData.items.length) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          responseData,
        );
      }

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Filtered_products_fetched_successfully",
        responseData,
      );
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Filtered_products_fetch_error",
        null,
      );
    }
  },

  // Category listing API for category screens
  async categoryListing(request, res) {
    try {
      const categories = await this.getCategoryListing();

      if (!categories || categories.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Categories_fetched_successfully",
        categories,
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Categories_fetch_error",
        null,
      );
    }
  },

  // Single product details API with optional size filter and size chart
  async productDetails(request, res) {
    try {
      const productId = Number(request.query?.product_id);
      const sizeId = request.query?.size_id
        ? Number(request.query.size_id)
        : null;

      if (!Number.isInteger(productId) || productId <= 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }

      const productSql = `SELECT
                p.id,
                p.name,
                p.description,
                p.additional_info,
                p.base_price,
                p.category_id,
                c.name AS category_name,
                p.store_id,
                s.name AS store_name,
                s.description AS store_description,
                s.image_url AS store_image,
                COALESCE(AVG(pr.rating), 0) AS average_rating,
                COUNT(pr.id) AS total_reviews,
                MAX(pd.discount_type) AS discount_type,
                MAX(pd.discount_value) AS discount_value
            FROM tbl_product p
            LEFT JOIN tbl_category c ON p.category_id = c.id
            LEFT JOIN tbl_store s ON p.store_id = s.id
            LEFT JOIN tbl_product_rating pr ON p.id = pr.product_id AND pr.is_active = 1 AND pr.is_delete = 0
            LEFT JOIN tbl_product_discount pd ON p.id = pd.product_id AND pd.is_active = 1 AND pd.is_delete = 0
            WHERE p.id = ? AND p.is_active = 1 AND p.is_delete = 0
            GROUP BY p.id, p.name, p.description, p.additional_info, p.base_price, p.category_id, c.name, p.store_id, s.name, s.description, s.image_url`;

      const productRows = await db.query(productSql, [productId]);
      if (!productRows || productRows.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }

      const product = productRows[0];
      let additionalInfo = {};
      try {
        additionalInfo = product.additional_info
          ? JSON.parse(product.additional_info)
          : {};
      } catch (parseError) {
        additionalInfo = {};
      }

      const imageSql = `SELECT
                id,
                image_url
            FROM tbl_product_image
            WHERE product_id = ? AND is_active = 1 AND is_delete = 0
            ORDER BY id ASC`;
      const images = await db.query(imageSql, [productId]);

      let variantSql = `SELECT
                pv.id,
                pv.size_id,
                sz.name AS size_name,
                pv.color_id,
                clr.name AS color_name,
                pv.type_id,
                tp.name AS type_name,
                pv.stock,
                pv.price
            FROM tbl_product_variant pv
            LEFT JOIN tbl_size sz ON pv.size_id = sz.id
            LEFT JOIN tbl_color clr ON pv.color_id = clr.id
            LEFT JOIN tbl_type tp ON pv.type_id = tp.id
            WHERE pv.product_id = ? AND pv.is_active = 1 AND pv.is_delete = 0`;

      const variantParams = [productId];
      if (sizeId && Number.isInteger(sizeId) && sizeId > 0) {
        variantSql += ` AND pv.size_id = ?`;
        variantParams.push(sizeId);
      }
      variantSql += ` ORDER BY pv.id ASC`;

      const variants = await db.query(variantSql, variantParams);

      const sizesSql = `SELECT DISTINCT
                pv.size_id,
                sz.name AS size_name
            FROM tbl_product_variant pv
            LEFT JOIN tbl_size sz ON pv.size_id = sz.id
            WHERE pv.product_id = ? AND pv.is_active = 1 AND pv.is_delete = 0
            ORDER BY pv.size_id ASC`;
      const availableSizes = await db.query(sizesSql, [productId]);

      const sizeChartSql = `SELECT
                sc.size_id,
                sz.name AS size_name,
                MAX(CASE WHEN LOWER(m.name) = 'length' THEN sc.value END) AS length,
                MAX(CASE WHEN LOWER(m.name) = 'width' THEN sc.value END) AS width,
                MAX(CASE WHEN LOWER(REPLACE(m.name, ' ', '_')) = 'sleeve_length' THEN sc.value END) AS sleeve_length
            FROM tbl_product_size_chart sc
            LEFT JOIN tbl_size sz ON sc.size_id = sz.id
            LEFT JOIN tbl_measurement m ON sc.measurement_id = m.id
            WHERE sc.product_id = ? AND sc.is_active = 1 AND sc.is_delete = 0
            GROUP BY sc.size_id, sz.name
            ORDER BY sc.size_id ASC`;
      const sizeChartRows = await db.query(sizeChartSql, [productId]);

      const productData = {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          additional_info_data: additionalInfo,
          // additional_info_list: additionalInfoList,
          base_price: product.base_price,
          category: {
            id: product.category_id,
            name: product.category_name,
          },
          store_details: {
            id: product.store_id,
            name: product.store_name,
            description: product.store_description,
            image: product.store_image,
          },
          average_rating: Number(product.average_rating || 0),
          total_reviews: Number(product.total_reviews || 0),
          discount: {
            discount_type: product.discount_type,
            discount_value: product.discount_value,
          },
          images: images || [],
          available_sizes: availableSizes || [],
          variants: variants || [],
          selected_size_id: sizeId || null,
        },
        size_chart: {
          rows: sizeChartRows || [],
        },
      };

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Product_details_fetched_successfully",
        productData,
      );
    } catch (error) {
      console.error("Error fetching product details:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Product_details_fetch_error",
        null,
      );
    }
  },

  // Single product review listing API
  async productReviews(request, res) {
    try {
      const productId = Number(request.query?.product_id);
      const safePage = Math.max(Number(request.query?.page) || 1, 1);
      const safeLimit = Math.min(
        Math.max(Number(request.query?.limit) || 20, 1),
        100,
      );
      const offset = (safePage - 1) * safeLimit;

      if (!Number.isInteger(productId) || productId <= 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }

      const productSql = `SELECT
                p.id,
                p.name,
                p.base_price,
                MIN(pi.image_url) AS image,
                COALESCE(AVG(pr.rating), 0) AS average_rating,
                COUNT(pr.id) AS total_reviews
            FROM tbl_product p
            LEFT JOIN tbl_product_image pi ON p.id = pi.product_id AND pi.is_active = 1 AND pi.is_delete = 0
            LEFT JOIN tbl_product_rating pr ON p.id = pr.product_id AND pr.is_active = 1 AND pr.is_delete = 0
            WHERE p.id = ? AND p.is_active = 1 AND p.is_delete = 0
            GROUP BY p.id, p.name, p.base_price`;

      const productRows = await db.query(productSql, [productId]);
      if (!productRows || productRows.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }

      const totalSql = `SELECT COUNT(*) AS total
                FROM tbl_product_rating
                WHERE product_id = ? AND is_active = 1 AND is_delete = 0`;
      const totalRows = await db.query(totalSql, [productId]);
      const totalItems = Number(totalRows[0]?.total || 0);

      const reviewSql = `SELECT
                pr.id,
                pr.user_id,
                COALESCE(u.name, 'Anonymous User') AS reviewer_name,
                u.profile_image AS reviewer_image,
                pr.rating,
                pr.review,
                DATE_FORMAT(pr.created_at, '%d %b, %Y') AS review_date
            FROM tbl_product_rating pr
            LEFT JOIN tbl_user u ON pr.user_id = u.id
            WHERE pr.product_id = ?
              AND pr.is_active = 1
              AND pr.is_delete = 0
            ORDER BY pr.created_at DESC
            LIMIT ? OFFSET ?`;

      const reviews = await db.query(reviewSql, [productId, safeLimit, offset]);

      const reviewData = {
        product: {
          id: productRows[0].id,
          name: productRows[0].name,
          image: productRows[0].image,
          base_price: productRows[0].base_price,
          average_rating: Number(productRows[0].average_rating || 0),
          total_reviews: Number(productRows[0].total_reviews || 0),
        },
        reviews: reviews || [],
        pagination: {
          page: safePage,
          limit: safeLimit,
          total: totalItems,
          total_pages: Math.ceil(totalItems / safeLimit),
        },
      };

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Product_reviews_fetched_successfully",
        reviewData,
      );
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Product_reviews_fetch_error",
        null,
      );
    }
  },

  // Home API - calls all functions and returns combined response
  async home(request, res) {
    try {
      const offers = await this.getPlatformOffers();
      const [stores, topDeals, trendingProducts] = await Promise.all([
        this.fetchStoreListing(),
        offers.length > 0 ? this.getTopDeals() : Promise.resolve([]),
        this.getTrendingProducts(),
      ]);

      const homeData = {
        offers: offers.length > 0 ? offers : null,
        stores: stores.length > 0 ? stores : null,
        topDeals: topDeals.length > 0 ? topDeals : null,
        trending: trendingProducts.length > 0 ? trendingProducts : null,
      };

      // Check if any data exists
      const hasData = Object.values(homeData).some(
        (section) => section !== null,
      );

      if (!hasData) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Home_data_fetched_successfully",
        homeData,
      );
    } catch (error) {
      console.error("Error fetching home data:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Home_data_fetch_error",
        null,
      );
    }
  },

  async getStoreListing(request, res) {
    try {
      const stores = await this.fetchStoreListing();
      // console.log('Fetched stores:', stores);
      if (!stores || stores.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Stores_fetched_successfully",
        stores,
      );
    } catch (error) {
      console.error("Error fetching store listing:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Stores_fetch_error",
        null,
      );
    }
  },

  async fetchStoreData(request, res) {
    try {
      const storeId = Number(request.query?.store_id);

      if (!Number.isInteger(storeId) || storeId <= 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }

      const sql = `SELECT
                s.id AS store_id,
                s.name AS store_name,
                s.description AS store_description,
                s.image_url AS store_image,
                s.latitude,
                s.longitude,
                COALESCE(sr_data.average_rating, 0) AS store_average_rating,
                COALESCE(sr_data.total_reviews, 0) AS store_total_reviews,
                p.id AS product_id,
                p.name AS product_name,
                p.description AS product_description,
                p.base_price,
                pi.image AS product_image,
                COALESCE(pr_data.average_rating, 0) AS product_average_rating,
                pd.discount_type,
                pd.discount_value
            FROM tbl_store s
            LEFT JOIN (
                SELECT
                    store_id,
                    AVG(rating) AS average_rating,
                    COUNT(*) AS total_reviews
                FROM tbl_store_rating
                WHERE is_active = 1 AND is_delete = 0
                GROUP BY store_id
            ) sr_data ON sr_data.store_id = s.id
            LEFT JOIN tbl_product p ON p.store_id = s.id AND p.is_active = 1 AND p.is_delete = 0
            LEFT JOIN (
                SELECT
                    product_id,
                    MIN(image_url) AS image
                FROM tbl_product_image
                WHERE is_active = 1 AND is_delete = 0
                GROUP BY product_id
            ) pi ON pi.product_id = p.id
            LEFT JOIN (
                SELECT
                    product_id,
                    AVG(rating) AS average_rating
                FROM tbl_product_rating
                WHERE is_active = 1 AND is_delete = 0
                GROUP BY product_id
            ) pr_data ON pr_data.product_id = p.id
            LEFT JOIN (
                SELECT
                    product_id,
                    MAX(discount_type) AS discount_type,
                    MAX(discount_value) AS discount_value
                FROM tbl_product_discount
                WHERE is_active = 1 AND is_delete = 0
                GROUP BY product_id
            ) pd ON pd.product_id = p.id
            WHERE s.id = ? AND s.is_active = 1 AND s.is_delete = 0
            ORDER BY p.created_at DESC`;

      const rows = await db.query(sql, [storeId]);
      if (!rows || rows.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }
      const store = rows[0];
      const products = rows
        .filter((row) => row.product_id)
        .map((row) => ({
          id: row.product_id,
          name: row.product_name,
          description: row.product_description,
          base_price: row.base_price,
          image: row.product_image,
          average_rating: Number(row.product_average_rating || 0),
          discount_type: row.discount_type,
          discount_value: row.discount_value,
        }));

      const responseData = {
        store_header: {
          id: store.store_id,
          name: store.store_name,
          images: store.store_image ? [store.store_image] : [],
          average_rating: Number(store.store_average_rating || 0),
          total_reviews: Number(store.store_total_reviews || 0),
        },
        about_the_store: {
          description: store.store_description,
          location: {
            latitude: store.latitude,
            longitude: store.longitude,
          },
        },
        all_products: products,
      };

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Store_data_fetched_successfully",
        responseData,
      );
    } catch (error) {
      console.error("Error fetching store data:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Store_data_fetch_error",
        null,
      );
    }
  },

  async manageCart(request, res) {
    try {
      const loginUser = request.loginUser || request.loginUser?.data || {};
      const user_id = loginUser.id;

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_unauthorized",
          null,
        );
      }

      const {
        product_id,
        size_id = null,
        color_id = null,
        type_id = null,
        quantity,
      } = request.body || request;

      if (!product_id || quantity === undefined || quantity === null) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.MISSING_FIELD,
          "rest_keywords_required_fields_missing",
          { fields: "product_id, quantity" },
        );
      }

      const normalizedQuantity = Number(quantity);
      if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_required_fields_missing",
          { fields: "quantity must be a non-negative integer" },
        );
      }

      const checkVariantRows = await db.query(
        `SELECT id, stock FROM tbl_product_variant WHERE product_id=? AND size_id=? AND color_id=? AND type_id=? AND is_active=1 AND is_delete=0`,
        [product_id, size_id, color_id, type_id],
      );
      const checkVariant = checkVariantRows?.[0];

      if (!checkVariant) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_invalid_login_credentials",
          { field: "product_id, size_id, color_id or type_id" },
        );
      }

      if (normalizedQuantity > 0 && checkVariant.stock < normalizedQuantity) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_insufficient_stock",
          { available_stock: checkVariant.stock },
        );
      }

      const variant_id = checkVariant.id;
      //   console.log("Variant ID to add to cart:", variant_id);
      const isVariantAlreadyInCart = await db.query(
        `SELECT id FROM tbl_cart WHERE user_id=? AND variant_id=? AND is_active=1 AND is_delete=0`,
        [user_id, variant_id],
      );
      //   console.log("Checking if variant is already in cart:", isVariantAlreadyInCart);
      if (isVariantAlreadyInCart && isVariantAlreadyInCart.length > 0) {
        let updateCartResult;

        if (normalizedQuantity === 0) {
          updateCartResult = await db.query(
            `DELETE FROM tbl_cart WHERE user_id=? AND variant_id=?`,
            [user_id, variant_id],
          );
        } else {
          updateCartResult = await db.query(
            `UPDATE tbl_cart SET quantity = ? WHERE user_id=? AND variant_id=? AND is_active=1 AND is_delete=0`,
            [normalizedQuantity, user_id, variant_id],
          );
        }

        if (updateCartResult && updateCartResult.affectedRows > 0) {
          const userCart = await common.getUserCart(user_id);
          return middleware.sendApiResponse(
            res,
            STATUS_CODES.SUCCESS,
            STATUS_CODES.RESPONSE_SUCCESS,
            "rest_cart_updated_successfully",
            { cartData: userCart },
          );
        }

        return middleware.sendApiResponse(
          res,
          STATUS_CODES.INTERNAL_ERROR,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_error",
          { resource: "Updating Cart" },
        );
      }

      if (normalizedQuantity === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          { resource: "Cart Item" },
        );
      }

      const addToCartResult = await db.query(
        "INSERT INTO tbl_cart(user_id,variant_id,quantity,is_active,is_delete) VALUES (?,?, ?, 1, 0)",
        [user_id, variant_id, normalizedQuantity],
      );

      if (addToCartResult && addToCartResult.affectedRows > 0) {
        const userCart = await common.getUserCart(user_id);
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_SUCCESS,
          "rest_item_added_to_cart_successfully",
          { cartData: userCart },
        );
      } else {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.INTERNAL_ERROR,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_error",
          { resource: "Adding Item to Cart" },
        );
      }
    } catch (err) {
      console.log(err);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async cartDetails(request, res) {
    try {
      const loginUser = request.loginUser || request.loginUser?.data || {};
      const user_id = loginUser.id;
      //   const {coupenCode} = request.body

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_unauthorized",
          null,
        );
      }

      const cartItemsSql = `SELECT
          c.id AS cart_id,
          c.user_id,
          c.variant_id,
          c.quantity,
          pv.product_id,
          pv.price AS variant_price,
          pv.stock,
          p.name AS product_name,
          p.base_price,
          COALESCE(pi.image_url, '') AS product_image,
          s.id AS size_id,
          s.name AS size_name,
          clr.id AS color_id,
          clr.name AS color_name,
          tp.id AS type_id,
          tp.name AS type_name
      FROM tbl_cart c
      LEFT JOIN tbl_product_variant pv ON c.variant_id = pv.id
      LEFT JOIN tbl_product p ON pv.product_id = p.id
      LEFT JOIN tbl_size s ON pv.size_id = s.id
      LEFT JOIN tbl_color clr ON pv.color_id = clr.id
      LEFT JOIN tbl_type tp ON pv.type_id = tp.id
      LEFT JOIN (
          SELECT product_id, MIN(image_url) AS image_url
          FROM tbl_product_image
          WHERE is_active = 1 AND is_delete = 0
          GROUP BY product_id
      ) pi ON pi.product_id = p.id
      WHERE c.user_id = ?
        AND c.is_active = 1
        AND c.is_delete = 0
        AND pv.is_active = 1
        AND pv.is_delete = 0
        AND p.is_active = 1
        AND p.is_delete = 0
      ORDER BY c.id DESC`;

      const rows = await db.query(cartItemsSql, [user_id]);

      if (!rows || rows.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          {
            items: [],
            summary: {
              total_items: 0,
              sub_total: 0,
              total_amount: 0,
            },
          },
        );
      }
      //   if(coupenCode){
      //     const [fetchData] = await db.query(`SELECT discount_type, discount_value FROM tbl_coupons WHERE code = ? AND is_active = 1 AND is_delete = 0`, [coupenCode]);
      //   }
      const items = rows.map((row) => {
        const unitPrice = Number(row.variant_price || row.base_price || 0);
        const quantity = Number(row.quantity || 0);
        return {
          cart_id: row.cart_id,
          variant_id: row.variant_id,
          product_id: row.product_id,
          product_name: row.product_name,
          product_image: row.product_image,
          quantity,
          unit_price: unitPrice,
          item_total: Number((unitPrice * quantity).toFixed(3)),
          stock: Number(row.stock || 0),
          size: {
            id: row.size_id,
            name: row.size_name,
          },
          color: {
            id: row.color_id,
            name: row.color_name,
          },
          type: {
            id: row.type_id,
            name: row.type_name,
          },
        };
      });

      const subTotal = items.reduce(
        (sum, item) => sum + Number(item.item_total || 0),
        0,
      );
      const totalItems = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
      );

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Cart_details_fetched_successfully",
        {
          items,
          summary: {
            total_items: totalItems,
            sub_total: Number(subTotal.toFixed(3)),
            total_amount: Number(subTotal.toFixed(3)),
          },
        },
      );
    } catch (error) {
      console.error("Error fetching cart details:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async addPaymentMethod(request, res) {
    try {
      const {
        holder_name,
        card_number,
        expiry_date,
        payment_mode,
        upi_id,
        cvv,
      } = request.body || {};
      const loginUser = request.loginUser || request.loginUser?.data || {};
      const user_id = loginUser.id;

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_unauthorized",
          null,
        );
      }

      // Validate required fields
      if (!card_number || !payment_mode) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_required",
          null,
        );
      }

      const [cartexist] = await db.query(
        `SELECT id FROM tbl_payment WHERE user_id = ? AND card_number = ? AND is_active = 1 AND is_delete = 0`,
        [user_id, card_number],
      );
      console.log("Existing payment method check result:", cartexist);
      if (cartexist) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_payment_method_already_exists",
          null,
        );
      }

      const addPaymentResult = await db.query(
        `INSERT INTO tbl_payment (user_id, card_holder_name, card_number, card_expiry_date, payment_mode, upi_id, is_active, is_delete) VALUES (?, ?, ?, ?, ?, ?, 1, 0)`,
        [
          user_id,
          holder_name || null,
          card_number,
          expiry_date || null,
          payment_mode,
          upi_id || null,
        ],
      );
      if (addPaymentResult && addPaymentResult.affectedRows > 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_SUCCESS,
          "rest_payment_method_added_successfully",
          null,
        );
      } else {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_error",
          null,
        );
      }
    } catch (error) {
      console.log("Error adding payment method:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async placeOrderFromCart(request, res) {
    try {
      const loginUser = request.loginUser || request.loginUser?.data || {};
      const user_id = loginUser.id;

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_unauthorized",
          null,
        );
      }

      const {
        user_latitude,
        user_longitude,
        user_location,
        subtotal,
        tax = 0,
        discount = 0,
        total,
        payment_mode,
        payment_card_name,
        payment_card_numer,
        payment_card_number,
        payment_id,
      } = request.body || {};

      const cardNumber = payment_card_number || payment_card_numer || null;
      const cartData = await common.getUserCart(user_id);

      if (!cartData || cartData.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          { resource: "User Cart" },
        );
      }

      const checkCartItemsStock = await db.query(
        `SELECT c.id, c.quantity, pv.stock
         FROM tbl_cart AS c
         JOIN tbl_product_variant AS pv ON pv.id = c.variant_id AND pv.is_active = 1 AND pv.is_delete = 0
         WHERE c.user_id = ? AND c.is_active = 1 AND c.is_delete = 0`,
        [user_id],
      );

      const insufficientStockItems = [];
      if (checkCartItemsStock && checkCartItemsStock.length > 0) {
        checkCartItemsStock.forEach((item) => {
          if (item.stock < item.quantity) {
            insufficientStockItems.push({
              cart_item_id: item.id,
              available_stock: item.stock,
            });
          }
        });
      }

      if (insufficientStockItems.length > 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_insufficient_stock",
          { items: insufficientStockItems },
        );
      }

      let resolvedPaymentId = payment_id ?? null;
      if (!resolvedPaymentId && cardNumber) {
        const paymentRows = await db.query(
          `SELECT id
           FROM tbl_payment
           WHERE user_id = ?
             AND card_number = ?
             AND is_active = 1
             AND is_delete = 0`,
          [user_id, cardNumber],
        );
        resolvedPaymentId = paymentRows?.[0]?.id || null;
      }

      const orderCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const totalAmount = total ?? subtotal ?? 0;
      const placeOrderResult = await db.query(
        `INSERT INTO tbl_orders (
            user_id,
            payment_id,
            order_code,
            order_date,
            subtotal,
            tax,
            discount,
            total,
            latitude,
            longitude,
            location,
            total_amount,
            payment_mode,
            order_status,
            is_active,
            is_delete,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, NOW(), NOW())`,
        [
          user_id,
          resolvedPaymentId,
          orderCode,
          subtotal ?? 0,
          tax ?? 0,
          discount ?? 0,
          totalAmount,
          user_latitude ?? null,
          user_longitude ?? null,
          user_location ?? null,
          totalAmount,
          payment_mode ?? null,
          "placed",
        ],
      );

      if (placeOrderResult && placeOrderResult.affectedRows > 0) {
        const order_id = placeOrderResult.insertId;
        const orderItemsData = [];

        cartData.forEach((item) => {
          orderItemsData.push([
            order_id,
            item.variant_id,
            item.quantity,
            item.price ?? item.unit_price ?? 0,
          ]);
        });

        const orderItemPlaceholders = orderItemsData
          .map(() => `(?, ?, ?, ?)`)
          .join(", ");
        const orderItemValues = orderItemsData.flat();

        const orderItemsResult = await db.query(
          `INSERT INTO tbl_order_items (order_id, variant_id, quantity, price) VALUES ${orderItemPlaceholders}`,
          orderItemValues,
        );

        if (orderItemsResult && orderItemsResult.affectedRows > 0) {
          for (const item of orderItemsData) {
            await db.query(
              `UPDATE tbl_product_variant SET stock = stock - ? WHERE id = ?`,
              [item[2], item[1]],
            );
          }

          await db.query(
            `UPDATE tbl_cart SET is_active = 0, is_delete = 1 WHERE user_id = ?`,
            [user_id],
          );
          console.log(user_id, "userID");
          await common.sendNotification(
            null,
            user_id,
            "Order Placed",
            `Your order ${orderCode} has been placed successfully.`,
          );
          return middleware.sendApiResponse(
            res,
            STATUS_CODES.SUCCESS,
            STATUS_CODES.RESPONSE_SUCCESS,
            "ORDER_PLACED_SUCCESSFULLY",
            { order_id, order_code: orderCode },
          );
        }

        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "ERROR_DURING_ANY",
          { resource: "Placing Order Items" },
        );
      }

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_ERROR,
        "ERROR_DURING_ANY",
        { resource: "Placing Order" },
      );
    } catch (err) {
      console.log(err);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "SOMETHING_WENT_WRONG",
        null,
      );
    }
  },

  async cancelOrder(request, res) {
    try {
      const loginUser = request.loginUser || request.loginUser?.data || {};
      const user_id = loginUser.id;
      const order_id = Number(request.body?.order_id);

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_unauthorized",
          null,
        );
      }
      const [orderData] = await db.query(
        `SELECT order_code, order_status FROM tbl_orders WHERE id = ? AND user_id = ? AND is_active = 1 AND is_delete = 0`,
        [order_id, user_id],
      );
      if (!orderData) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          orderData,
        );
      }
      if (orderData.order_status === "cancelled") {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_order_already_cancelled",
          null,
        );
      }
      if (orderData.order_status === "delivered") {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_order_already_delivered",
          null,
        );
      }

      const cancelResult = await db.query(
        `UPDATE tbl_orders SET order_status = 'cancelled', updated_at = NOW() WHERE id = ? AND user_id = ? AND is_active = 1 AND is_delete = 0`,
        [order_id, user_id],
      );
      if (cancelResult && cancelResult.affectedRows > 0) {
        await common.sendNotification(
          null,
          user_id,
          "Order Cancelled",
          `Your order ${orderData.order_code} has been cancelled successfully.`,
        );
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_SUCCESS,
          "ORDER_CANCELLED_SUCCESSFULLY",
          null,
        );
      } 
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_ERROR,
        "ERROR_DURING_ANY",
        null,
      );
    }catch (err) {
      console.log(err);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "SOMETHING_WENT_WRONG",
        null,
      );
    }
  },

  async orderHistory(req, res) {
    try {
      const user_id = req.loginUser?.id;

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "Unauthorized",
        );
      }

      //Query
      const sql = `
        SELECT 
          o.id AS order_id, o.order_code, o.order_date, o.total_amount,
          o.payment_mode, o.order_status, o.latitude, o.longitude, o.location,
          pay.card_number,
          oi.variant_id, oi.quantity, oi.price,
          p.name AS product_name,
          COALESCE(pi.image_url, '') AS product_image
        FROM tbl_orders o
        LEFT JOIN tbl_payment pay ON pay.id = o.payment_id
        LEFT JOIN tbl_order_items oi ON oi.order_id = o.id AND oi.is_active = 1 AND oi.is_delete = 0
        LEFT JOIN tbl_product_variant pv ON pv.id = oi.variant_id
        LEFT JOIN tbl_product p ON p.id = pv.product_id
        LEFT JOIN (
          SELECT product_id, MIN(image_url) image_url
          FROM tbl_product_image
          WHERE is_active = 1 AND is_delete = 0
          GROUP BY product_id
        ) pi ON pi.product_id = p.id
        WHERE o.user_id = ? AND o.is_active = 1 AND o.is_delete = 0
        ORDER BY o.created_at DESC
      `;

      const rows = await db.query(sql, [user_id]);

      if (!rows.length) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "No orders found",
          { current: [], delivered: [], all: [] },
        );
      }

      // Status Map
      const statusMap = {
        delivered: { label: "Delivered", tab: "delivered" },
        cancelled: { label: "Cancelled", tab: "current" },
        placed: { label: "On The Way", tab: "current" },
      };

      const orderMap = {};

      rows.forEach((r) => {
        if (!orderMap[r.order_id]) {
          const status = statusMap[r.order_status] || {
            label: "Current",
            tab: "current",
          };

          const last4 = r.card_number?.replace(/\s/g, "").slice(-4);

          orderMap[r.order_id] = {
            order_id: r.order_id,
            order_code: r.order_code,
            order_date: r.order_date,
            total_amount: Number(r.total_amount || 0),
            total_amount_label: `OMR ${Number(r.total_amount || 0).toFixed(2)}`,
            payment_mode: r.payment_mode,
            paid_by: {
              method: r.payment_mode,
              card_masked: last4 ? `**** **** ${last4}` : null,
            },
            location: {
              latitude: r.latitude,
              longitude: r.longitude,
              address: r.location,
            },
            order_status: r.order_status,
            order_status_label: status.label,
            tab_type: status.tab,
            items: [],
          };
        }

        if (r.variant_id) {
          orderMap[r.order_id].items.push({
            variant_id: r.variant_id,
            quantity: Number(r.quantity),
            price: Number(r.price),
            product_name: r.product_name,
            product_image: r.product_image,
          });
        }
      });

      const all = Object.values(orderMap).map((o) => {
        const first = o.items[0];
        return {
          ...o,
          ordered_items_preview: {
            item_name: first?.product_name || null,
            item_image: first?.product_image || null,
            remaining_count: Math.max(o.items.length - 1, 0),
          },
        };
      });

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "Order history fetched",
        {
          current: all.filter((o) => o.tab_type === "current"),
          delivered: all.filter((o) => o.tab_type === "delivered"),
          all,
        },
      );
    } catch (err) {
      console.error(err);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "Something went wrong",
      );
    }
  },

  async orderDetails(request, res) {
    try {
      const loginUser = request.loginUser || request.loginUser?.data || {};
      const user_id = loginUser.id;
      const order_id = Number(
        request.query?.order_id || request.body?.order_id || 0,
      );
      const order_code =
        request.query?.order_code || request.body?.order_code || null;

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_unauthorized",
          null,
        );
      }

      if (!order_id && !order_code) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.MISSING_FIELD,
          "rest_keywords_required_fields_missing",
          { fields: "order_id or order_code" },
        );
      }

      const orderSql = `SELECT
          o.id AS order_id,
          o.order_code,
          o.order_date,
          o.subtotal,
          o.tax,
          o.discount,
          o.total,
          o.total_amount,
          o.latitude,
          o.longitude,
          o.location,
          o.payment_mode,
          o.order_status,
          COALESCE(ua.name, u.name) AS delivery_name,
          ua.address_line_1,
          ua.address_line_2,
          ua.city,
          ua.state,
          ua.country,
          ua.postal_code,
          ua.latitude AS address_latitude,
          ua.longitude AS address_longitude
        FROM tbl_orders o
        LEFT JOIN tbl_user u ON u.id = o.user_id
        LEFT JOIN tbl_user_address ua ON ua.id = (
          SELECT a.id
          FROM tbl_user_address a
          WHERE a.user_id = o.user_id
            AND a.is_active = 1
            AND a.is_delete = 0
          ORDER BY a.is_default DESC, a.id DESC
          LIMIT 1
        )
        WHERE o.user_id = ?
          AND o.is_active = 1
          AND o.is_delete = 0
          AND (${order_id ? "o.id = ?" : "o.order_code = ?"})
        LIMIT 1`;

      const orderRows = await db.query(orderSql, [
        user_id,
        order_id || order_code,
      ]);
      const order = orderRows?.[0];

      if (!order) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          null,
        );
      }

      const itemsSql = `SELECT
          oi.variant_id,
          oi.quantity,
          oi.price,
          p.name AS product_name,
          COALESCE(pi.image_url, '') AS product_image
        FROM tbl_order_items oi
        LEFT JOIN tbl_product_variant pv ON pv.id = oi.variant_id
        LEFT JOIN tbl_product p ON p.id = pv.product_id
        LEFT JOIN (
          SELECT product_id, MIN(image_url) AS image_url
          FROM tbl_product_image
          WHERE is_active = 1 AND is_delete = 0
          GROUP BY product_id
        ) pi ON pi.product_id = p.id
        WHERE oi.order_id = ?
          AND oi.is_active = 1
          AND oi.is_delete = 0
        ORDER BY oi.id ASC`;

      const itemRows = await db.query(itemsSql, [order.order_id]);

      const items = (itemRows || []).map((item) => {
        return {
          variant_id: item.variant_id,
          product_name: item.product_name || "",
          product_image: item.product_image || "",
          quantity: Number(item.quantity || 0),
          price: Number(item.price || 0),
        };
      });

      const addressParts = [
        order.address_line_1,
        order.address_line_2,
        order.city,
        order.state,
        order.country,
        order.postal_code,
      ].filter((part) => part && String(part).trim().toLowerCase() !== "null");

      const responseData = {
        order_id: order.order_id,
        order_code: order.order_code,
        order_date: order.order_date,
        order_status: order.order_status,
        delivery_address: {
          name: order.delivery_name || null,
          address:
            addressParts.length > 0 ? addressParts.join(", ") : order.location,
          latitude: order.address_latitude || order.latitude,
          longitude: order.address_longitude || order.longitude,
        },
        order_info: items,
        summary: {
          sub_total: Number(order.subtotal || 0),
          tax: Number(order.tax || 0),
          discount: Number(order.discount || 0),
          total: Number(order.total || order.total_amount || 0),
        },
        payment_mode: order.payment_mode,
      };

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "ORDER_DETAILS_FETCHED_SUCCESSFULLY",
        responseData,
      );
    } catch (err) {
      console.error(err);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "SOMETHING_WENT_WRONG",
        null,
      );
    }
  },

  async addRemoveFavourites(request, res) {
    try {
      const loginUser = request.loginUser || request.loginUser?.data || {};
      const user_id = loginUser.id;
      const product_id = Number(request.body?.product_id || 0);

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_unauthorized",
          null,
        );
      }

      if (!Number.isInteger(product_id) || product_id <= 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.MISSING_FIELD,
          "rest_keywords_required_fields_missing",
          { fields: "product_id" },
        );
      }

      const checkProduct = await db.query(
        `SELECT id FROM tbl_product WHERE id = ? AND is_active = 1 AND is_delete = 0`,
        [product_id],
      );
      if (!checkProduct || checkProduct.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_invalid_product",
          null,
        );
      }

      const existingFavouriteRows = await db.query(
        `SELECT id, is_active, is_delete FROM tbl_product_favourites WHERE user_id = ? AND product_id = ? LIMIT 1`,
        [user_id, product_id],
      );
      const existingFavourite = existingFavouriteRows?.[0];

      let is_favourite = false;
      let result;

      if (!existingFavourite) {
        result = await db.query(
          `INSERT INTO tbl_product_favourites (product_id, user_id, is_active, is_delete, created_at, updated_at)
           VALUES (?, ?, 1, 0, NOW(), NOW())`,
          [product_id, user_id],
        );
        is_favourite = true;
      } else if (
        Number(existingFavourite.is_active) === 1 &&
        Number(existingFavourite.is_delete) === 0
      ) {
        result = await db.query(
          `UPDATE tbl_product_favourites SET is_active = 0, is_delete = 1, updated_at = NOW() WHERE id = ?`,
          [existingFavourite.id],
        );
        is_favourite = false;
      } else {
        result = await db.query(
          `UPDATE tbl_product_favourites SET is_active = 1, is_delete = 0, updated_at = NOW() WHERE id = ?`,
          [existingFavourite.id],
        );
        is_favourite = true;
      }

      if (!result || result.affectedRows <= 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.INTERNAL_ERROR,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_error",
          null,
        );
      }

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "rest_keywords_success",
        { product_id, is_favourite },
      );
    } catch (error) {
      console.error("Error toggling favourite:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async favouriteListing(request, res) {
    try {
      const loginUser = request.loginUser || request.loginUser?.data || {};
      const user_id = loginUser.id;

      if (!user_id) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_keywords_unauthorized",
          null,
        );
      }

      const safePage = Math.max(Number(request.query?.page) || 1, 1);
      const safeLimit = Math.min(
        Math.max(Number(request.query?.limit) || 20, 1),
        100,
      );
      const offset = (safePage - 1) * safeLimit;

      const countSql = `SELECT COUNT(*) AS total
        FROM tbl_product_favourites pf
        INNER JOIN tbl_product p ON p.id = pf.product_id AND p.is_active = 1 AND p.is_delete = 0
        WHERE pf.user_id = ? AND pf.is_active = 1 AND pf.is_delete = 0`;
      const countRows = await db.query(countSql, [user_id]);
      const totalItems = Number(countRows?.[0]?.total || 0);

      const listSql = `SELECT
          pf.id AS favourite_id,
          p.id AS product_id,
          p.name,
          p.description,
          p.base_price,
          COALESCE(pi.image_url, '') AS image,
          COALESCE(pr_data.average_rating, 0) AS average_rating
        FROM tbl_product_favourites pf
        INNER JOIN tbl_product p ON p.id = pf.product_id AND p.is_active = 1 AND p.is_delete = 0
        LEFT JOIN (
          SELECT product_id, MIN(image_url) AS image_url
          FROM tbl_product_image
          WHERE is_active = 1 AND is_delete = 0
          GROUP BY product_id
        ) pi ON pi.product_id = p.id
        LEFT JOIN (
          SELECT product_id, AVG(rating) AS average_rating
          FROM tbl_product_rating
          WHERE is_active = 1 AND is_delete = 0
          GROUP BY product_id
        ) pr_data ON pr_data.product_id = p.id
        WHERE pf.user_id = ? AND pf.is_active = 1 AND pf.is_delete = 0
        ORDER BY pf.id DESC
        LIMIT ? OFFSET ?`;

      const rows = await db.query(listSql, [user_id, safeLimit, offset]);

      const responseData = {
        items: (rows || []).map((row) => ({
          favourite_id: row.favourite_id,
          product_id: row.product_id,
          name: row.name,
          description: row.description,
          base_price: Number(row.base_price || 0),
          image: row.image,
          average_rating: Number(row.average_rating || 0),
          is_favourite: true,
        })),
        pagination: {
          page: safePage,
          limit: safeLimit,
          total: totalItems,
          total_pages: Math.ceil(totalItems / safeLimit),
        },
      };

      if (!responseData.items.length) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.NO_DATA_FOUND,
          "rest_no_data_found",
          responseData,
        );
      }

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "rest_keywords_success",
        responseData,
      );
    } catch (error) {
      console.error("Error fetching favourites:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async addRating(request, res) {
    try {
      const user_id = request.loginUser?.id;
      const { product_id, rating, review } = request.body || {};

      const checkProduct = await db.query(
        `SELECT id FROM tbl_product WHERE id = ? AND is_active = 1 AND is_delete = 0`,
        [product_id],
      );
      if (!checkProduct || checkProduct.length === 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_invalid_product",
          null,
        );
      }

      const existingRating = await db.query(
        `SELECT id FROM tbl_product_rating WHERE user_id = ? AND product_id = ? AND is_active = 1 AND is_delete = 0`,
        [user_id, product_id],
      );
      if (existingRating && existingRating.length > 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_rating_already_exists",
          null,
        );
      }

      const addRatings = await db.query(
        `INSERT INTO tbl_product_rating (user_id, product_id, rating, review, is_active, is_delete) VALUES (?, ?, ?, ?, 1, 0)`,
        [user_id, product_id, rating, review],
      );
      if (addRatings && addRatings.affectedRows > 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_SUCCESS,
          "rest_rating_added_successfully",
          null,
        );
      }
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_failed_to_add_rating",
        null,
      );
    } catch (error) {
      console.error("Error adding rating:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async getNotifications(request, res) {
    try {
      const user_id = request.loginUser?.id;
      const notificationsSql = `SELECT id, title, description , date_format(created_at, '%Y-%m-%d %H:%i:%s') as created_at FROM tbl_notification WHERE receiver_id = ? AND is_active = 1 AND is_delete = 0 ORDER BY created_at DESC`;
      const notifications = await db.query(notificationsSql, [user_id]);
      const updateReadSql = `UPDATE tbl_notification SET is_read = 1 WHERE receiver_id = ? AND is_active = 1 AND is_delete = 0`;
      await db.query(updateReadSql, [user_id]);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "rest_notifications_fetched_successfully",
        notifications,
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async listAddresses(request, res) {
    try {
      const user_id = request.loginUser?.id;
      const addressesSql = `SELECT id, name, address_line_1, address_line_2, city, state, country, postal_code, latitude, longitude, is_default FROM tbl_user_address WHERE user_id = ? AND is_active = 1 AND is_delete = 0 ORDER BY is_default DESC, id DESC`;
      const addresses = await db.query(addressesSql, [user_id]);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_SUCCESS,
        "rest_addresses_fetched_successfully",
        addresses,
      );
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async setAddress(request, res) {
    try {
      const { address_id } = request.body || {};
      const user_id = request.loginUser?.id;

      const setAddress = await db.query(
        `UPDATE tbl_user_address SET is_default = CASE WHEN id = ? THEN 1 ELSE 0 END WHERE user_id = ? AND is_active = 1 AND is_delete = 0`,
        [address_id, user_id],
      );

      if (setAddress && setAddress.affectedRows > 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_SUCCESS,
          "rest_default_address_set_successfully",
          null,
        );
      } else {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_ERROR,
          "rest_failed_to_set_default_address",
          null,
        );
      }
    } catch (error) {
      console.log("Error setting default address:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async updateAddress(request, res) {
    try {
      const {
        address_id,
        name,
        address_line_1,
        address_line_2,
        city,
        state,
        country,
        postal_code,
        latitude,
        longitude,
      } = request.body || {};
      const user_id = request.loginUser?.id;

      const updateAddress = await db.query(
        `UPDATE tbl_user_address SET name = ?, address_line_1 = ?, address_line_2 = ?, city = ?, state = ?, country = ?, postal_code = ?, latitude = ?, longitude = ? WHERE id = ? AND user_id = ? AND is_active = 1 AND is_delete = 0`,
        [
          name,
          address_line_1,
          address_line_2,
          city,
          state,
          country,
          postal_code,
          latitude,
          longitude,
          address_id,
          user_id,
        ],
      );
      if (updateAddress && updateAddress.affectedRows > 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_SUCCESS,
          "rest_address_updated_successfully",
          null,
        );
      }
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_failed_to_update_address",
        null,
      );
    } catch (error) {
      console.log("Error updating address:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },

  async deleteAddress(request, res) {
    try {
      const { address_id } = request.body || {};
      const user_id = request.loginUser?.id;
      const deleteAddress = await db.query(
        `UPDATE tbl_user_address SET is_active = 0, is_delete = 1 , is_default = 0 WHERE id = ? AND user_id = ?  AND is_active = 1 AND is_delete = 0`,
        [address_id, user_id],
      );
      if (deleteAddress && deleteAddress.affectedRows > 0) {
        return middleware.sendApiResponse(
          res,
          STATUS_CODES.SUCCESS,
          STATUS_CODES.RESPONSE_SUCCESS,
          "rest_address_deleted_successfully",
          null,
        );
      }

      return middleware.sendApiResponse(
        res,
        STATUS_CODES.SUCCESS,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_address_aleardy_deleted",
        null,
      );
    } catch (error) {
      console.log("Error deleting address:", error);
      return middleware.sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_ERROR,
        STATUS_CODES.RESPONSE_ERROR,
        "rest_keywords_error",
        null,
      );
    }
  },
};

export default userModule;
