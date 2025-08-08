/**
 * Function to edit a promo code.
 *
 * @param {Object} args - Arguments for editing the promo code.
 * @param {string} args.id - The ID of the promo code to edit.
 * @param {string} args.name - The name of the promo code.
 * @param {string} args.description - The description of the promo code.
 * @param {number} args.type - The type of the promo code (1 for Amount, 2 for Percent, etc.).
 * @param {number} args.amount - The amount of the promo code.
 * @param {string} args.expiration_date - The expiration date of the promo code.
 * @param {string} args.start_date - The start date of the promo code.
 * @param {number} [args.work_with_promotion=1] - Whether the promo works with promotions (1 for yes, 2 for no).
 * @returns {Promise<Object>} - The result of the edit promo code operation.
 */
const executeFunction = async ({ id, name, description = '', type, amount, expiration_date, start_date, work_with_promotion = 1 }) => {
  const baseURL = ''; // will be provided by the user
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  const url = `${baseURL}/api/admin/promos/${id}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    name,
    description,
    type,
    amount,
    expiration_date,
    start_date,
    work_with_promotion
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error editing promo code:', error);
    return { error: 'An error occurred while editing the promo code.' };
  }
};

/**
 * Tool configuration for editing a promo code.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_promo_code',
      description: 'Edit a promo code.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the promo code to edit.'
          },
          name: {
            type: 'string',
            description: 'The name of the promo code.'
          },
          description: {
            type: 'string',
            description: 'The description of the promo code.'
          },
          type: {
            type: 'integer',
            description: 'The type of the promo code (1 for Amount, 2 for Percent, etc.).'
          },
          amount: {
            type: 'number',
            description: 'The amount of the promo code.'
          },
          expiration_date: {
            type: 'string',
            description: 'The expiration date of the promo code.'
          },
          start_date: {
            type: 'string',
            description: 'The start date of the promo code.'
          },
          work_with_promotion: {
            type: 'integer',
            description: 'Whether the promo works with promotions (1 for yes, 2 for no).'
          }
        },
        required: ['id', 'name', 'type', 'amount', 'expiration_date', 'start_date']
      }
    }
  }
};

export { apiTool };