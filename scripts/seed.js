'use strict';

const fs = require('fs');
const path = require('path');

async function seedProducts() {
  const productsPath = path.join(__dirname, '../data/products.json');
  if (!fs.existsSync(productsPath)) {
    console.warn('No products.json found, skipping product import.');
    return;
  }
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  for (const item of products) {
    // Ensure categories exist or create them
    const categoryIds = [];
    if (item.categories && Array.isArray(item.categories)) {
      for (const cat of item.categories) {
        const existing = await strapi.entityService.findMany('api::category.category', {
          filters: { name: cat },
        });
        let category;
        if (existing && existing.length > 0) {
          category = existing[0];
        } else {
          category = await strapi.entityService.create('api::category.category', {
            data: { name: cat },
          });
        }
        categoryIds.push(category.id);
      }
    }

    // Check if product exists
    const existingProduct = await strapi.entityService.findMany('api::product.product', {
      filters: { slug: item.slug },
    });

    if (!existingProduct || existingProduct.length === 0) {
      // Create product
      try {
        await strapi.entityService.create('api::product.product', {
          data: {
            title: item.title,
            slug: item.slug,
            categories: categoryIds,
            isPublished: item.isPublished,
            // Add other fields as needed
          },
        });
        console.log(`✅ Created product: ${item.title}`);
      } catch (error) {
        console.error(`❌ Failed to create product: ${item.title}`);
        if (error && error.details && error.details.errors) {
          error.details.errors.forEach((err, idx) => {
            console.error(`  [${idx + 1}] Path: ${err.path}, Message: ${err.message}`);
          });
        } else {
          console.error(error);
        }
      }
    } else {
      console.log(`⚠️ Skipped (already exists): ${item.title}`);
    }
  }
  console.log('✅ Product seeding complete');
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';
  await seedProducts();
  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
