import axios from "axios";

const KEYSENDER_BASE_URL = process.env.KEYSENDER_API_URL || "https://panel.keysender.co.uk/api/v1.0";
const KEYSENDER_LOGIN_URL = `${KEYSENDER_BASE_URL}/login`;

// Login to Keysender and get access token
async function keysenderLogin(email: string, password: string): Promise<string> {
  try {
    const response = await axios.post(
      KEYSENDER_LOGIN_URL + `?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Keysender login error:", error.response?.data || error.message);
    throw error;
  }
}

// Fetch products from Keysender catalog 224125
async function getKeysenderProducts(token: string) {
  try {
    const response = await axios.get(`${KEYSENDER_BASE_URL}/databases?id=224125`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Keysender products error:", error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function main() {
  const email = process.env.KEYSENDER_EMAIL || "softlizenzgmbh@gmail.com"; // replace with your email
  const password = process.env.KEYSENDER_PASSWORD || "r@#&kI&1icLbWl"; // replace with your password
  try {
    const token = await keysenderLogin(email, password);
    console.log("Login successful! Access token:", token);
    const products = await getKeysenderProducts(token);
    console.log("Products:", products);
  } catch (error) {
    // Errors already logged in the functions
  }
}

main();
