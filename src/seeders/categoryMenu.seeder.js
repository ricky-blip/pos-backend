const { Category, Menu } = require('../models');

function createPlaceholder({ label, accent, icon }) {
  const svg = `
    <svg width="640" height="400" viewBox="0 0 640 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="400" rx="32" fill="${accent.background}"/>
      <circle cx="540" cy="84" r="96" fill="${accent.glow}" opacity="0.38"/>
      <circle cx="118" cy="328" r="104" fill="${accent.glow}" opacity="0.28"/>
      <rect x="40" y="40" width="560" height="320" rx="28" fill="white" fill-opacity="0.18"/>
      <g transform="translate(212 74)">
        ${icon}
      </g>
      <text x="60" y="300" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="3">
        ${label.toUpperCase()}
      </text>
      <text x="60" y="334" fill="white" fill-opacity="0.9" font-family="Arial, sans-serif" font-size="40" font-weight="700">
        Placeholder
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const categoryPlaceholders = {
  foods: createPlaceholder({
    label: "Foods",
    accent: { background: "#f97316", glow: "#fdba74" },
    icon: `
      <rect x="44" y="138" width="128" height="18" rx="9" fill="white" fill-opacity="0.92"/>
      <path d="M54 132C54 96.6538 82.6538 68 118 68C153.346 68 182 96.6538 182 132V138H54V132Z" fill="white"/>
      <circle cx="88" cy="110" r="10" fill="#f97316"/>
      <circle cx="118" cy="96" r="10" fill="#f97316"/>
      <circle cx="146" cy="112" r="10" fill="#f97316"/>
      <path d="M202 70V162" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <path d="M226 70V162" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <path d="M250 70V162" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <path d="M226 70V52" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <path d="M284 70V112C284 132 300 148 320 148V162" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  }),
  beverages: createPlaceholder({
    label: "Beverages",
    accent: { background: "#0ea5e9", glow: "#7dd3fc" },
    icon: `
      <path d="M112 54V82" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <path d="M148 54V82" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <path d="M74 92H186V124C186 165.974 151.974 200 110 200C68.0264 200 34 165.974 34 124V92H74Z" fill="white"/>
      <path d="M186 104H220C241.539 104 259 121.461 259 143C259 164.539 241.539 182 220 182H196" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <path d="M74 92H186" stroke="#0ea5e9" stroke-width="8" stroke-linecap="round"/>
      <path d="M94 126C110 136 126 136 142 126C158 116 174 116 190 126" stroke="#0ea5e9" stroke-width="8" stroke-linecap="round"/>
    `,
  }),
  dessert: createPlaceholder({
    label: "Dessert",
    accent: { background: "#ec4899", glow: "#f9a8d4" },
    icon: `
      <path d="M66 154H210V182H66V154Z" fill="white"/>
      <path d="M82 96C82 81.6406 93.6406 70 108 70H168C182.359 70 194 81.6406 194 96V154H82V96Z" fill="white"/>
      <path d="M96 110C96 98.9543 104.954 90 116 90H160C171.046 90 180 98.9543 180 110V154H96V110Z" fill="#ec4899"/>
      <path d="M138 44V72" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <circle cx="138" cy="34" r="12" fill="white"/>
    `,
  }),
};

const seedCategoriesAndMenus = async () => {
  try {
    const categoryCount = await Category.count();
    if (categoryCount > 0) {
      console.log('Categories and Menus already seeded.');
      return;
    }

    const categoriesData = [
      { label: "Foods", slug: "foods" },
      { label: "Beverages", slug: "beverages" },
      { label: "Dessert", slug: "dessert" },
    ];

    const categories = await Category.bulkCreate(categoriesData, { returning: true });

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    const mockMenus = [
      { name: "Gado-gado Special", categoryId: categoryMap["foods"], price: 20000, unit: "portion", description: "Vegetables, egg, tempe, tofu, ketupat, peanut sauce, and kerupuk.", image: categoryPlaceholders.foods },
      { name: "Nasi Goreng Kampung", categoryId: categoryMap["foods"], price: 25000, unit: "plate", description: "Savory fried rice with egg, shredded chicken, pickles, and crackers.", image: categoryPlaceholders.foods },
      { name: "Mie Ayam Bowl", categoryId: categoryMap["foods"], price: 22000, unit: "bowl", description: "Springy noodles with seasoned chicken, greens, and crispy wonton.", image: categoryPlaceholders.foods },
      { name: "Sate Ayam", categoryId: categoryMap["foods"], price: 30000, unit: "portion", description: "Charcoal grilled chicken satay with peanut sauce and rice cake.", image: categoryPlaceholders.foods },
      { name: "Es Teh Manis", categoryId: categoryMap["beverages"], price: 8000, unit: "glass", description: "Fresh brewed sweet iced tea served chilled for dine-in or takeaway.", image: categoryPlaceholders.beverages },
      { name: "Kopi Latte", categoryId: categoryMap["beverages"], price: 18000, unit: "cup", description: "Espresso with creamy steamed milk and a soft foam finish.", image: categoryPlaceholders.beverages },
      { name: "Jus Alpukat", categoryId: categoryMap["beverages"], price: 17000, unit: "glass", description: "Fresh avocado juice with condensed milk and chocolate drizzle.", image: categoryPlaceholders.beverages },
      { name: "Pudding Coklat", categoryId: categoryMap["dessert"], price: 15000, unit: "cup", description: "Silky chocolate pudding topped with cream and grated chocolate.", image: categoryPlaceholders.dessert },
      { name: "Cheesecake Slice", categoryId: categoryMap["dessert"], price: 24000, unit: "slice", description: "Creamy baked cheesecake with a buttery biscuit crust.", image: categoryPlaceholders.dessert },
      { name: "Fruit Parfait", categoryId: categoryMap["dessert"], price: 21000, unit: "cup", description: "Layered yogurt, granola, and seasonal fruits for a light dessert.", image: categoryPlaceholders.dessert },
      { name: "Ayam Bakar Madu", categoryId: categoryMap["foods"], price: 32000, unit: "plate", description: "Honey glazed grilled chicken served with sambal and warm rice.", image: categoryPlaceholders.foods },
      { name: "Lemon Tea", categoryId: categoryMap["beverages"], price: 12000, unit: "glass", description: "Refreshing iced lemon tea with a bright citrus finish.", image: categoryPlaceholders.beverages },
    ];

    await Menu.bulkCreate(mockMenus);
    console.log('✅ Categories and Menus seeded successfully!');
  } catch (error) {
    console.error('❌ Gagal menjalankan seeder categories dan menus:', error);
  }
};

module.exports = { seedCategoriesAndMenus };
