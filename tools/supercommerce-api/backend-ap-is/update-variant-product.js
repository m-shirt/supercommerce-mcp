/**
 * Function to update a variant product.
 *
 * @param {Object} args - Arguments for updating the variant product.
 * @param {string} args.id - The ID of the product to update.
 * @param {string} args.variant - The ID of the variant to update.
 * @param {Object} args.productData - The data for the product variant.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ id, variant, productData }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the API request
    const url = `${baseURL}/api/admin/products/${id}/variants/${variant}`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productData)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating variant product:', error);
    return { error: 'An error occurred while updating the variant product.' };
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
      description: 'Update a variant product.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the product to update.'
          },
          variant: {
            type: 'string',
            description: 'The ID of the variant to update.'
          },
          productData: {
            type: 'object',
            description: 'The data for the product variant.'
          }
        },
        required: ['id', 'variant', 'productData']
      }
    }
  }
};

export { apiTool };