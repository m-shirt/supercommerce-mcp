/**
 * Function to create a variant product.
 *
 * @param {Object} args - Arguments for creating the variant product.
 * @param {string} args.id - The ID of the main product to which the variant will be added.
 * @param {Object} args.variantData - The data for the variant product.
 * @returns {Promise<Object>} - The result of the variant product creation.
 */
const executeFunction = async ({ id, variantData }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    // Construct the URL for the API request
    const url = `${baseURL}/api/admin/products/${id}/variants`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(variantData)
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
    console.error('Error creating variant product:', error);
    return { error: 'An error occurred while creating the variant product.' };
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
      description: 'Create a variant product for a main product.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the main product to which the variant will be added.'
          },
          variantData: {
            type: 'object',
            description: 'The data for the variant product.'
          }
        },
        required: ['id', 'variantData']
      }
    }
  }
};

export { apiTool };