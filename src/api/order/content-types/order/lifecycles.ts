export default {
  async afterUpdate(event) {
    const { result, params } = event;
    const KEYSENDER_API_TOKEN = process.env.KEYSENDER_API_TOKEN 
    const KEYSENDER_API_URL = process.env.KEYSENDER_API_URL || 'https://api.keysender.com/v1/webhook';

    // Only send if status changed to 'paid'
    if (result.status !== 'paid') return;

    try {
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KEYSENDER_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: result.id,
          email: result.email,
          products: result.products.map((p) => ({
            title: p.title,
            sku: p.sku,
          })),
        }),
      });

      const data = await response.json();
      console.log('Keysender response:', data);
    } catch (err) {
      console.error('Keysender Webhook failed:', err);
    }
  },
};