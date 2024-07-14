// retryAxios.js

import axios from 'axios';

export async function axiosRetry(config, maxRetries = 5) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Rate limit exceeded, apply exponential backoff
        const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff formula
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        retries++;
      } else {
        // Handle other errors here if needed
        throw error;
      }
    }
  }

  throw new Error('Max retries reached'); // Handle this as needed
}
