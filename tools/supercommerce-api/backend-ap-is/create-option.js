/**
 * Function to create an option in the categories API.
 *
 * @param {Object} args - The data for the new option.
 * @param {string} args.name - The name of the main category.
 * @param {string} args.name_ar - The name of the main category in Arabic.
 * @param {string} args.image - The URL of the category image.
 * @param {string} args.slug - The slug for the category.
 * @param {string} [args.description=""] - The description of the category.
 * @param {string} [args.description_ar=""] - The description of the category in Arabic.
 * @param {number} [args.order=1] - The order of the category.
 * @param {number} [args.featured=0] - Indicates if the category is featured.
 * @param {Array} args.sub_categories - The subcategories associated with the main category.
 * @returns {Promise<Object>} - The result of the category creation.
 */
const executeFunction = async ({ name, name_ar, image, slug, description = "", description_ar = "", order = 1, featured = 0, sub_categories }) => {
 const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;
  try {
    const url = `${baseURL}/api/admin/categories`;

    const body = JSON.stringify({
      name,
      name_ar,
      image,
      slug,
      description,
      description_ar,
      order,
      featured,
      sub_categories
    });

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

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
    console.error('Error creating option:', error);
    return { error: 'An error occurred while creating the option.' };
  }
};

/**
 * Tool configuration for creating an option in the categories API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_option',
      description: 'Create a new option in the categories API.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the main category.'
          },
          name_ar: {
            type: 'string',
            description: 'The name of the main category in Arabic.'
          },
          image: {
            type: 'string',
            description: 'The URL of the category image.'
          },
          slug: {
            type: 'string',
            description: 'The slug for the category.'
          },
          description: {
            type: 'string',
            description: 'The description of the category.'
          },
          description_ar: {
            type: 'string',
            description: 'The description of the category in Arabic.'
          },
          order: {
            type: 'integer',
            description: 'The order of the category.'
          },
          featured: {
            type: 'integer',
            description: 'Indicates if the category is featured.'
          },
          sub_categories: {
            type: 'array',
            items: { type: 'string' },
            description: 'The subcategories associated with the main category.'
          }
        },
        required: ['name', 'name_ar', 'image', 'slug', 'sub_categories']
      }
    }
  }
};

export { apiTool };