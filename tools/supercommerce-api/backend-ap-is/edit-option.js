/**
 * Function to edit an option in the backend API.
 *
 * @param {Object} args - Arguments for editing the option.
 * @param {string} args.id - The ID of the option to edit.
 * @param {Object} args.optionData - The data to update the option with.
 * @param {string} [args.baseURL] - The base URL of the API.
 * @returns {Promise<Object>} - The result of the edit operation.
 */
const executeFunction = async ({ id, optionData, baseURL }) => {
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the PATCH request
    const url = `${baseURL}/api/admin/options/${id}`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(optionData)
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
    console.error('Error editing option:', error);
    return { error: 'An error occurred while editing the option.' };
  }
};

/**
 * Tool configuration for editing an option in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_option',
      description: 'Edit an option in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the option to edit.'
          },
          optionData: {
            type: 'object',
            description: 'The data to update the option with.'
          },
          baseURL: {
            type: 'string',
            description: 'The base URL of the API.'
          }
        },
        required: ['id', 'optionData']
      }
    }
  }
};

export { apiTool };