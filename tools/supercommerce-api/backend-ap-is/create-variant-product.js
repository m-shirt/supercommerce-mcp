/**
 * Function to create a variant product.
 *
 * @param {string} id - The ID of the main product to which the variant will be added.
 * @param {boolean} product_with_variant - Whether the product has variants.
 * @param {string} description - The HTML description of the product variant.
 * @param {string} description_ar - The Arabic HTML description of the product variant.
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
 * @param {string} slug - URL slug for the variant product.
 * @returns {Promise<Object>} - The result of the variant product creation.
 */
const executeFunction = async (
  id,
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
  slug
) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const url = `${baseURL}/api/admin/products/${id}/variants`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

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
      slug,
    };

    const response = await fetch(url, {
      method: 'POST',
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
    console.error('Error creating variant product:', error);
    return { error: error.message || 'An error occurred while creating the variant product.' };
  }
};

/**
 * Tool configuration for creating a variant product.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_variant_product',
      description: `1- When create a product must create main product first then create a variant (the sku for the main product is main_{{sku}}
2- if the product has multible variants (ex differant colors) must add product_variant_options like color to make user select beteen variants
3- Must call invetories api and custome rgroup api to find the ids and add data for each id
`,
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The ID of the main product.' },
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
          slug: { type: 'string', description: 'URL slug for the variant.' },
        },
        required: ['id', 'product_with_variant', 'name', 'sku', 'options'],
      },
    },
  },
};

export { apiTool };
