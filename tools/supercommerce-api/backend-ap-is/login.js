/**
 * Function to log in to the backend API.
 *
 * @param {Object} args - Arguments for the login.
 * @param {string} args.email - The email address for login.
 * @param {string} args.password - The password for login.
 * @returns {Promise<Object>} - The result of the login operation.
 */
const executeFunction = async ({ email, password }) => {
  const baseURL = 'https://storeapi.el-dokan.com'; // will be provided by the user
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    // Construct the URL for the login endpoint
    const url = `${baseURL}/api/admin/auth`;

    // Set up the request body
    const body = JSON.stringify({ email, password });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
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
    console.error('Error logging in:', error);
    return { error: 'An error occurred during login.' };
  }
};

/**
 * Tool configuration for logging in to the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'login',
      description: 'Log in to the backend API.',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'The email address for login.'
          },
          password: {
            type: 'string',
            description: 'The password for login.'
          }
        },
        required: ['email', 'password']
      }
    }
  }
};

export { apiTool };