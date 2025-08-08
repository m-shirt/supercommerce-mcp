const executeFunction = async ({ page = 1, q = '', mode = 'promocode' }) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  let apiMode = mode;

  // If mode is 'all' or an array containing both 'promocode' and 'reward', send null
  if (mode === 'all') {
    apiMode = null;
  } else if (Array.isArray(mode)) {
    const hasPromo = mode.includes('promocode');
    const hasReward = mode.includes('reward');
    if (hasPromo && hasReward) {
      apiMode = null;
    } else if (hasPromo) {
      apiMode = 'promocode';
    } else if (hasReward) {
      apiMode = 'reward';
    }
  }

  try {
    const url = new URL(`${baseURL}/api/admin/promos`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('q', q);
    if (apiMode !== null) {
      url.searchParams.append('mode', apiMode);
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching promo code list:', error);
    return { error: 'An error occurred while fetching the promo code list.' };
  }
};