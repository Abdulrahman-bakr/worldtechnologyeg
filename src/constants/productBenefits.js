import {
  // --- تم تحديث القائمة لتشمل الأيقونات المستخدمة فقط ---
  AcademicCapIcon,
  ArchiveBoxIcon,
  ArrowTrendingUpIcon,
  ArrowUturnLeftIcon,
  Battery100Icon,
  BeakerIcon,
  BellAlertIcon,
  BuildingStorefrontIcon,
  Cashdelivery,
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  CircleStackIcon,
  ClockIcon,
  CpuChipIcon,
  CubeIcon,
  CurrencyDollarIcon,
  CustomizableIcon,
  FireIcon,
  GiftIcon,
  GlobeAltIcon,
  HandThumbUpIcon,
  HeartIcon,
  InboxStackIcon,
  InstallmentplansIcon,
  LightweightIcon,
  LockClosedIcon,
  MapPinIcon,
  OriginalIcon,
  PhoneIcon,
  PuzzlePieceIcon,
  ReliablestoreIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SparklesIcon,
  SparepartsIcon,
  StarIcon,
  TagIcon,
  TrophyIcon,
  TruckIcon,
  VideoCameraIcon,
  WalletIcon,
  WifiIcon,
  WrenchScrewdriverIcon,
  bundleIcon,
} from '../components/icons/index.js';

export const PRODUCT_BENEFITS_LIST = [
  // --- الجودة والموثوقية (4 مزايا) ---
  { id: 'authenticity_guarantee', icon: OriginalIcon, title: 'أصلي 100%', description: 'ضمان جودة كاملة على كل المنتجات الأصلية.', category: 'الجودة والموثوقية' },
  { id: 'exceptional_quality', icon: TrophyIcon, title: 'جودة استثنائية', description: 'منتجات حائزة على جوائز ومصممة بأعلى معايير الجودة الاحترافية.', category: 'الجودة والموثوقية' },
  { id: 'lab_tested', icon: BeakerIcon, title: 'مُختبر معمليًا', description: 'تم اختباره لضمان مطابقته لأعلى معايير الجودة العالمية.', category: 'الجودة والموثوقية' },
  { id: 'official_distributor', icon: CheckBadgeIcon, title: 'موزع معتمد', description: 'نحن الوكيل الرسمي لهذه العلامة التجارية في منطقتك.', category: 'الجودة والموثوقية' },

  // --- الشحن والتوصيل (5 مزايا) ---
  { id: 'fast_shipping', icon: TruckIcon, title: 'شحن سريع', description: 'تجهيز فوري للطلب وتوصيل خلال 3-5 أيام عمل.', category: 'الشحن والتوصيل' },
  { id: 'global_shipping', icon: GlobeAltIcon, title: 'شحن لجميع المحافظات', description: 'نوصل أينما كنت داخل الجمهورية.', category: 'الشحن والتوصيل' },
  { id: 'secure_packaging', icon: CubeIcon, title: 'تغليف آمن', description: 'نضمن سلامة المنتج أثناء النقل بتغليف محكم.', category: 'الشحن والتوصيل' },
  { id: 'pickup_in_store', icon: BuildingStorefrontIcon, title: 'الاستلام من الفرع', description: 'اطلب أونلاين واستلم من أقرب فرع لك.', category: 'الشحن والتوصيل' },
  { id: 'in_stock_guarantee', icon: InboxStackIcon, title: 'توفر مضمون', description: 'جميع المنتجات المعروضة متوفرة في المخزون وجاهزة للشحن.', category: 'الشحن والتوصيل' },

  // --- الدفع والأسعار (5 مزايا) ---
  { id: 'secure_payment', icon: LockClosedIcon, title: 'دفع آمن ومشفر', description: 'خيارات دفع متنوعة ومؤمنة، مع تشفير كامل لبياناتك.', category: 'الدفع والأسعار' },
  { id: 'cash_on_delivery', icon: Cashdelivery, title: 'الدفع عند الاستلام', description: 'ادفع نقدًا عند استلام طلبك بكل سهولة.', category: 'الدفع والأسعار' },
  { id: 'best_price', icon: CurrencyDollarIcon, title: 'أفضل سعر', description: 'نضمن لك أفضل قيمة مقابل أموالك.', category: 'الدفع والأسعار' },
  { id: 'installment_plans', icon: InstallmentplansIcon, title: 'تقسيط مريح', description: 'قسّط مشترياتك عبر خدمات الدفع الآجل المعتمدة.', category: 'الدفع والأسعار' },
  { id: 'e_wallet_payment', icon: WalletIcon, title: 'دفع بالمحافظ الإلكترونية', description: 'ادفع بسهولة عبر فودافون كاش وغيرها.', category: 'الدفع والأسعار' },
  
  // --- الضمان وخدمة العملاء (5 مزايا) ---
  { id: 'return_policy', icon: ArrowUturnLeftIcon, title: 'استبدال واسترجاع مرن', description: 'سياسة استبدال واسترجاع خلال 14 يومًا.', category: 'الضمان والخدمة' },
  { id: 'expert_support', icon: AcademicCapIcon, title: 'دعم فني متخصص', description: 'فريق من الخبراء جاهز لمساعدتك في أي مشكلة تقنية.', category: 'الضمان والخدمة' },
  { id: 'certified_warranty', icon: ShieldCheckIcon, title: 'ضمان معتمد', description: 'ضمان على معظم المنتجات ضد عيوب الصناعة.', category: 'الضمان والخدمة' },
  { id: 'satisfaction_guarantee', icon: HandThumbUpIcon, title: 'ضمان الرضا', description: 'إذا لم تكن راضيًا، سنعمل على حل المشكلة فورًا.', category: 'الضمان والخدمة' },
  { id: 'customer_support', icon: PhoneIcon, title: 'خدمة عملاء مميزة', description: 'متواجدون لمساعدتك عبر الهاتف والدردشة الفورية.', category: 'الضمان والخدمة' },

  // --- خدمات ما بعد البيع (5 مزايا) ---
  { id: 'installation_support', icon: WrenchScrewdriverIcon, title: 'سهولة ودعم التركيب', description: 'يمكنك تركيبه بنفسك، مع توفر مساعدة فنية عند الحاجة.', category: 'خدمات ما بعد البيع' },
  { id: 'video_tutorials', icon: VideoCameraIcon, title: 'شروحات فيديو', description: 'تعلم كيفية استخدام وتركيب المنتج عبر فيديوهات تعليمية.', category: 'خدمات ما بعد البيع' },
  { id: 'spare_parts_availability', icon:SparepartsIcon, title: 'توفر قطع الغيار', description: 'ضمان توفر قطع الغيار الأصلية للمنتج.', category: 'خدمات ما بعد البيع' },
  { id: 'trade_in_program', icon: ArrowTrendingUpIcon, title: 'برنامج استبدال', description: 'استبدل جهازك القديم بخصم على منتج جديد من متجرنا.', category: 'خدمات ما بعد البيع' },
  { id: 'extended_warranty', icon: ShieldExclamationIcon, title: 'ضمان ممتد', description: 'أضف سنوات ضمان إضافية لراحة بال أكبر.', category: 'خدمات ما بعد البيع' },

  // --- العروض والمكافآت (6 مزايا) ---
  { id: 'loyalty_points', icon: GiftIcon, title: 'نقاط مكافآت', description: 'اجمع نقاطًا مع كل عملية شراء واستبدلها بخصومات.', category: 'العروض والمكافآت' },
  { id: 'exclusive_offers', icon: TagIcon, title: 'عروض حصرية', description: 'خصومات ومفاجآت دائمة على منتجات مختارة.', category: 'العروض والمكافآت' },
  { id: 'top_seller', icon: FireIcon, title: 'الأكثر مبيعًا', description: 'الخيار المفضل لآلاف العملاء.', category: 'العروض والمكافآت' },
  { id: 'new_arrival', icon: SparklesIcon, title: 'وصل حديثًا', description: 'كن أول من يقتني أحدث إصداراتنا.', category: 'العروض والمكافآت' },
  { id: 'bundle_and_save', icon: bundleIcon, title: 'اجمع ووفّر', description: 'احصل على خصم عند شراء المنتجات في باقة واحدة.', category: 'العروض والمكافآت' },
  { id: 'bulk_discounts', icon: CircleStackIcon, title: 'خصم الكميات', description: 'أسعار خاصة عند شراء كميات كبيرة.', category: 'العروض والمكافآت' },
  
  // --- مزايا المنتج (7 مزايا) ---
  { id: 'latest_technology', icon: CpuChipIcon, title: 'أحدث التقنيات', description: 'يحتوي على أحدث ما توصلت إليه التكنولوجيا.', category: 'مزايا المنتج' },
  { id: 'multi_functional', icon: PuzzlePieceIcon, title: 'متعدد الاستخدامات', description: 'يؤدي أكثر من وظيفة في جهاز واحد.', category: 'مزايا المنتج' },
  { id: 'lightweight', icon: LightweightIcon, title: 'خفيف الوزن', description: 'سهل الحمل والتنقل به من مكان لآخر.', category: 'مزايا المنتج' },
  { id: 'energy_efficient', icon: Battery100Icon, title: 'كفاءة في استهلاك الطاقة', description: 'منتجات موفرة للطاقة وصديقة للبيئة.', category: 'مزايا المنتج' },
  { id: 'customizable_options', icon:CustomizableIcon, title: 'قابل للتخصيص', description: 'اختر الألوان والمواصفات التي تناسبك.', category: 'مزايا المنتج' },
  { id: 'compact_design', icon: ArchiveBoxIcon, title: 'تصميم مدمج', description: 'حجم مثالي لا يشغل مساحة كبيرة.', category: 'مزايا المنتج' },
  { id: 'smart_home_compatible', icon: WifiIcon, title: 'متوافق مع المنزل الذكي', description: 'يمكن التحكم فيه عبر مساعد جوجل وأليكسا.', category: 'مزايا المنتج' },

  // --- تجربة المستخدم (5 مزايا) ---
  { id: 'product_comparison', icon: ScaleIcon, title: 'مقارنة المنتجات', description: 'قارن بين مواصفات المنتجات المختلفة لتختار الأنسب لك.', category: 'تجربة المستخدم' },
  { id: 'compatibility_guide', icon: PuzzlePieceIcon, title: 'دليل التوافق', description: 'تأكد من توافق المنتج مع أجهزتك الأخرى بكل سهولة.', category: 'تجربة المستخدم' },
  { id: 'wishlist_feature', icon: HeartIcon, title: 'قائمة الأمنيات', description: 'احفظ منتجاتك المفضلة لشرائها لاحقًا.', category: 'تجربة المستخدم' },
  { id: 'order_tracking', icon: MapPinIcon, title: 'تتبع طلبك', description: 'تابع حالة طلبك خطوة بخطوة حتى يصل إليك.', category: 'تجربة المستخدم' },
  { id: 'instant_notifications', icon: BellAlertIcon, title: 'تنبيهات فورية', description: 'إشعارات لحالة الطلب حتى الاستلام.', category: 'تجربة المستخدم' },

  // --- الثقة والمجتمع (4 مزايا) ---
  { id: 'trusted_store', icon: ReliablestoreIcon, title: 'متجر موثوق', description: 'خبرة في السوق وضمان ثقة العملاء.', category: 'الثقة والمجتمع' },
  { id: 'verified_reviews', icon: StarIcon, title: 'تقييمات حقيقية', description: 'جميع التقييمات من عملاء موثوقين.', category: 'الثقة والمجتمع' },
  { id: 'expert_reviews', icon: ChatBubbleBottomCenterTextIcon, title: 'مراجعات الخبراء', description: 'شاهد مراجعات وتقييمات تفصيلية من خبرائنا التقنيين.', category: 'الثقة والمجتمع' },
  { id: 'early_access', icon: ClockIcon, title: 'وصول مبكر', description: 'كن أول من يعرف ويشتري من تشكيلاتنا الجديدة.', category: 'الثقة والمجتمع' },
];

export const PRODUCT_BENEFITS_MAP = new Map(PRODUCT_BENEFITS_LIST.map(b => [b.id, b]));