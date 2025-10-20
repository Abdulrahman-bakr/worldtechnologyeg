
export const SortOption = {
      Default: "default",
      Newest: "newest",
      NameAZ: "name_az",
      NameZA: "name_za",
      PriceLowHigh: "price_lh",
      PriceHighLow: "price_hl",
      RatingHighLow: "rating_hl", // Added for sorting by rating
    };
    
export const SORT_OPTIONS = [
  { value: SortOption.Default, label: "الترتيب الافتراضي" },
  { value: SortOption.Newest, label: "الأحدث أولاً" },
  { value: SortOption.NameAZ, label: "الاسم (أ - ي)" },
  { value: SortOption.NameZA, label: "الاسم (ي - أ)" },
  { value: SortOption.PriceLowHigh, label: "السعر (من الأقل للأعلى)" },
  { value: SortOption.PriceHighLow, label: "السعر (من الأعلى للأقل)" },
  { value: SortOption.RatingHighLow, label: "التقييم (من الأعلى للأقل)"},
];
