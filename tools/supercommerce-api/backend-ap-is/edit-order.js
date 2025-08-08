/**
 * Function to edit an order in the backend API.
 *
 * @param {Object} args - Arguments for editing the order.
 * @param {number} args.id - The ID of the order to edit.
 * @param {number} args.user_id - The user ID associated with the order.
 * @param {number} args.address_id - The address ID for the order.
 * @param {Array<Object>} args.items - The items in the order.
 * @param {string} [args.notes=""] - Any notes related to the order.
 * @param {number} [args.delivery_fees=0] - The delivery fees for the order.
 * @param {boolean} [args.notify_customer=true] - Whether to notify the customer.
 * @returns {Promise<Object>} - The result of the order edit operation.
 */
const executeFunction = async ({ id, user_id, address_id, items, notes = "", delivery_fees = 0, notify_customer = true }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    const url = `${baseURL}/api/admin/orders/${id}`;
    
    const body = {
      user_id,
      address_id,
      items,
      notes,
      delivery_fees,
      has_address: address_id ? 1 : 0,
      has_customer: user_id ? 1 : 0,
      notify_customer,
      deleted_items: []
    };

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error editing order:', error);
    return { error: 'An error occurred while editing the order.' };
  }
};

/**
 * Tool configuration for editing orders in the backend API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'edit_order',
      description: 'Edit an order in the backend API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'The ID of the order to edit.'
          },
          user_id: {
            type: 'integer',
            description: 'The user ID associated with the order.'
          },
          address_id: {
            type: 'integer',
            description: 'The address ID for the order.'
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'The ID of the item.'
                },
                amount: {
                  type: 'integer',
                  description: 'The amount of the item.'
                },
                product_name: {
                  type: 'string',
                  description: 'The name of the product.'
                },
                sku: {
                  type: 'string',
                  description: 'The SKU of the product.'
                },
                disabled: {
                  type: 'boolean',
                  description: 'Whether the item is disabled.'
                }
              },
              required: ['id', 'amount', 'sku']
            },
            description: 'The items in the order.'
          },
          notes: {
            type: 'string',
            description: 'Any notes related to the order.'
          },
          delivery_fees: {
            type: 'integer',
            description: 'The delivery fees for the order.'
          },
          notify_customer: {
            type: 'boolean',
            description: 'Whether to notify the customer.'
          }
        },
        required: ['id', 'user_id', 'items']
      }
    }
  }
};

export { apiTool };