import axios from 'axios';

// Define the base URL for the FakeStoreAPI
const API_BASE_URL = 'https://fakestoreapi.com';

// Function to fetch all products from the API
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return an empty array on error to prevent the app from crashing
    return [];
  }
};

// Function to fetch a single product by its ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    // Return null on error
    return null;
  }
};