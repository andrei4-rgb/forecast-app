const { faker } = require('@faker-js/faker');
const fs = require('fs');

const products = [];

for (let i = 1; i <= 100; i++) {
  products.push({
    id: i,
    name: faker.commerce.productName(),
    inventory: faker.number.int({ min: 0, max: 50 }),
    avgSales: faker.number.int({ min: 10, max: 70 }),
    leadTime: faker.number.int({ min: 1, max: 7 })
  });
}

fs.writeFileSync('public/products.json', JSON.stringify(products, null, 2));
console.log("✅ products.json generated with 100 fake products!");
