/**
 * Function to update a variant product.
 *
 * @param {string} main_id - The ID of the main product to which the variant belongs.
 * @param {string} variant_id - The ID of the variant to update.
 * @param {boolean} product_with_variant - Whether the product has variants.
 * @param {string} description - The HTML description of the variant product.
 * @param {string} description_ar - The Arabic HTML description of the variant product.
 * @param {string} image - URL of the main image for the variant.
 * @param {Array<Object>} images - Array of image objects with URL properties.
 * @param {number} order - The display order of the variant.
 * @param {string} long_description_ar - Long Arabic description (HTML).
 * @param {string} long_description_en - Long English description (HTML).
 * @param {string} name - Name of the variant product.
 * @param {string} name_ar - Arabic name of the variant.
 * @param {string} meta_title - Meta title for SEO.
 * @param {string} meta_description - Meta description for SEO.
 * @param {string} meta_title_ar - Arabic meta title for SEO.
 * @param {string} meta_description_ar - Arabic meta description for SEO.
 * @param {Array<Object>} options - Array of option objects with `option_id` and `option_value_id`.
 * @param {boolean} free_delivery - Whether free delivery is enabled.
 * @param {boolean} disable_free_delivery - Whether free delivery is disabled.
 * @param {string} sku - SKU for the variant product.
 * @param {string} barcode - Barcode for the variant product.
 * @param {Array<Object>} inventories - Array of inventory objects, including stock and prices.
 * @param {number} weight - Weight of the variant product.
 * @param {string} [slug] - Optional URL slug for the variant product. Should only be sent if the user wants to update it.
 * @returns {Promise<Object>} The result of the variant product update operation.
 */
const executeFunction = async (
  main_id,
  variant_id,
  product_with_variant,
  description,
  description_ar,
  image,
  images,
  order,
  long_description_ar,
  long_description_en,
  name,
  name_ar,
  meta_title,
  meta_description,
  meta_title_ar,
  meta_description_ar,
  options,
  free_delivery,
  disable_free_delivery,
  sku,
  barcode,
  inventories,
  weight,
  slug // optional
) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/products/${main_id}/variants/${variant_id}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    // Build the variant data object conditionally
    const variantData = {
      product_with_variant,
      description,
      description_ar,
      image,
      images,
      order,
      long_description_ar,
      long_description_en,
      name,
      name_ar,
      meta_title,
      meta_description,
      meta_title_ar,
      meta_description_ar,
      options,
      free_delivery,
      disable_free_delivery,
      sku,
      barcode,
      inventories,
      weight,
    };

    // Add slug only if provided to avoid overwriting unintentionally
    if (slug !== undefined && slug !== null && slug !== '') {
      variantData.slug = slug;
    }

    const response = await fetch(url, {
      method: 'PUT', 
      headers,
      body: JSON.stringify(variantData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || JSON.stringify(errorData);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating variant product:', error);
    return { error: error.message || 'An error occurred while updating the variant product.' };
  }
};

/**
 * Tool configuration for updating a variant product.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_variant_product',
      description: `1- Create main product first then create or update variants (main SKU prefix: main_{{sku}}).
2- If the product has multiple variants (e.g. colors), add product_variant_options to allow selection between variants.
3- Call inventories and customer group APIs to get IDs and add pricing & stock data accordingly.
4- Do not set or overwrite the slug unless explicitly provided by the user.`,
      parameters: {
        type: 'object',
        properties: {
          main_id: { type: 'string', description: 'The ID of the main product.' },
          variant_id: { type: 'string', description: 'The ID of the variant product.' },
          product_with_variant: { type: 'boolean', description: 'Whether the product has variants.' },
          description: { type: 'string', description: 'HTML description of the variant.' },
          description_ar: { type: 'string', description: 'Arabic HTML description of the variant.' },
          image: { type: 'string', description: 'URL of the main variant image.' },
          images: {
            type: 'array',
            items: { type: 'object', properties: { url: { type: 'string' } } },
            description: 'Array of images with URLs.'
          },
          order: { type: 'integer', description: 'Display order of the variant.' },
          long_description_ar: { type: 'string', description: 'Long Arabic description (HTML).' },
          long_description_en: { type: 'string', description: 'Long English description (HTML).' },
          name: { type: 'string', description: 'Name of the variant product.' },
          name_ar: { type: 'string', description: 'Arabic name of the variant.' },
          meta_title: { type: 'string', description: 'SEO meta title.' },
          meta_description: { type: 'string', description: 'SEO meta description.' },
          meta_title_ar: { type: 'string', description: 'Arabic SEO meta title.' },
          meta_description_ar: { type: 'string', description: 'Arabic SEO meta description.' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                option_id: { type: 'integer' },
                option_value_id: { type: 'string' }
              }
            },
            description: 'Array of option IDs and their values.'
          },
          free_delivery: { type: 'boolean', description: 'If free delivery is enabled.' },
          disable_free_delivery: { type: 'boolean', description: 'If free delivery is disabled.' },
          sku: { type: 'string', description: 'SKU for the variant.' },
          barcode: { type: 'string', description: 'Barcode for the variant.' },
          inventories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                stock: { type: 'string' },
                prices: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      customer_group_id: { type: 'integer' },
                      price: { type: 'string' },
                      discount_price: { type: 'number' },
                      discount_price_amount_type: { type: 'string' },
                      discount_price_percentage: { type: 'string' },
                      discount_start_date: { type: 'string', format: 'date-time' },
                      discount_end_date: { type: 'string', format: 'date-time' },
                    }
                  }
                }
              }
            },
            description: 'Inventory details including stock and pricing.'
          },
          weight: { type: 'number', description: 'Weight of the variant product.' },
          slug: { type: 'string', description: 'URL slug for the variant. Only send if you want to update.' },
        },
        required: ['main_id', 'variant_id', 'product_with_variant', 'name', 'sku', 'options'],
      },
    },
  },
};

export { apiTool };
