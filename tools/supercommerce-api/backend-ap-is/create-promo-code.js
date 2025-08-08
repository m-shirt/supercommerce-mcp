/**
 * Function to create a promo code.
 *
 * @param {Object} args - Arguments for creating the promo code.
 * @param {string} args.name - The name of the promo code.
 * @param {string} args.description - The description of the promo code.
 * @param {number} args.type - The type of the promo code (1 for Amount, 2 for Percent, etc.).
 * @param {number} args.amount - The amount of the promo code.
 * @param {string} args.expiration_date - The expiration date of the promo code.
 * @param {string} args.start_date - The start date of the promo code.
 * @param {number} [args.work_with_promotion=1] - Whether the promo works with promotions.
 * @param {number} [args.first_order=0] - Whether it is for the first order.
 * @param {number} [args.free_delivery=0] - Whether it includes free delivery.
 * @returns {Promise<Object>} - The result of the promo code creation.
 */
const executeFunction = async ({ name, description = '', type, amount, expiration_date, start_date, work_with_promotion = 1, first_order = 0, free_delivery = 0 }) => {
  const baseURL = ''; // will be provided by the user
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  const promoData = {
    name,
    description,
    type,
    amount,
    expiration_date,
    start_date,
    work_with_promotion,
    first_order,
    free_delivery,
    // other fields can be added here as needed
  };

  try {
    const response = await fetch(`${baseURL}/api/admin/promos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(promoData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating promo code:', error);
    return { error: 'An error occurred while creating the promo code.' };
  }
};

/**
 * Tool configuration for creating a promo code.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_promo_code',
      description: 'Create a new promo code.',
      parameters: {
        type: 'object',
        properties: {
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
            description: 'Whether the promo works with promotions.'
          },
          first_order: {
            type: 'integer',
            description: 'Whether it is for the first order.'
          },
          free_delivery: {
            type: 'integer',
            description: 'Whether it includes free delivery.'
          }
        },
        required: ['name', 'type', 'amount', 'expiration_date', 'start_date']
      }
    }
  }
};

export { apiTool };