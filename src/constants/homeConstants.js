
import { ProductCategory } from './productCategories.js';

export const FEATURED_CATEGORIES_ON_HOME = [
  { title: "أحدث السماعات", categoryIds: [ProductCategory.BluetoothHeadphones, ProductCategory.WiredHeadphones], displayCategoryIdForViewAll: ProductCategory.BluetoothHeadphones, limit: 6 },
  { title: "شواحن", categoryIds: [ProductCategory.Chargers], displayCategoryIdForViewAll: ProductCategory.Chargers, limit: 6 },
  { title: "أفضل الكابلات والوصلات", categoryIds: [ProductCategory.Cables], displayCategoryIdForViewAll: ProductCategory.Cables, limit: 6 },
  { title: "المدفوعات الإلكترونية", categoryIds: [ProductCategory.ElectronicPayments], displayCategoryIdForViewAll: ProductCategory.ElectronicPayments, limit: 6 },
  { title: "جرابات موبايل ", categoryIds: [ProductCategory.MobileCases], displayCategoryIdForViewAll: ProductCategory.MobileCases, limit: 6 },
];