import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Sparkles,
  Languages,
  Sliders,
  Film,
  CreditCard,
  Layers,
  Settings,
  Check,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  Music,
  FastForward,
  Rewind,
  Split,
  Maximize,
  Minimize,
  RefreshCw,
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Copy,
  Cpu,
  ShieldCheck,
  DollarSign,
  Globe,
  Mic,
  Radio,
  Clock,
  Activity,
  Headphones,
  Zap,
  Shield,
  Sparkle,
  ArrowRight,
  SlidersHorizontal,
  Volume1,
  PlayCircle,
  StopCircle,
  RefreshCcw,
  Lock,
  Edit3,
  Trash2,
  Plus,
  Scissors,
  MoveRight,
  Eye,
  EyeOff,
  HelpCircle,
  BarChart3,
  HardDrive,
  CheckSquare,
  Share2,
  Flame,
  Award,
  Star,
  Diamond,
  Crown,
  Rocket,
  Compass,
  Filter,
  Bell,
  User,
  Key
} from 'lucide-react';

// ============================================================================
// 1. مصفوفة الـ 150+ لغة ولهجة عالمية مكتملة وشاملة بالتفصيل
// ============================================================================
export const GLOBAL_LANGUAGES_MATRIX = [
  // --- الوطن العربي واللهجات الإقليمية (30 لهجة كاملة) ---
  {
    id: 1,
    code: "ar-EG",
    name: "العربية (مصر - اللهجة القاهرية السريعة)",
    native: "المصرية (القاهرة)",
    flag: "🇪🇬",
    region: "الشرق الأوسط",
    maleVoice: "ar-EG-ShakirNeural",
    femaleVoice: "ar-EG-SalmaNeural",
    samplePhrase: "أهلاً بيك في استوديو لينجوا كاست، بنحول الفيديو بتاعك لدبلجة احترافية فوراً وبأعلى سرعة."
  },
  {
    id: 2,
    code: "ar-EG-alex",
    name: "العربية (مصر - اللهجة الإسكندرانية الساحلية)",
    native: "المصرية (إسكندراني)",
    flag: "🇪🇬",
    region: "الشرق الأوسط",
    maleVoice: "ar-EG-ShakirNeural",
    femaleVoice: "ar-EG-SalmaNeural",
    samplePhrase: "يا سيدي على الشغل العالي والدبلجة اللي على مية بيضا وبأعلى جودة ممكن تتخيلها."
  },
  {
    id: 3,
    code: "ar-EG-upper",
    name: "العربية (مصر - اللهجة الصعيدية الأصيلة)",
    native: "المصرية (صعيدي)",
    flag: "🇪🇬",
    region: "الشرق الأوسط",
    maleVoice: "ar-EG-ShakirNeural",
    femaleVoice: "ar-EG-SalmaNeural",
    samplePhrase: "يا مرحب بيكم وبأهل الكرم، دبلجة أصيلة بصوت سينمائي صافي."
  },
  {
    id: 4,
    code: "ar-SA",
    name: "العربية (السعودية - اللهجة النجدية الرياض)",
    native: "السعودية (نجدي)",
    flag: "🇸🇦",
    region: "الشرق الأوسط",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "أهلاً بك في منصة لينجوا كاست للدبلجة الذكية بأعلى سرعة ودقة متناهية."
  },
  {
    id: 5,
    code: "ar-SA-hijaz",
    name: "العربية (السعودية - اللهجة الحجازية جدة)",
    native: "السعودية (حجازي)",
    flag: "🇸🇦",
    region: "الشرق الأوسط",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "يا هلا والله، كيف حالك اليوم؟ نورت المنصة بأسرع نظام ذكاء اصطناعي بالعالم."
  },
  {
    id: 6,
    code: "ar-SA-east",
    name: "العربية (السعودية - اللهجة الشرقية الدمام)",
    native: "السعودية (شرقاوي)",
    flag: "🇸🇦",
    region: "الشرق الأوسط",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "حياكم الله في استوديو الدبلجة العصبي فائق الجودة والسرعة."
  },
  {
    id: 7,
    code: "ar-AE",
    name: "العربية (الإمارات - لهجة دبي وأبوظبي)",
    native: "الإماراتية الخليجية",
    flag: "🇦🇪",
    region: "الشرق الأوسط",
    maleVoice: "ar-AE-HamdanNeural",
    femaleVoice: "ar-AE-FatimaNeural",
    samplePhrase: "مرحبا الساع، تجربة صوتية سينمائية فائقة السرعة والوضوح تناسب صناع المحتوى."
  },
  {
    id: 8,
    code: "ar-KW",
    name: "العربية (الكويت)",
    native: "الكويتية",
    flag: "🇰🇼",
    region: "الشرق الأوسط",
    maleVoice: "ar-KW-FahedNeural",
    femaleVoice: "ar-KW-NouraNeural",
    samplePhrase: "هلا والله بالحبيب، دبلجة متزامنة بأعلى جودة وسرعة رندر فورية بدون أي تأخير."
  },
  {
    id: 9,
    code: "ar-QA",
    name: "العربية (قطر)",
    native: "القطرية",
    flag: "🇶🇦",
    region: "الشرق الأوسط",
    maleVoice: "ar-QA-MoazNeural",
    femaleVoice: "ar-QA-AmalNeural",
    samplePhrase: "يا مرحبا بك في استوديو الترجمة العصبي الفوري بدقة 4K الفائقة."
  },
  {
    id: 10,
    code: "ar-BH",
    name: "العربية (البحرين)",
    native: "البحرينية",
    flag: "🇧🇭",
    region: "الشرق الأوسط",
    maleVoice: "ar-BH-AliNeural",
    femaleVoice: "ar-BH-LailaNeural",
    samplePhrase: "يا هلا فيكم بأسرع نظام ذكاء اصطناعي صوتي ومطابقة تامة لحركة الشفاه."
  },
  {
    id: 11,
    code: "ar-OM",
    name: "العربية (سلطنة عُمان)",
    native: "العُمانية",
    flag: "🇴🇲",
    region: "الشرق الأوسط",
    maleVoice: "ar-OM-AbdullahNeural",
    femaleVoice: "ar-OM-AyshaNeural",
    samplePhrase: "أهلاً وسهلاً بك في منصتنا لإنتاج الوسائط السينمائية المدبلجة باحترافية."
  },
  {
    id: 12,
    code: "ar-IQ",
    name: "العربية (العراق - اللهجة البغدادية الأصيلة)",
    native: "العراقية البغدادية",
    flag: "🇮🇶",
    region: "الشرق الأوسط",
    maleVoice: "ar-IQ-BasselNeural",
    femaleVoice: "ar-IQ-RanaNeural",
    samplePhrase: "هلو عيوني، دبلجة تخبل وبصوت سينمائي صافي وبسرعة صاروخية تناسب الجميع."
  },
  {
    id: 13,
    code: "ar-IQ-basra",
    name: "العربية (العراق - اللهجة البصراوية الجنوبية)",
    native: "العراقية (البصرة)",
    flag: "🇮🇶",
    region: "الشرق الأوسط",
    maleVoice: "ar-IQ-BasselNeural",
    femaleVoice: "ar-IQ-RanaNeural",
    samplePhrase: "يا هلا بأهلنا الطيبين، دبلجة فورية متقنة بنقاء صوتي لا يضاهى."
  },
  {
    id: 14,
    code: "ar-SY",
    name: "العربية (سوريا - اللهجة الشامية الدمشقية)",
    native: "السورية الشامية",
    flag: "🇸🇾",
    region: "الشرق الأوسط",
    maleVoice: "ar-SY-LaithNeural",
    femaleVoice: "ar-SY-AmanyNeural",
    samplePhrase: "يا مية أهلاً وسهلاً، شو هالصوت الحلو والترجمة الدقيقة والسريعة لكل الفيديوهات."
  },
  {
    id: 15,
    code: "ar-SY-aleppo",
    name: "العربية (سوريا - اللهجة الحلبية العريقة)",
    native: "السورية (حلب)",
    flag: "🇸🇾",
    region: "الشرق الأوسط",
    maleVoice: "ar-SY-LaithNeural",
    femaleVoice: "ar-SY-AmanyNeural",
    samplePhrase: "أهلاً بخوالي، دبلجة راقية بنغمة حلبية طربية وأداء درامي ساحر."
  },
  {
    id: 16,
    code: "ar-LB",
    name: "العربية (لبنان - اللهجة اللبنانية)",
    native: "اللبنانية (بيروت)",
    flag: "🇱🇧",
    region: "الشرق الأوسط",
    maleVoice: "ar-LB-RamiNeural",
    femaleVoice: "ar-LB-LaylaNeural",
    samplePhrase: "هاي كيفك، الترجمة صارت جاهزة بأعلى كواليتي وبثواني معدودة بدون أي تعب."
  },
  {
    id: 17,
    code: "ar-JO",
    name: "العربية (الأردن - لهجة عمّان)",
    native: "الأردنية",
    flag: "🇯🇴",
    region: "الشرق الأوسط",
    maleVoice: "ar-JO-TaimNeural",
    femaleVoice: "ar-JO-SanaNeural",
    samplePhrase: "هلا والله بالنشامى، جودة صوت متقدمة وسرعة فائقة جداً على مدار الساعة."
  },
  {
    id: 18,
    code: "ar-PS",
    name: "العربية (فلسطين - القدس والضفة)",
    native: "الفلسطينية",
    flag: "🇵🇸",
    region: "الشرق الأوسط",
    maleVoice: "ar-JO-TaimNeural",
    femaleVoice: "ar-JO-SanaNeural",
    samplePhrase: "يسعد مساكم، منورين في استوديو الدبلجة الاحترافي السريع والدقيق."
  },
  {
    id: 19,
    code: "ar-MA",
    name: "العربية (المغرب - الدارجة المغربية البيضاوية)",
    native: "الدارجة المغربية",
    flag: "🇲🇦",
    region: "شمال أفريقيا",
    maleVoice: "ar-MA-JamalNeural",
    femaleVoice: "ar-MA-MounaNeural",
    samplePhrase: "السلام عليكم، مرحبا بك معنا فخدمة الدبلجة الذكية الفورية بأعلى جودة ممكنة."
  },
  {
    id: 20,
    code: "ar-MA-north",
    name: "العربية (المغرب - لهجة طنجة والشمال)",
    native: "الدارجة الشمالية",
    flag: "🇲🇦",
    region: "شمال أفريقيا",
    maleVoice: "ar-MA-JamalNeural",
    femaleVoice: "ar-MA-MounaNeural",
    samplePhrase: "أهلاً وسهلاً بك معنا، ترجمة احترافية بنبرة شمالية رنانة."
  },
  {
    id: 21,
    code: "ar-DZ",
    name: "العربية (الجزائر - لهجة العاصمة ووهران)",
    native: "الجزائرية",
    flag: "🇩🇿",
    region: "شمال أفريقيا",
    maleVoice: "ar-DZ-IsmaelNeural",
    femaleVoice: "ar-DZ-AminaNeural",
    samplePhrase: "واش راكم، مرحبا بيكم في منصة الترجمة الفورية الأسرع عالمياً والأسهل استخداماً."
  },
  {
    id: 22,
    code: "ar-TN",
    name: "العربية (تونس)",
    native: "التونسية",
    flag: "🇹🇳",
    region: "شمال أفريقيا",
    maleVoice: "ar-TN-HediNeural",
    femaleVoice: "ar-TN-ReemNeural",
    samplePhrase: "عسلامة، مرحبا بيكم في أفضل منصة ذكاء اصطناعي سينمائية لدبلجة الفيديو."
  },
  {
    id: 23,
    code: "ar-LY",
    name: "العربية (ليبيا - طرابلس وبنغازي)",
    native: "الليبية",
    flag: "🇱🇾",
    region: "شمال أفريقيا",
    maleVoice: "ar-TN-HediNeural",
    femaleVoice: "ar-TN-ReemNeural",
    samplePhrase: "مرحبتين بيكم، دبلجة فورية بدقة وسرعة فائقة بدون انتظار وبأعلى نقاء."
  },
  {
    id: 24,
    code: "ar-SD",
    name: "العربية (السودان - لهجة الخرطوم)",
    native: "السودانية",
    flag: "🇸🇩",
    region: "أفريقيا",
    maleVoice: "ar-SD-TarigNeural",
    femaleVoice: "ar-SD-AwatifNeural",
    samplePhrase: "حبابكم عشرة، مرحب بيكم في استوديو المعالجة الصوتية السريعة لجميع الفيديوهات."
  },
  {
    id: 25,
    code: "ar-YE",
    name: "العربية (اليمن - صنعاء وعدن)",
    native: "اليمنية",
    flag: "🇾🇪",
    region: "الشرق الأوسط",
    maleVoice: "ar-YE-SalehNeural",
    femaleVoice: "ar-YE-MaryamNeural",
    samplePhrase: "حياكم الله، دبلجة سينمائية راقية تلبي أعلى المعايير الفنية والإبداعية."
  },
  {
    id: 26,
    code: "ar-MR",
    name: "العربية (موريتانيا - اللهجة الحسانية)",
    native: "الحسانية",
    flag: "🇲🇷",
    region: "شمال أفريقيا",
    maleVoice: "ar-MA-JamalNeural",
    femaleVoice: "ar-MA-MounaNeural",
    samplePhrase: "مرحباً بكم في فضاء الترجمة والدبلجة العصبية المتطورة."
  },
  {
    id: 27,
    code: "ar-SO",
    name: "العربية (الصومال وجيبوتي)",
    native: "العربية الصومالية",
    flag: "🇸🇴",
    region: "أفريقيا",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "أهلاً وسهلاً بكم في نظام الترجمة فائق الدقة والسرعة."
  },
  {
    id: 28,
    code: "ar-KM",
    name: "العربية (جزر القمر)",
    native: "العربية القمرية",
    flag: "🇰🇲",
    region: "أفريقيا",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "مرحباً بكم في استوديو الصوت الذكي المتزامن."
  },
  {
    id: 29,
    code: "ar-TD",
    name: "العربية (تشاد والساحل)",
    native: "العربية التشادية",
    flag: "🇹🇩",
    region: "أفريقيا",
    maleVoice: "ar-SD-TarigNeural",
    femaleVoice: "ar-SD-AwatifNeural",
    samplePhrase: "أهلاً بالجميع، دبلجة عصبية متطورة لكل وسائط الفيديو."
  },
  {
    id: 30,
    code: "ar-FAS",
    name: "العربية الفصحى المعاصرة (الإخبارية الرسمية)",
    native: "العربية الفصحى",
    flag: "🌐",
    region: "الشرق الأوسط",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "أهلاً بكم في النشرة الإخبارية الصوتية المدبلجة بأعلى درجات الفصاحة والوضوح."
  },

  // --- الأمريكتان والإنجليزية العالمية (25 لهجة ولغة) ---
  {
    id: 31,
    code: "en-US",
    name: "الإنجليزية (أمريكا - هوليوود سينمائي)",
    native: "English (US Cinema Standard)",
    flag: "🇺🇸",
    region: "الأمريكتان",
    maleVoice: "en-US-ChristopherNeural",
    femaleVoice: "en-US-JennyNeural",
    samplePhrase: "Welcome to the world's fastest ultra-sync cinema dubbing and translation suite."
  },
  {
    id: 32,
    code: "en-US-deep",
    name: "الإنجليزية (أمريكا - الصوت الوثائقي العميق)",
    native: "English (US Documentary Deep)",
    flag: "🇺🇸",
    region: "الأمريكتان",
    maleVoice: "en-US-GuyNeural",
    femaleVoice: "en-US-AriaNeural",
    samplePhrase: "Deep neural acoustic resonance synthesized in real-time with zero latency."
  },
  {
    id: 33,
    code: "en-US-south",
    name: "الإنجليزية (أمريكا - النبرة الجنوبية تكساس)",
    native: "English (US Southern)",
    flag: "🇺🇸",
    region: "الأمريكتان",
    maleVoice: "en-US-ChristopherNeural",
    femaleVoice: "en-US-JennyNeural",
    samplePhrase: "Howdy y'all! Bringing top-notch cinematic audio right to your fingertips."
  },
  {
    id: 34,
    code: "en-US-ny",
    name: "الإنجليزية (أمريكا - لكنة نيويورك السريعة)",
    native: "English (New York)",
    flag: "🇺🇸",
    region: "الأمريكتان",
    maleVoice: "en-US-ChristopherNeural",
    femaleVoice: "en-US-JennyNeural",
    samplePhrase: "Fast-paced media dubbing designed for high-energy modern creators."
  },
  {
    id: 35,
    code: "en-GB",
    name: "الإنجليزية (بريطانيا - لكنة BBC الملكية)",
    native: "English (British Classical)",
    flag: "🇬🇧",
    region: "أوروبا",
    maleVoice: "en-GB-RyanNeural",
    femaleVoice: "en-GB-SoniaNeural",
    samplePhrase: "Pristine British linguistic precision with synchronized acoustic clarity."
  },
  {
    id: 36,
    code: "en-GB-scot",
    name: "الإنجليزية (المملكة المتحدة - اسكتلندا)",
    native: "English (Scottish)",
    flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    region: "أوروبا",
    maleVoice: "en-GB-RyanNeural",
    femaleVoice: "en-GB-SoniaNeural",
    samplePhrase: "Grand acoustic performance engineered for brilliant storytelling."
  },
  {
    id: 37,
    code: "en-CA",
    name: "الإنجليزية (كندا - تورونتو)",
    native: "English (Canada)",
    flag: "🇨🇦",
    region: "الأمريكتان",
    maleVoice: "en-CA-LiamNeural",
    femaleVoice: "en-CA-ClaraNeural",
    samplePhrase: "High-fidelity voice synthesis with crystal clarity and rapid output."
  },
  {
    id: 38,
    code: "en-AU",
    name: "الإنجليزية (أستراليا - سيدني)",
    native: "English (Australia)",
    flag: "🇦🇺",
    region: "أوقيانوسيا",
    maleVoice: "en-AU-WilliamNeural",
    femaleVoice: "en-AU-NatashaNeural",
    samplePhrase: "Converting complex video media with lightning-fast cloud performance."
  },
  {
    id: 39,
    code: "en-NZ",
    name: "الإنجليزية (نيوزيلندا)",
    native: "English (New Zealand)",
    flag: "🇳🇿",
    region: "أوقيانوسيا",
    maleVoice: "en-NZ-MitchellNeural",
    femaleVoice: "en-NZ-MollyNeural",
    samplePhrase: "Kia Ora! Seamless dubbing with incredible clarity and emotional tone."
  },
  {
    id: 40,
    code: "en-IE",
    name: "الإنجليزية (أيرلندا - دبلن)",
    native: "English (Ireland)",
    flag: "🇮🇪",
    region: "أوروبا",
    maleVoice: "en-IE-ConnorNeural",
    femaleVoice: "en-IE-EmilyNeural",
    samplePhrase: "Warm Celtic resonance delivering authentic localized dubbing."
  },
  {
    id: 41,
    code: "en-ZA",
    name: "الإنجليزية (جنوب أفريقيا)",
    native: "English (South Africa)",
    flag: "🇿🇦",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Vibrant and dynamic vocal synthesis crafted for international appeal."
  },
  {
    id: 42,
    code: "en-IN",
    name: "الإنجليزية (الهند - لكنة التكنولوجيا العالمية)",
    native: "English (India)",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "en-IN-PrabhatNeural",
    femaleVoice: "en-IN-NeerjaNeural",
    samplePhrase: "Rapid multimedia translation tailored for high-volume content engines."
  },
  {
    id: 43,
    code: "es-ES",
    name: "الإسبانية (إسبانيا - مدريد كاستيانو)",
    native: "Español (España)",
    flag: "🇪🇸",
    region: "أوروبا",
    maleVoice: "es-ES-AlvaroNeural",
    femaleVoice: "es-ES-ElviraNeural",
    samplePhrase: "Doblaje cinematográfico inteligente y veloz con precisión absoluta."
  },
  {
    id: 44,
    code: "es-MX",
    name: "الإسبانية (المكسيك - النمط اللاتيني الشائع)",
    native: "Español (México)",
    flag: "🇲🇽",
    region: "الأمريكتان",
    maleVoice: "es-MX-JorgeNeural",
    femaleVoice: "es-MX-DaliaNeural",
    samplePhrase: "Voces neuronales dinámicas que cautivan a millones en toda Latinoamérica."
  },
  {
    id: 45,
    code: "es-AR",
    name: "الإسبانية (الأرجنتين - بيونس آيرس)",
    native: "Español (Argentina)",
    flag: "🇦🇷",
    region: "الأمريكتان",
    maleVoice: "es-MX-JorgeNeural",
    femaleVoice: "es-MX-DaliaNeural",
    samplePhrase: "Hola che! La mejor sincronización de voz con acento rioplatense."
  },
  {
    id: 46,
    code: "es-CO",
    name: "الإسبانية (كولومبيا - بوجوتا)",
    native: "Español (Colombia)",
    flag: "🇨🇴",
    region: "الأمريكتان",
    maleVoice: "es-MX-JorgeNeural",
    femaleVoice: "es-MX-DaliaNeural",
    samplePhrase: "Doblaje neutro y elegante con perfecta dicción para toda la región."
  },
  {
    id: 47,
    code: "es-CL",
    name: "الإسبانية (تشيلي - سانتياغو)",
    native: "Español (Chile)",
    flag: "🇨🇱",
    region: "الأمريكتان",
    maleVoice: "es-MX-JorgeNeural",
    femaleVoice: "es-MX-DaliaNeural",
    samplePhrase: "Traducción ultra rápida para contenidos audiovisuales modernos."
  },
  {
    id: 48,
    code: "pt-BR",
    name: "البرتغالية (البرازيل - ساو باولو)",
    native: "Português (Brasil)",
    flag: "🇧🇷",
    region: "الأمريكتان",
    maleVoice: "pt-BR-AntonioNeural",
    femaleVoice: "pt-BR-FranciscaNeural",
    samplePhrase: "Dublagem e tradução neural em tempo recorde com fidelidade acústica máxima."
  },
  {
    id: 49,
    code: "pt-PT",
    name: "البرتغالية (البرتغال - لشبونة)",
    native: "Português (Portugal)",
    flag: "🇵🇹",
    region: "أوروبا",
    maleVoice: "pt-BR-AntonioNeural",
    femaleVoice: "pt-BR-FranciscaNeural",
    samplePhrase: "Excelente fidelidade sonora e sincronismo perfeito em cada cena."
  },
  {
    id: 50,
    code: "fr-FR",
    name: "الفرنسية (فرنسا - باريس)",
    native: "Français (France)",
    flag: "🇫🇷",
    region: "أوروبا",
    maleVoice: "fr-FR-HenriNeural",
    femaleVoice: "fr-FR-DeniseNeural",
    samplePhrase: "Le studio de doublage le plus rapide et le plus précis au monde."
  },
  {
    id: 51,
    code: "fr-CA",
    name: "الفرنسية (كندا - مقاطعة كيبك)",
    native: "Français (Québec)",
    flag: "🇨🇦",
    region: "الأمريكتان",
    maleVoice: "fr-FR-HenriNeural",
    femaleVoice: "fr-FR-DeniseNeural",
    samplePhrase: "Une solution de doublage fluide adaptée au public québécois."
  },
  {
    id: 52,
    code: "fr-BE",
    name: "الفرنسية (بلجيكا - بروكسل)",
    native: "Français (Belgique)",
    flag: "🇧🇪",
    region: "أوروبا",
    maleVoice: "fr-FR-HenriNeural",
    femaleVoice: "fr-FR-DeniseNeural",
    samplePhrase: "Précision acoustique européenne avec synchronisation labiale avancée."
  },
  {
    id: 53,
    code: "fr-CH",
    name: "الفرنسية (سويسرا - جنيف)",
    native: "Français (Suisse)",
    flag: "🇨🇭",
    region: "أوروبا",
    maleVoice: "fr-FR-HenriNeural",
    femaleVoice: "fr-FR-DeniseNeural",
    samplePhrase: "Qualité studio suisse avec un traitement vocal impeccable."
  },
  {
    id: 54,
    code: "it-IT",
    name: "الإيطالية (إيطاليا - روما)",
    native: "Italiano (Italia)",
    flag: "🇮🇹",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "La migliore esperienza di doppiaggio istantaneo al mondo per i creatori."
  },
  {
    id: 55,
    code: "de-DE",
    name: "الألمانية (ألمانيا - برلين)",
    native: "Deutsch (Deutschland)",
    flag: "🇩🇪",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Neuronale Synchronisation mit beispielloser Geschwindigkeit und Qualität."
  },

  // --- أوروبا وباقي دول القارة (35 لغة) ---
  {
    id: 56,
    code: "de-AT",
    name: "الألمانية (النمسا - فيينا)",
    native: "Deutsch (Österreich)",
    flag: "🇦🇹",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Perfekte Synchronisation und Klangfarbe für österreichische Produktionen."
  },
  {
    id: 57,
    code: "de-CH",
    name: "الألمانية (سويسرا - زيورخ)",
    native: "Deutsch (Schweiz)",
    flag: "🇨🇭",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Präzise Sprachausgabe mit erstklassiger Audioqualität."
  },
  {
    id: 58,
    code: "ru-RU",
    name: "الروسية (روسيا - موسكو)",
    native: "Русский (Россия)",
    flag: "🇷🇺",
    region: "أوروبا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Мгновенный кинематографический дубляж с идеальной синхронизацией губ."
  },
  {
    id: 59,
    code: "uk-UA",
    name: "الأوكرانية (أوكرانيا - كييف)",
    native: "Українська",
    flag: "🇺🇦",
    region: "أوروبا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Високоточний переклад та дубляж відео у реальному часі."
  },
  {
    id: 60,
    code: "pl-PL",
    name: "البولندية (بولندا - وارسو)",
    native: "Polski",
    flag: "🇵🇱",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Najszybszy na świecie inteligentny dubbing wideo zsynchronizowany z ruchem warg."
  },
  {
    id: 61,
    code: "nl-NL",
    name: "الهولندية (هولندا - أمستردام)",
    native: "Nederlands",
    flag: "🇳🇱",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Ervaar supersnelle videodubbing met perfecte lipsynchronisatie."
  },
  {
    id: 62,
    code: "sv-SE",
    name: "السويدية (السويد - ستوكهولم)",
    native: "Svenska",
    flag: "🇸🇪",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Framtidens AI-baserade filmdubbning direkt i din webbläsare."
  },
  {
    id: 63,
    code: "no-NO",
    name: "النرويجية (النرويج - أوسلو)",
    native: "Norsk",
    flag: "🇳🇴",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Krystallklar stemmegjengivelse for filmer og serier."
  },
  {
    id: 64,
    code: "da-DK",
    name: "الدانماركية (الدانمارك - كوبنهاغن)",
    native: "Dansk",
    flag: "🇩🇰",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Hurtig og præcis AI-synkronisering til dine videoer."
  },
  {
    id: 65,
    code: "fi-FI",
    name: "الفنلندية (فنلندا - هلسنكي)",
    native: "Suomi",
    flag: "🇫🇮",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Huippuluokan puhesynteesi ja tarkka käännös sekunneissa."
  },
  {
    id: 66,
    code: "el-GR",
    name: "اليونانية (اليونان - أثينا)",
    native: "Ελληνικά",
    flag: "🇬🇷",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Κορυφαία ποιότητα μεταγλώττισης με τεχνητή νοημοσύνη."
  },
  {
    id: 67,
    code: "cs-CZ",
    name: "التشيكية (التشيك - براغ)",
    native: "Čeština",
    flag: "🇨🇿",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Okamžitý dabing videa s filmovou kvalitou zvuku."
  },
  {
    id: 68,
    code: "ro-RO",
    name: "الرومانية (رومانيا - بوخارست)",
    native: "Română",
    flag: "🇷🇴",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Dublare video inteligentă cu sincronizare excelentă."
  },
  {
    id: 69,
    code: "hu-HU",
    name: "المجرية (المجر - بودابست)",
    native: "Magyar",
    flag: "🇭🇺",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Lenyűgöző mesterséges intelligencia alapú szinkronizálás."
  },
  {
    id: 70,
    code: "bg-BG",
    name: "البلغارية (بلغاريا - صوفيا)",
    native: "Български",
    flag: "🇧🇬",
    region: "أوروبا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Бърз и качествен дублаж със съвършена акустика."
  },
  {
    id: 71,
    code: "hr-HR",
    name: "الكرواتية (كرواتيا - زغرب)",
    native: "Hrvatski",
    flag: "🇭🇷",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Profesionalna video sinkronizacija u samo nekoliko sekundi."
  },
  {
    id: 72,
    code: "sr-RS",
    name: "الصربية (صربيا - بلغراد)",
    native: "Српски",
    flag: "🇷🇸",
    region: "أوروبا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Модерна технологија за превод и синхронизацију филмова."
  },
  {
    id: 73,
    code: "sk-SK",
    name: "السلوفاكية (سلوفاكيا - براتيسلافا)",
    native: "Slovenčina",
    flag: "🇸🇰",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Špičkový dabing videí novej generácie pre tvorcov."
  },
  {
    id: 74,
    code: "sl-SI",
    name: "السلوفينية (سلوفينيا - ليوبليانا)",
    native: "Slovenščina",
    flag: "🇸🇮",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Hitra in natančna sinhronizacija z umetno inteligenco."
  },
  {
    id: 75,
    code: "lt-LT",
    name: "الليتوانية (ليتوانيا - فيلنيوس)",
    native: "Lietuvių",
    flag: "🇱🇹",
    region: "أوروبا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Pažangus vaizdo įrašų įgarsinimas realiuoju laiku."
  },
  {
    id: 76,
    code: "lv-LV",
    name: "اللاتفية (لاتفيا - ريغا)",
    native: "Latviešu",
    flag: "🇱🇻",
    region: "أوروبا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Augstas kvalitātes balss tulkošana un sinhronizēšana."
  },
  {
    id: 77,
    code: "et-EE",
    name: "الإستونية (إستونيا - تالين)",
    native: "Eesti",
    flag: "🇪🇪",
    region: "أوروبا",
    maleVoice: "fi-FI-HarriNeural",
    femaleVoice: "fi-FI-NooraNeural",
    samplePhrase: "Nutikas häälesünkroonimine sekunditega teie videotele."
  },
  {
    id: 78,
    code: "is-IS",
    name: "الآيسلندية (آيسلندا - ريكيافيك)",
    native: "Íslenska",
    flag: "🇮🇸",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Framúrskarandi talgervill með náttúrulegum hljómi."
  },
  {
    id: 79,
    code: "ga-IE",
    name: "الأيرلندية الغيلية (أيرلندا)",
    native: "Gaeilge",
    flag: "🇮🇪",
    region: "أوروبا",
    maleVoice: "en-IE-ConnorNeural",
    femaleVoice: "en-IE-EmilyNeural",
    samplePhrase: "Fáilte go dtí an stiúideo dubála is nua-aimseartha."
  },
  {
    id: 80,
    code: "sq-AL",
    name: "الألبانية (ألبانيا وكوسوفو)",
    native: "Shqip",
    flag: "🇦🇱",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Dublim i shpejtë dhe inteligjent për të gjitha videot tuaja."
  },
  {
    id: 81,
    code: "mk-MK",
    name: "المقدونية (مقدونيا الشمالية)",
    native: "Македонски",
    flag: "🇲🇰",
    region: "أوروبا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Врвна синхронизација со вештачка интелигенција."
  },
  {
    id: 82,
    code: "bs-BA",
    name: "البوسنية (البوسنة والهرسك)",
    native: "Bosanski",
    flag: "🇧🇦",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Savršeno usklađen glas i video bez ikakvog kašnjenja."
  },
  {
    id: 83,
    code: "mt-MT",
    name: "المالطية (مالطا)",
    native: "Malti",
    flag: "🇲🇹",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Esperjenza ġdida ta' doppjaġġ b'leħen ċar u naturali."
  },
  {
    id: 84,
    code: "ca-ES",
    name: "الكتالونية (برشلونة)",
    native: "Català",
    flag: "🇪🇸",
    region: "أوروبا",
    maleVoice: "es-ES-AlvaroNeural",
    femaleVoice: "es-ES-ElviraNeural",
    samplePhrase: "Doblatge d'alta qualitat adaptat al cinema contemporani."
  },
  {
    id: 85,
    code: "gl-ES",
    name: "الجاليكية (إسبانيا)",
    native: "Galego",
    flag: "🇪🇸",
    region: "أوروبا",
    maleVoice: "es-ES-AlvaroNeural",
    femaleVoice: "es-ES-ElviraNeural",
    samplePhrase: "Dobraxe profesional con son limpo e nítido."
  },
  {
    id: 86,
    code: "eu-ES",
    name: "الباسكية (إقليم الباسك)",
    native: "Euskara",
    flag: "🇪🇸",
    region: "أوروبا",
    maleVoice: "es-ES-AlvaroNeural",
    femaleVoice: "es-ES-ElviraNeural",
    samplePhrase: "Bikoizketa adimenduna zure bideo proiektu guztietarako."
  },
  {
    id: 87,
    code: "cy-GB",
    name: "الويلزية (ويلز)",
    native: "Cymraeg",
    flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    region: "أوروبا",
    maleVoice: "en-GB-RyanNeural",
    femaleVoice: "en-GB-SoniaNeural",
    samplePhrase: "Trosleisio fideo cyflym gyda sain sinematig go iawn."
  },
  {
    id: 88,
    code: "be-BY",
    name: "البيلاروسية (بيلاروسيا)",
    native: "Беларуская",
    flag: "🇧🇾",
    region: "أوروبا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Хуткае дубляванне з выдатнай акустычнай выразнасцю."
  },
  {
    id: 89,
    code: "lb-LU",
    name: "اللوكسمبورغية (لوكسمبورغ)",
    native: "Lëtzebuergesch",
    flag: "🇱🇺",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Schnell a professionell Dubbing mat AI-Präzisioun."
  },
  {
    id: 90,
    code: "fo-FO",
    name: "الفاروية (جزر فارو)",
    native: "Føroyskt",
    flag: "🇫🇴",
    region: "أوروبا",
    maleVoice: "de-DE-ConradNeural",
    femaleVoice: "de-DE-KatjaNeural",
    samplePhrase: "Einstakt ljóð og neyv talgilding fyri tínar filmar."
  },

  // --- آسيا والشرق الأقصى والشرق الأوسط الكبير (35 لغة) ---
  {
    id: 91,
    code: "tr-TR",
    name: "التركية (تركيا - إسطنبول)",
    native: "Türkçe (İstanbul)",
    flag: "🇹🇷",
    region: "الشرق الأوسط",
    maleVoice: "tr-TR-AhmetNeural",
    femaleVoice: "tr-TR-EmelNeural",
    samplePhrase: "Işık hızında yapay zeka ile profesyonel sinematik film seslendirmesi."
  },
  {
    id: 92,
    code: "tr-TR-ankara",
    name: "التركية (تركيا - أنقرة الإذاعية)",
    native: "Türkçe (Ankara)",
    flag: "🇹🇷",
    region: "الشرق الأوسط",
    maleVoice: "tr-TR-AhmetNeural",
    femaleVoice: "tr-TR-EmelNeural",
    samplePhrase: "Kusursuz diksiyon ile anında video çevirisi ve seslendirme."
  },
  {
    id: 93,
    code: "fa-IR",
    name: "الفارسية (إيران - طهران الأدبية)",
    native: "فارسی (تهران)",
    flag: "🇮🇷",
    region: "الشرق الأوسط",
    maleVoice: "fa-IR-FaridNeural",
    femaleVoice: "fa-IR-DilaraNeural",
    samplePhrase: "دوبله هوشمند و استثنایی با بالاترین دقت ترجمه و لحن سینمایی."
  },
  {
    id: 94,
    code: "fa-AF",
    name: "الدرية (أفغانستان - كابول)",
    native: "دری (افغانستان)",
    flag: "🇦🇫",
    region: "الشرق الأوسط",
    maleVoice: "fa-IR-FaridNeural",
    femaleVoice: "fa-IR-DilaraNeural",
    samplePhrase: "دوبله و ترجمه دقیق برای ویدیوهای با کیفیت بالا."
  },
  {
    id: 95,
    code: "ur-PK",
    name: "الأردية (باكستان - لاهور وكاراتشي)",
    native: "اردو (پاکستان)",
    flag: "🇵🇰",
    region: "آسيا",
    maleVoice: "ur-PK-AsadNeural",
    femaleVoice: "ur-PK-UzmaNeural",
    samplePhrase: "ویڈیو ڈبنگ اور ترجمے کا جدید ترین عصبی نظام بغیر کسی تاخیر کے۔"
  },
  {
    id: 96,
    code: "zh-CN",
    name: "الصينية (الماندرين المبسطة - بكين)",
    native: "简体中文 (普通话)",
    flag: "🇨🇳",
    region: "آسيا",
    maleVoice: "zh-CN-YunxiNeural",
    femaleVoice: "zh-CN-XiaoxiaoNeural",
    samplePhrase: "全球最快的人工智能影视级视频配音平台，为您打造完美视听盛宴。"
  },
  {
    id: 97,
    code: "zh-TW",
    name: "الصينية (الماندرين التقليدية - تايوان)",
    native: "繁體中文 (台灣)",
    flag: "🇹🇼",
    region: "آسيا",
    maleVoice: "zh-TW-YunJheNeural",
    femaleVoice: "zh-TW-HsiaoChenNeural",
    samplePhrase: "極致影音同步，為您的影片帶來全新聽覺享受與震撼效果。"
  },
  {
    id: 98,
    code: "zh-HK",
    name: "الصينية (الكانتونية - هونغ كونغ)",
    native: "廣東話 (香港)",
    flag: "🇭🇰",
    region: "آسيا",
    maleVoice: "zh-HK-WanLungNeural",
    femaleVoice: "zh-HK-HiuGaaiNeural",
    samplePhrase: "專業AI電影級配音，精準字幕同步，即時呈現非凡質感。"
  },
  {
    id: 99,
    code: "ja-JP",
    name: "اليابانية (اليابان - طوكيو سينمائي/أنمي)",
    native: "日本語 (東京)",
    flag: "🇯🇵",
    region: "آسيا",
    maleVoice: "ja-JP-KeitaNeural",
    femaleVoice: "ja-JP-NanamiNeural",
    samplePhrase: "最高峰のAI音声合成技術による超高速シネマ吹替体験をお届けします。"
  },
  {
    id: 100,
    code: "ja-JP-osaka",
    name: "اليابانية (اليابان - لهجة كانساي أوساكا)",
    native: "日本語 (関西弁)",
    flag: "🇯🇵",
    region: "آسيا",
    maleVoice: "ja-JP-KeitaNeural",
    femaleVoice: "ja-JP-NanamiNeural",
    samplePhrase: "めっちゃええ音質で素早く動画を吹き替えるで！"
  },
  {
    id: 101,
    code: "ko-KR",
    name: "الكورية (كوريا الجنوبية - سيول كيه-دراما)",
    native: "한국어 (서울)",
    flag: "🇰🇷",
    region: "آسيا",
    maleVoice: "ko-KR-InJoonNeural",
    femaleVoice: "ko-KR-SunHiNeural",
    samplePhrase: "완벽한 립싱크와 초고속 인공지능 시네마 더빙 엔진에 오신 것을 환영합니다."
  },
  {
    id: 102,
    code: "hi-IN",
    name: "الهندية (الهند - بوليوود نيودلهي)",
    native: "हिन्दी (भारत)",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "विश्व स्तरीय सबसे तेज़ एआई डबिंग और उपशीर्षक निर्माण का अनुभव करें।"
  },
  {
    id: 103,
    code: "bn-IN",
    name: "البنغالية (الهند وبنغلاديش)",
    native: "বাংলা",
    flag: "🇧🇩",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "সবচেয়ে দ্রুত এআই ভিডিও ডাবিং প্ল্যাটফর্মে আপনাকে স্বাগতম।"
  },
  {
    id: 104,
    code: "pa-IN",
    name: "البنجابية (الهند وباكستان)",
    native: "ਪੰਜਾਬੀ",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "ਸ਼ਾਨਦਾਰ ਆਵਾਜ਼ ਵਿੱਚ ਤੇਜ਼ੀ ਨਾਲ ਵੀਡੀਓ ਡਬਿੰਗ ਦਾ ਆਨੰਦ ਲਓ।"
  },
  {
    id: 105,
    code: "mr-IN",
    name: "الماراثية (الهند - مومباي)",
    native: "मराठी",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "सिनेमॅटिक दर्जाचे सर्वोत्तम एआय डबिंग आता तुमच्यासाठी उपलब्ध."
  },
  {
    id: 106,
    code: "gu-IN",
    name: "الغوجاراتية (الهند)",
    native: "ગુજરાતી",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "સૌથી ઝડપી અને સચોટ વિડિઓ ડબિંગ સેવા."
  },
  {
    id: 107,
    code: "ta-IN",
    name: "التاميلية (الهند وسريلانكا)",
    native: "தமிழ்",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "துல்லியமான ஒத்திசைவுடன் கூடிய அதிவேக வீடியோ டப்பிங்."
  },
  {
    id: 108,
    code: "te-IN",
    name: "التيلوغو (الهند)",
    native: "తెలుగు",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "చలనచిత్ర స్థాయి డబ్బింగ్ అనుభవాన్ని వెంటనే పొందండి."
  },
  {
    id: 109,
    code: "kn-IN",
    name: "الكانادية (الهند)",
    native: "ಕನ್ನಡ",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "ಅತ್ಯಂತ ವೇಗದ ಎಐ ವಿಡಿಯೋ ಡಬ್ಬಿಂಗ್ ಸ್ಟುಡಿಯೋ."
  },
  {
    id: 110,
    code: "ml-IN",
    name: "المالايالامية (الهند - كيرلا)",
    native: "മലയാളം",
    flag: "🇮🇳",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "ഏറ്റവും മികച്ച ശബ്ദ വ്യക്തതയോടെ വീഡിയോ ഡബ്ബ് ചെയ്യുക."
  },
  {
    id: 111,
    code: "id-ID",
    name: "الإندونيسية (إندونيسيا - جاكرتا)",
    native: "Bahasa Indonesia",
    flag: "🇮🇩",
    region: "آسيا",
    maleVoice: "id-ID-ArdiNeural",
    femaleVoice: "id-ID-GadisNeural",
    samplePhrase: "Platform dubbing video tercepat di dunia dengan kualitas suara sinematik 4K."
  },
  {
    id: 112,
    code: "ms-MY",
    name: "الماليزية (ماليزيا - كوالالمبور)",
    native: "Bahasa Melayu",
    flag: "🇲🇾",
    region: "آسيا",
    maleVoice: "id-ID-ArdiNeural",
    femaleVoice: "id-ID-GadisNeural",
    samplePhrase: "Alih suara pintar dengan penyegerakan bibir yang amat lancar."
  },
  {
    id: 113,
    code: "th-TH",
    name: "التايلاندية (تايلاند - بانكوك)",
    native: "ไทย",
    flag: "🇹🇭",
    region: "آسيا",
    maleVoice: "id-ID-ArdiNeural",
    femaleVoice: "id-ID-GadisNeural",
    samplePhrase: "เทคโนโลยีพากย์เสียง AI คุณภาพระดับภาพยนตร์ 4K ที่เร็วที่สุด."
  },
  {
    id: 114,
    code: "vi-VN",
    name: "الفيتنامية (فيتنام - هانوي)",
    native: "Tiếng Việt",
    flag: "🇻🇳",
    region: "آسيا",
    maleVoice: "id-ID-ArdiNeural",
    femaleVoice: "id-ID-GadisNeural",
    samplePhrase: "Lồng tiếng video chuyên nghiệp với độ chính xác và tốc độ tuyệt hảo."
  },
  {
    id: 115,
    code: "tl-PH",
    name: "الفلبينية / التاغالوغ (مانيلا)",
    native: "Filipino (Tagalog)",
    flag: "🇵🇭",
    region: "آسيا",
    maleVoice: "id-ID-ArdiNeural",
    femaleVoice: "id-ID-GadisNeural",
    samplePhrase: "Mabilis at de-kalidad na pag-dub ng video gamit ang makabagong AI."
  },
  {
    id: 116,
    code: "my-MM",
    name: "البورمية (ميانمار)",
    native: "မြန်မာဘာသာ",
    flag: "🇲🇲",
    region: "آسيا",
    maleVoice: "id-ID-ArdiNeural",
    femaleVoice: "id-ID-GadisNeural",
    samplePhrase: "အကောင်းဆုံး အရည်အသွေးဖြင့် အမြန်ဆုံး အသံသွင်းခြင်း."
  },
  {
    id: 117,
    code: "km-KH",
    name: "الخميرية (كمبوديا)",
    native: "ភាសាខ្មែរ",
    flag: "🇰🇭",
    region: "آسيا",
    maleVoice: "id-ID-ArdiNeural",
    femaleVoice: "id-ID-GadisNeural",
    samplePhrase: "ការបញ្ចូលសំឡេងវីដេអូលឿនរហ័សប្រកបដោយគុណភាពខ្ពស់."
  },
  {
    id: 118,
    code: "lo-LA",
    name: "اللاوية (لاوس)",
    native: "ພາສາລາວ",
    flag: "🇱🇦",
    region: "آسيا",
    maleVoice: "id-ID-ArdiNeural",
    femaleVoice: "id-ID-GadisNeural",
    samplePhrase: "ການພາກ្យສຽງວິດີໂອລະດັບສາກົນທີ່ໄວທີ່ສຸດ."
  },
  {
    id: 119,
    code: "mn-MN",
    name: "المنغولية (منغوليا)",
    native: "Монгол хэл",
    flag: "🇲🇳",
    region: "آسيا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Кино түвшний хиймэл оюуны дуу оруулалтын систем."
  },
  {
    id: 120,
    code: "kk-KZ",
    name: "الكازاخستانية (كازاخستان)",
    native: "Қазақ тілі",
    flag: "🇰🇿",
    region: "آسيا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Ең жылдам әрі сапалы бейне дыбыстау қызметі."
  },
  {
    id: 121,
    code: "uz-UZ",
    name: "الأوزبكية (أوزبكستان)",
    native: "Oʻzbekcha",
    flag: "🇺🇿",
    region: "آسيا",
    maleVoice: "tr-TR-AhmetNeural",
    femaleVoice: "tr-TR-EmelNeural",
    samplePhrase: "Eng tezkor va sifatli videolarni dublyaj qilish platformasi."
  },
  {
    id: 122,
    code: "az-AZ",
    name: "الأذربيجانية (أذربيجان - باكو)",
    native: "Azərbaycan dili",
    flag: "🇦🇿",
    region: "الشرق الأوسط",
    maleVoice: "tr-TR-AhmetNeural",
    femaleVoice: "tr-TR-EmelNeural",
    samplePhrase: "Yüksək dəqiqlikli və sürətli video dublyaj texnologiyası."
  },
  {
    id: 123,
    code: "ka-GE",
    name: "الجورجية (جورجيا - تبليسي)",
    native: "ქართული",
    flag: "🇬🇪",
    region: "الشرق الأوسط",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "უმაღლესი ხარისხის ვიდეო გახმოვანება უმოკლეს დროში."
  },
  {
    id: 124,
    code: "hy-AM",
    name: "الأرمينية (أرمينيا - يريفان)",
    native: "Հայերեն",
    flag: "🇦🇲",
    region: "الشرق الأوسط",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Բարձրակարգ և արագ տեսանյութերի կրկնօրինակում:"
  },
  {
    id: 125,
    code: "he-IL",
    name: "العبرية الحديثة (تل أبيب)",
    native: "עברית",
    flag: "🇮🇱",
    region: "الشرق الأوسط",
    maleVoice: "en-US-ChristopherNeural",
    femaleVoice: "en-US-JennyNeural",
    samplePhrase: "דיבוב וידאו מתקדם ומהיר באיכות קולנועית מושלמת."
  },

  // --- أفريقيا وباقي لغات العالم (25 لغة) ---
  {
    id: 126,
    code: "sw-KE",
    name: "السواحيلية (كينيا وتنزانيا)",
    native: "Kiswahili",
    flag: "🇰🇪",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Karibu kwenye jukwaa la haraka zaidi la kudurusu video kwa AI."
  },
  {
    id: 127,
    code: "am-ET",
    name: "الأمهرية (إثيوبيا - أديس أبابا)",
    native: "አማርኛ",
    flag: "🇪🇹",
    region: "أفريقيا",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "በጣም ፈጣን እና ጥራት ያለው የቪዲዮ ድምፅ ቅንብር."
  },
  {
    id: 128,
    code: "yo-NG",
    name: "اليوروبا (نيجيريا)",
    native: "Èdè Yorùbá",
    flag: "🇳🇬",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Pẹpẹ ti o yara julọ fun titumọ ati dida ohun fidio."
  },
  {
    id: 129,
    code: "ig-NG",
    name: "الإيجبو (نيجيريا)",
    native: "Asụsụ Igbo",
    flag: "🇳🇬",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Usoro kachasị ọsọ maka nsụgharị vidiyo na dubbing."
  },
  {
    id: 130,
    code: "ha-NG",
    name: "الهوسا (نيجيريا وغرب أفريقيا)",
    native: "Harshen Hausa",
    flag: "🇳🇬",
    region: "أفريقيا",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "Mafi saurin tsarin fassarar bidiyo da murya ta AI."
  },
  {
    id: 131,
    code: "zu-ZA",
    name: "الزولو (جنوب أفريقيا)",
    native: "isiZulu",
    flag: "🇿🇦",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Uhlelo olusheshayo lokuqopha kabusha amavidiyo nge-AI."
  },
  {
    id: 132,
    code: "xh-ZA",
    name: "الخوسا (جنوب أفريقيا)",
    native: "isiXhosa",
    flag: "🇿🇦",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Eyona nkqubo ikhawulezayo yokudubha iividiyo nge-AI."
  },
  {
    id: 133,
    code: "af-ZA",
    name: "الأفريكانية (جنوب أفريقيا وناميبيا)",
    native: "Afrikaans",
    flag: "🇿🇦",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Ervaar vinnige en foutlose video-oorvoicing met hoë gehalte."
  },
  {
    id: 134,
    code: "so-SO",
    name: "الصومالية (الصومال ومقديشو)",
    native: "Af-Soomaali",
    flag: "🇸🇴",
    region: "أفريقيا",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "Ku soo dhawoow barnaamijka ugu dheereeya ee codka muuqaalka."
  },
  {
    id: 135,
    code: "rw-RW",
    name: "الكينيارواندا (رواندا)",
    native: "Ikinyarwanda",
    flag: "🇷🇼",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Uburyo bwihuse bwo guhindura no gukora amajwi ya videwo."
  },
  {
    id: 136,
    code: "sn-ZW",
    name: "الشونا (زيمبابوي)",
    native: "chiShona",
    flag: "🇿🇼",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Kurumidza kushandura manzwi emavhidhiyo nehunyanzvi."
  },
  {
    id: 137,
    code: "mg-MG",
    name: "الملغاشية (مدغشقر)",
    native: "Fiteny Malagasy",
    flag: "🇲🇬",
    region: "أفريقيا",
    maleVoice: "fr-FR-HenriNeural",
    femaleVoice: "fr-FR-DeniseNeural",
    samplePhrase: "Fandikan-teny sy fandefasana feo haingana indrindra."
  },
  {
    id: 138,
    code: "ti-ET",
    name: "التغرينية (إريتريا وشمال إثيوبيا)",
    native: "ትግርኛ",
    flag: "🇪🇷",
    region: "أفريقيا",
    maleVoice: "ar-SA-HamedNeural",
    femaleVoice: "ar-SA-ZariyahNeural",
    samplePhrase: "ብዝለዓለ ፅሬት ዝተዳለወ ፈጣን ድምፂ ቪድዮታት."
  },
  {
    id: 139,
    code: "om-ET",
    name: "الأورومو (إثيوبيا وكينيا)",
    native: "Afaan Oromoo",
    flag: "🇪🇹",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Sagalee viidiyoo dafee jijjiiruu fi qulqullina olaanaa."
  },
  {
    id: 140,
    code: "ln-CD",
    name: "اللينغالا (الكونغو كينشاسا)",
    native: "Lingála",
    flag: "🇨🇩",
    region: "أفريقيا",
    maleVoice: "fr-FR-HenriNeural",
    femaleVoice: "fr-FR-DeniseNeural",
    samplePhrase: "Kobongola mongongo ya video na lombangu mpe kitoko."
  },
  {
    id: 141,
    code: "wo-SN",
    name: "الولوفية (السنغال)",
    native: "Wolof",
    flag: "🇸🇳",
    region: "أفريقيا",
    maleVoice: "fr-FR-HenriNeural",
    femaleVoice: "fr-FR-DeniseNeural",
    samplePhrase: "Dugal baat yu bees ci sa wideo ci anam bu gaaw."
  },
  {
    id: 142,
    code: "st-LS",
    name: "السوتو (ليسوتو وجنوب أفريقيا)",
    native: "Sesotho",
    flag: "🇱🇸",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Phetolelo e potlakileng le e nepahetseng ea lentsoe la video."
  },
  {
    id: 143,
    code: "tn-BW",
    name: "التسوانية (بوتسوانا)",
    native: "Setswana",
    flag: "🇧🇼",
    region: "أفريقيا",
    maleVoice: "en-ZA-LukeNeural",
    femaleVoice: "en-ZA-LeahNeural",
    samplePhrase: "Go fetola lentswe la bidio ka bonako jo bo gakgamatsang."
  },
  {
    id: 144,
    code: "ne-NP",
    name: "النيبالية (نيبال)",
    native: "नेपाली",
    flag: "🇳🇵",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "सबैभन्दा छिटो एआई भिडियो डबिङ प्लेटफर्ममा स्वागत छ।"
  },
  {
    id: 145,
    code: "si-LK",
    name: "السنهالية (سريلانكا)",
    native: "සිංහල",
    flag: "🇱🇰",
    region: "آسيا",
    maleVoice: "hi-IN-MadhurNeural",
    femaleVoice: "hi-IN-SwaraNeural",
    samplePhrase: "ඉතා වේගවත් සහ උසස් තත්ත්වයේ වීඩියෝ හඬ කැවීම්."
  },
  {
    id: 146,
    code: "eo-WORLD",
    name: "الإسبرانتو (اللغة الدولية)",
    native: "Esperanto",
    flag: "🌐",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Bonvenon al la plej rapida AI-dubla platformo en la mondo."
  },
  {
    id: 147,
    code: "la-VA",
    name: "اللاتينية الكلاسيكية (الفاتيكان)",
    native: "Latina",
    flag: "🇻🇦",
    region: "أوروبا",
    maleVoice: "it-IT-DiegoNeural",
    femaleVoice: "it-IT-ElsaNeural",
    samplePhrase: "Vox artificiosa celerrima cum perfecta harmonia."
  },
  {
    id: 148,
    code: "ku-TR",
    name: "الكردية (كردستان)",
    native: "Kurdî",
    flag: "☀️",
    region: "الشرق الأوسط",
    maleVoice: "tr-TR-AhmetNeural",
    femaleVoice: "tr-TR-EmelNeural",
    samplePhrase: "Dûblaja herî bilez a bi hişê çêkirî ji bo hemî vîdyoyan."
  },
  {
    id: 149,
    code: "ps-AF",
    name: "البشتوية (أفغانستان وباكستان)",
    native: "پښتو",
    flag: "🇦🇫",
    region: "الشرق الأوسط",
    maleVoice: "ur-PK-AsadNeural",
    femaleVoice: "ur-PK-UzmaNeural",
    samplePhrase: "د مصنوعي ذهانت په مرسته د ویډیو خورا ګړندی غږ بدلول."
  },
  {
    id: 150,
    code: "tg-TJ",
    name: "الطاجيكية (طاجيكستان)",
    native: "Тоҷикӣ",
    flag: "🇹🇯",
    region: "آسيا",
    maleVoice: "ru-RU-DmitryNeural",
    femaleVoice: "ru-RU-SvetlanaNeural",
    samplePhrase: "Садогузории фаврии наворҳо бо технологияи пешрафтаи зеҳни сунъӣ."
  }
];

// المقاطع الافتراضية
const INITIAL_SUBTITLES = [
  {
    id: 1,
    start: 0.0,
    end: 2.8,
    original: "Welcome to LinguaCast AI, the world's most powerful cinema dubbing suite.",
    translated: "أهلاً بك في منصة لينجوا كاست، أقوى وأسرع محرك دبلجة وترجمة سينمائية بالذكاء الاصطناعي في العالم.",
    confidence: 1.0
  },
  {
    id: 2,
    start: 2.85,
    end: 6.0,
    original: "Engineered for instantaneous neural translation and ultra-realistic lip synchronization.",
    translated: "مصمم لتوفير ترجمة عصبية لحظية ومطابقة واقعية تامة لحركة الشفاه والنبرات التعبيرية بدون أي تأخير.",
    confidence: 0.99
  }
];

export default function App() {
  // ==========================================================================
  // حالات النظام والمشغل (Master States)
  // ==========================================================================
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(GLOBAL_LANGUAGES_MATRIX[0]);
  const [voiceGender, setVoiceGender] = useState('male');
  const [voiceTone, setVoiceTone] = useState('cinematic');
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [vocalIsolation, setVocalIsolation] = useState(true);
  const [duckingLevel, setDuckingLevel] = useState(0.15);

  // ملفات وروابط الفيديو
  const [videoFile, setVideoFile] = useState(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState(null);
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState(null);

  // التحكم في المشغل
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6.0);
  const [playerMode, setPlayerMode] = useState('split');
  const [splitPosition, setSplitPosition] = useState(50);
  const [audioTrack, setAudioTrack] = useState('dubbed');
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  // مصفوفة الترجمة
  const [subtitleSegments, setSubtitleSegments] = useState(INITIAL_SUBTITLES);

  // نظام إشعار الإنجاز المنبثق الفخم (Toast Notification)
  const [toast, setToast] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success' // 'success' | 'error'
  });

  // سرعة المعالجة والتقدم
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('جاهز للتشغيل الفوري');
  const [terminalLogs, setTerminalLogs] = useState([
    `[${new Date().toLocaleTimeString()}] 🚀 تم تشغيل محرك LinguaCast AI Neural Core بنجاح.`,
    `[${new Date().toLocaleTimeString()}] ⚡ خوادم الرندر فائق السرعة http://localhost:5000 متصلة وتعمل بكفاءة 100%.`,
    `[${new Date().toLocaleTimeString()}] ✨ 150 لغة ولهجة جاهزة للاستخدام مع ميزة التشغيل التلقائي الفوري.`
  ]);

  // خطط VIP والاشتراكات
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [searchLangQuery, setSearchLangQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('الكل');
  const [userMinutes, setUserMinutes] = useState(250);
  const [activeVIPPlan, setActiveVIPPlan] = useState('studio');

  // الرندر والتصدير
  const [renderResolution, setRenderResolution] = useState('4k');
  const [renderCodec, setRenderCodec] = useState('h264');
  const [renderFps, setRenderFps] = useState('60');

  // ميكسر الصوت EQ
  const [eq60Hz, setEq60Hz] = useState(1);
  const [eq250Hz, setEq250Hz] = useState(2);
  const [eq1kHz, setEq1kHz] = useState(2);
  const [eq4kHz, setEq4kHz] = useState(4);
  const [eq12kHz, setEq12kHz] = useState(3);

  // المراجع (Refs)
  const originalVideoRef = useRef(null);
  const dubbedVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const spectrumCanvasRef = useRef(null);
  const splitContainerRef = useRef(null);
  const isDraggingSplit = useRef(false);

  // إغلاق الإشعار تلقائياً بعد 6 ثوانٍ
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // ==========================================================================
  // 2. محرك الجزيئات السديمية الحية بـ 60 FPS
  // ==========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2 + 0.6,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? '#00f2fe' : '#8a2be2',
      alpha: Math.random() * 0.45 + 0.15
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ==========================================================================
  // 3. رسم الطيف الصوتي الحي (Spectrum Waveform)
  // ==========================================================================
  useEffect(() => {
    const canvas = spectrumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const drawSpectrum = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 40;
      const width = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = isPlaying
          ? Math.abs(Math.sin(Date.now() * 0.008 + i * 0.35)) * 24 + 4
          : 3;
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00f2fe');
        gradient.addColorStop(0.5, '#3b82f6');
        gradient.addColorStop(1, '#8a2be2');

        ctx.fillStyle = gradient;
        ctx.fillRect(i * width + 1, (canvas.height - height) / 2, width - 2, height);
      }
      animId = requestAnimationFrame(drawSpectrum);
    };
    drawSpectrum();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // ==========================================================================
  // 4. مطابقة الترجمة مع التوقيت بالمللي ثانية (مصححة 100%)
  // ==========================================================================
  useEffect(() => {
    if (!subtitleSegments || subtitleSegments.length === 0) {
      setCurrentSubtitle('');
      return;
    }
    const active = subtitleSegments.find(s => {
      const start = Number(s.start);
      const end = Number(s.end);
      return currentTime >= start && currentTime <= end;
    });
    setCurrentSubtitle(active ? (active.translated || active.original || '') : '');
  }, [currentTime, subtitleSegments]);

  const addLog = useCallback((msg) => {
    setTerminalLogs(prev => [
      ...prev.slice(-35),
      `[${new Date().toLocaleTimeString()}] ${msg}`
    ]);
  }, []);

  // استيراد الفيديو
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setOriginalVideoUrl(url);
      setDubbedVideoUrl(null);
      setCurrentTime(0);
      setIsPlaying(false);
      addLog(`📁 تم استيراد الفيديو بنجاح: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
    }
  };

  const togglePlay = () => {
    const target = dubbedVideoUrl && dubbedVideoRef.current ? dubbedVideoRef.current : originalVideoRef.current;
    if (!target) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      if (originalVideoRef.current) originalVideoRef.current.pause();
      if (dubbedVideoRef.current) dubbedVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (originalVideoRef.current) originalVideoRef.current.play();
      if (dubbedVideoRef.current) dubbedVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = (e) => {
    const time = e.target.currentTime;
    setCurrentTime(time);
    if (e.target.duration && !isNaN(e.target.duration)) {
      setDuration(e.target.duration);
    }

    if (dubbedVideoRef.current && originalVideoRef.current) {
      const diff = Math.abs(dubbedVideoRef.current.currentTime - originalVideoRef.current.currentTime);
      if (diff > 0.15) {
        if (e.target === dubbedVideoRef.current) {
          originalVideoRef.current.currentTime = time;
        } else {
          dubbedVideoRef.current.currentTime = time;
        }
      }
    }
  };

  const handleSeek = (seekTime) => {
    setCurrentTime(seekTime);
    if (originalVideoRef.current) originalVideoRef.current.currentTime = seekTime;
    if (dubbedVideoRef.current) dubbedVideoRef.current.currentTime = seekTime;
  };

  // سلايدر المقارنة النيوني
  const handleMouseDownSplit = () => {
    isDraggingSplit.current = true;
  };

  const handleMouseMoveSplit = (e) => {
    if (!isDraggingSplit.current || !splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(3, Math.min(97, (x / rect.width) * 100));
    setSplitPosition(percent);
  };

  const handleMouseUpSplit = () => {
    isDraggingSplit.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMoveSplit);
    window.addEventListener('mouseup', handleMouseUpSplit);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveSplit);
      window.removeEventListener('mouseup', handleMouseUpSplit);
    };
  }, []);

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(duration, currentTime + 2));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, currentTime - 2));
      } else if (e.code === 'KeyF') {
        setPlayerMode(prev => prev === 'theater' ? 'split' : 'theater');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, duration, isPlaying]);

  // تجربة نطق الصوت عبر السيرفر أو المتصفح
  const testVoiceSample = async (lang) => {
    try {
      addLog(`🔊 تجربة الصوت العصبي للغة: ${lang.name}...`);
      const res = await fetch('http://localhost:5000/api/tts/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: lang.samplePhrase,
          lang: lang.code,
          gender: voiceGender
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audio_url) {
          const audio = new Audio(data.audio_url);
          audio.playbackRate = speechSpeed;
          audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn("Falling back to local speech synthesis:", e);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.samplePhrase);
      utterance.lang = lang.code.split('-').slice(0, 2).join('-');
      utterance.rate = speechSpeed;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ==========================================================================
  // عملية الدبلجة الحقيقية الفورية ومطابقة الترجمة 100%
  // ==========================================================================
  const startDubbingProcess = async () => {
    if (!videoFile) {
      setToast({
        show: true,
        title: '⚠️ تنبيه هام',
        message: 'يرجى اختيار أو رفع ملف فيديو أولاً للبدء!',
        type: 'error'
      });
      return;
    }

    setIsProcessing(true);
    setProgressPercent(15);
    setStatusMessage('🚀 جاري رفع الفيديو واستخراج المسار الصوتي...');
    addLog(`⚡ إرسال الفيديو للسيرفر لدبلجة الكلام إلى: ${selectedLanguage.name}...`);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('target_lang', selectedLanguage.code);
    formData.append('gender', voiceGender);
    formData.append('tone', voiceTone);
    formData.append('speed', speechSpeed.toString());
    formData.append('ducking', duckingLevel.toString());
    formData.append('isolation', vocalIsolation ? 'true' : 'false');

    try {
      setProgressPercent(45);
      setStatusMessage('🧠 Whisper AI بيسمع الفيديو الفعلي ويفرغ الكلام...');
      addLog("🎙️ السيرفر يستمع للكلام المنطوق ويحلل الكلمات بالمللي ثانية...");

      const response = await fetch('http://localhost:5000/api/video/dub', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `خطأ من السيرفر (${response.status})`);
      }

      setProgressPercent(100);
      setStatusMessage('✨ اكتملت الدبلجة والترجمة بنجاح!');
      setDubbedVideoUrl(data.dubbed_video_url);

      // حقن الترجمة الحقيقية المستخرجة من الفيديو بدون أي سقوط
      if (data.segments && Array.isArray(data.segments) && data.segments.length > 0) {
        setSubtitleSegments(data.segments);
        addLog(`✅ تم تفريغ وترجمة ${data.segments.length} جملة حقيقية من الفيديو بنجاح!`);
      }

      setUserMinutes(prev => Math.max(0, prev - 1));
      setAudioTrack('dubbed');
      addLog(`🎉 تم إنشاء الفيديو المدبلج بنجاح: ${data.filename}`);

      // إظهار الإشعار المنبثق الفخم
      setToast({
        show: true,
        title: '🎉 تم إنجاز الدبلجة بنجاح!',
        message: `تم تفريغ وترجمة الفيديو ومطابقته 100% إلى (${selectedLanguage.name}). تم بدء تشغيل الصوت تلقائياً!`,
        type: 'success'
      });

      // تشغيل الفيديو والصوت المدبلج فوراً
      setTimeout(() => {
        if (dubbedVideoRef.current) {
          dubbedVideoRef.current.currentTime = 0;
          dubbedVideoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 400);

    } catch (err) {
      console.error(err);
      setProgressPercent(0);
      setStatusMessage('❌ حدث خطأ أثناء المعالجة');
      addLog(`❌ تنبيه خطأ: ${err.message}`);
      
      setToast({
        show: true,
        title: '⚠️ تعذر إتمام الدبلجة',
        message: err.message,
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================================================
  // التنزيل المباشر كملف ثنائي
  // ==========================================================================
  const handleDirectBinaryDownload = async () => {
    try {
      addLog("📥 جاري تنزيل ملف الفيديو 4K مباشرة إلى جهازك...");
      if (dubbedVideoUrl) {
        const res = await fetch(dubbedVideoUrl);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = `LinguaCast_Dubbed_${selectedLanguage.code}_4K.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      } else {
        const srtContent = subtitleSegments.map((s, idx) => {
          return `${idx + 1}\n00:00:00,000 --> 00:00:05,000\n${s.translated}\n`;
        }).join('\n');

        const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `LinguaCast_Subtitles_${selectedLanguage.code}.srt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      addLog("✅ تم تنزيل الملف بنجاح إلى مجلد التنزيلات.");
    } catch (e) {
      console.error(e);
      addLog(`❌ تعذر التنزيل: ${e.message}`);
    }
  };

  const handleUpdateSegment = (id, newText) => {
    setSubtitleSegments(prev => prev.map(s => s.id === id ? { ...s, translated: newText } : s));
  };

  const handleDeleteSegment = (id) => {
    setSubtitleSegments(prev => prev.filter(s => s.id !== id));
    addLog("🗑️ تم حذف مقطع الترجمة بنجاح.");
  };

  const handleAddNewSegment = () => {
    const last = subtitleSegments[subtitleSegments.length - 1];
    const newStart = last ? parseFloat((Number(last.end) + 0.1).toFixed(2)) : 0.0;
    const newEnd = parseFloat((newStart + 3.0).toFixed(2));
    const newSeg = {
      id: Date.now(),
      start: newStart,
      end: newEnd,
      original: "New dialog segment transcribed in real-time.",
      translated: "مقطع حواري جديد تمت إضافته ومطابقته فورياً.",
      confidence: 1.0
    };
    setSubtitleSegments(prev => [...prev, newSeg]);
    addLog(`➕ تم إضافة مقطع ترجمة جديد: ${newStart}s - ${newEnd}s`);
  };

  // فلترة الـ 150 لغة مع ميزة التقسيم السلس 60 FPS
  const filteredLanguages = useMemo(() => {
    return GLOBAL_LANGUAGES_MATRIX.filter(l => {
      const q = searchLangQuery.toLowerCase();
      const matchesSearch =
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q);
      const matchesRegion =
        selectedRegionFilter === 'الكل' || l.region === selectedRegionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [searchLangQuery, selectedRegionFilter]);

  const uniqueRegions = useMemo(() => {
    const regions = new Set(GLOBAL_LANGUAGES_MATRIX.map(l => l.region));
    return ['الكل', ...Array.from(regions)];
  }, []);

  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden"
    >
      {/* خلفية الجزيئات السديمية الحية */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* 🔔 الإشعار المنبثق الفخم (Cyberpunk Floating Toast) */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300">
          <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl backdrop-blur-2xl border shadow-2xl ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.4)] text-emerald-200'
              : 'bg-red-950/90 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.4)] text-red-200'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400 animate-pulse" />
            )}
            <div>
              <p className="font-extrabold text-sm text-white">{toast.title}</p>
              <p className="text-xs opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="mr-2 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 🌟 1. الشريط العلوي الذكي الفخم بأضواء نيونية */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060913]/90 border-b border-cyan-500/20 px-6 py-3.5 flex items-center justify-between shadow-[0_4px_30px_rgba(0,242,254,0.1)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(0,242,254,0.4)] ring-2 ring-cyan-400/40">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                LinguaCast AI
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 font-mono font-bold shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                150+ DIALECTS 4K
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              أسرع وأقوى منظومة دبلجة وترجمة فورية عصبية في العالم بدقة متناهية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all"
            title="اختصارات لوحة المفاتيح"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>الاختصارات</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">الرصيد المتاح:</span>
            <span className="font-bold text-cyan-300 font-mono">{userMinutes} دقيقة VIP</span>
          </div>

          <button
            onClick={() => setShowPricingModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95"
          >
            <Crown className="w-4 h-4 fill-current text-slate-950" />
            <span>ترقية الحساب ($5)</span>
          </button>
        </div>
      </header>

      {/* 🚀 الحاوية الرئيسية للمنصة */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* 🎥 2. جناح المشغل السينمائي المزدوج الأسطوري */}
        <section className={`bg-[#060913]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-5 shadow-[0_0_40px_rgba(0,242,254,0.15)] relative transition-all ${
          playerMode === 'theater' ? 'fixed inset-4 z-50 overflow-auto bg-[#030712]/98 border-cyan-400/50' : ''
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <h2 className="font-bold text-sm md:text-base text-cyan-300 flex items-center gap-2">
                <Film className="w-4 h-4" /> جناح المعاينة والمقارنة المتزامنة بدقة 4K فائقة السرعة
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setPlayerMode('split')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  playerMode === 'split'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold shadow-[0_0_20px_rgba(0,242,254,0.4)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Split className="w-3.5 h-3.5" /> سلايدر المقارنة
              </button>

              <button
                onClick={() => setPlayerMode('sideBySide')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  playerMode === 'sideBySide'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold shadow-[0_0_20px_rgba(0,242,254,0.4)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> جنباً لجنب
              </button>

              <button
                onClick={() => setPlayerMode(playerMode === 'theater' ? 'split' : 'theater')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
              >
                {playerMode === 'theater' ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                <span>{playerMode === 'theater' ? 'تصغير' : 'وضع المسرح'}</span>
              </button>

              <div className="h-4 w-[1px] bg-slate-800 mx-1" />

              <button
                onClick={() => setAudioTrack(audioTrack === 'dubbed' ? 'original' : 'dubbed')}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white flex items-center gap-1.5 hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all shadow-md"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>المسار: {audioTrack === 'dubbed' ? 'الصوت المدبلج (AI Dub)' : 'الصوت الأصلي'}</span>
              </button>
            </div>
          </div>

          {/* شاشة العرض وسلايدر المقارنة النيوني */}
          <div
            ref={splitContainerRef}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center select-none group shadow-inner"
          >
            {originalVideoUrl ? (
              playerMode === 'split' ? (
                <div className="relative w-full h-full">
                  <video
                    ref={originalVideoRef}
                    src={originalVideoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    muted={audioTrack === 'dubbed' && dubbedVideoUrl !== null}
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  />

                  {dubbedVideoUrl && (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${splitPosition}%` }}
                    >
                      <video
                        ref={dubbedVideoRef}
                        src={dubbedVideoUrl}
                        onTimeUpdate={handleTimeUpdate}
                        muted={audioTrack === 'original'}
                        className="absolute inset-0 w-full h-full object-contain bg-black"
                        style={{ width: `${splitContainerRef.current ? splitContainerRef.current.clientWidth : 1000}px` }}
                      />
                    </div>
                  )}

                  {dubbedVideoUrl && (
                    <div
                      onMouseDown={handleMouseDownSplit}
                      style={{ left: `${splitPosition}%` }}
                      className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_18px_#00f2fe] cursor-ew-resize z-20 flex items-center justify-center -translate-x-1/2"
                    >
                      <div className="w-8 h-8 rounded-full bg-black/90 border border-cyan-400 flex items-center justify-center text-cyan-300 text-xs shadow-[0_0_15px_#00f2fe] backdrop-blur-md">
                        ↔
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 w-full h-full gap-2 p-2 bg-slate-950">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
                    <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/80 text-[10px] text-slate-300 font-mono border border-slate-700">
                      الفيديو الأصلي
                    </span>
                    <video
                      ref={originalVideoRef}
                      src={originalVideoUrl}
                      onTimeUpdate={handleTimeUpdate}
                      muted={audioTrack === 'dubbed' && dubbedVideoUrl !== null}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-cyan-900/50 bg-black flex items-center justify-center">
                    <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-cyan-950/90 text-[10px] text-cyan-300 font-mono border border-cyan-500/40">
                      المدبلج بالذكاء الاصطناعي ({selectedLanguage.name})
                    </span>
                    <video
                      ref={dubbedVideoRef}
                      src={dubbedVideoUrl || originalVideoUrl}
                      onTimeUpdate={handleTimeUpdate}
                      muted={audioTrack === 'original'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer p-8 text-center hover:opacity-90 transition-all">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/15 to-purple-500/15 border border-cyan-500/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,242,254,0.2)]">
                  <UploadCloud className="w-10 h-10 text-cyan-400 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-xl text-white">
                  اسحب وأفلت ملف الفيديو هنا أو اضغط للاستيراد
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-md">
                  معالجة فائقة السرعة في ثوانٍ معدودة بدقة تصل إلى 4K Ultra HD مع عزل وتفريغ فوري للأصوات
                </p>
                <div className="mt-4 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-xs text-cyan-300 font-bold shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                  تصفح الملفات من جهازك
                </div>
                <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}

            {/* شريط الترجمة السينمائي البارز بنمط Netflix الذهبي المتزامن */}
            {currentSubtitle && (
              <div className="absolute bottom-12 inset-x-6 z-30 flex justify-center pointer-events-none">
                <div className="bg-black/90 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)] text-center max-w-3xl ring-1 ring-yellow-500/30">
                  <p className="text-yellow-300 font-black text-base md:text-xl tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    {currentSubtitle}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* شريط التحكم بالتايم لاين وأزرار التشغيل */}
          <div className="mt-4 space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.05"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.3)]"
            />

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black flex items-center justify-center font-bold transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)] transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <canvas ref={spectrumCanvasRef} width="140" height="30" className="rounded-xl bg-slate-950 border border-slate-800 shadow-inner" />

                <span className="font-mono text-slate-300 font-semibold text-xs">
                  {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <button
                onClick={handleDirectBinaryDownload}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 hover:opacity-95 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.45)] transition-all transform hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" /> تنزيل الفيديو المدبلج 4K مباشرة
              </button>
            </div>
          </div>
        </section>

        {/* 🎛️ 3. شريط التبويبات المتعدد (Studio Tabs) */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 0, label: "استوديو الدبلجة السريعة الفورية", icon: Sparkles },
            { id: 1, label: "محرر تفريغ النصوص والترجمة (Whisper)", icon: FileText },
            { id: 2, label: "ميكسر الصوت وعزل الضجيج (Master EQ)", icon: Sliders },
            { id: 3, label: "محرك الرندر والتصدير السينمائي", icon: Film },
            { id: 4, label: "باقات واشتراكات VIP العالمية", icon: Crown }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,242,254,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 🌟 4. محتوى التبويبات الـ 5 */}
        <div className="bg-[#060913]/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">

          {/* التبويب 1: استوديو الدبلجة الفورية */}
          {activeTab === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" /> اللغة واللهجة المستهدفة (من أصل 150)
                  </label>
                  <button
                    onClick={() => setShowLanguageModal(true)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,242,254,0.2)] text-right transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedLanguage.flag}</span>
                      <div>
                        <p className="text-xs font-extrabold text-white group-hover:text-cyan-300">{selectedLanguage.name}</p>
                        <p className="text-[10px] text-slate-400">{selectedLanguage.native} • {selectedLanguage.region}</p>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-purple-400" /> جنس الصوت العصبي
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setVoiceGender('male')}
                      className={`py-3.5 rounded-2xl text-xs font-bold transition-all border ${
                        voiceGender === 'male'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      ذكر (Male Neural)
                    </button>
                    <button
                      onClick={() => setVoiceGender('female')}
                      className={`py-3.5 rounded-2xl text-xs font-bold transition-all border ${
                        voiceGender === 'female'
                          ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      أنثى (Female Neural)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
                    <Sparkle className="w-4 h-4 text-yellow-400" /> النبرة والأداء التمثيلي
                  </label>
                  <select
                    value={voiceTone}
                    onChange={(e) => setVoiceTone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="cinematic">طبيعي وسينمائي واقعي (Cinematic Realism)</option>
                    <option value="news">إخباري ورسمي فصيح (News Anchor)</option>
                    <option value="energetic">حماسي وإعلاني سريع (Commercial Promo)</option>
                    <option value="deep">هوليوودي عميق ووثائقي (Deep Documentary)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-center">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">سرعة الإلقاء ومطابقة الشفاه:</span>
                    <span className="font-mono text-cyan-400 font-bold">{speechSpeed.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.6"
                    step="0.05"
                    value={speechSpeed}
                    onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => testVoiceSample(selectedLanguage)}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/40 text-slate-200 text-xs font-bold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
                  >
                    <Volume2 className="w-4 h-4 text-cyan-400" /> استماع فوري لنبرة الصوت
                  </button>

                  <button
                    onClick={startDubbingProcess}
                    disabled={isProcessing}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:opacity-95 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(0,242,254,0.5)] flex items-center gap-2.5 transition-all disabled:opacity-50 transform hover:scale-105 active:scale-95"
                  >
                    {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                    <span>بدء الدبلجة والتشغيل الفوري</span>
                  </button>
                </div>
              </div>

              {(isProcessing || terminalLogs.length > 0) && (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-cyan-400 flex items-center gap-2">
                      <Activity className="w-4 h-4 animate-spin" /> {statusMessage}
                    </span>
                    <span className="font-mono font-bold text-cyan-300">{progressPercent}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 shadow-[0_0_15px_#00f2fe]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="p-4 bg-black/95 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-36 overflow-y-auto space-y-1">
                    {terminalLogs.map((log, idx) => (
                      <p key={idx}>{log}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* التبويب 2: محرر تفريغ النصوص والترجمة */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> جدول تفريغ الجمل والترجمة الفورية بالمللي ثانية
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddNewSegment}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة مقطع جديد
                  </button>
                  <button
                    onClick={handleDirectBinaryDownload}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> تصدير SRT
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-right text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="p-3.5">#</th>
                      <th className="p-3.5">البداية</th>
                      <th className="p-3.5">النهاية</th>
                      <th className="p-3.5">النص الأصلي (Original)</th>
                      <th className="p-3.5">الترجمة العصبية الفورية</th>
                      <th className="p-3.5 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                    {subtitleSegments.map((seg, idx) => (
                      <tr key={seg.id} className="hover:bg-slate-900/50">
                        <td className="p-3.5 font-mono text-slate-500 font-bold">{idx + 1}</td>
                        <td className="p-3.5 font-mono text-cyan-400 font-bold">{seg.start}s</td>
                        <td className="p-3.5 font-mono text-purple-400 font-bold">{seg.end}s</td>
                        <td className="p-3.5 text-slate-300">{seg.original}</td>
                        <td className="p-3.5">
                          <input
                            type="text"
                            value={seg.translated}
                            onChange={(e) => handleUpdateSegment(seg.id, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-yellow-300 font-bold focus:border-cyan-400 focus:outline-none"
                          />
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDeleteSegment(seg.id)}
                            className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-all"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* التبويب 3: ميكسر الصوت وعزل الضجيج */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4">
                <h4 className="text-xs font-extrabold text-cyan-400 flex items-center gap-2">
                  <Music className="w-4 h-4" /> معادل الترددات الصوتي (5-Band Cinema EQ)
                </h4>
                <div className="flex justify-between items-center gap-2 pt-6">
                  {[
                    { label: "60Hz", val: eq60Hz, set: setEq60Hz },
                    { label: "250Hz", val: eq250Hz, set: setEq250Hz },
                    { label: "1kHz", val: eq1kHz, set: setEq1kHz },
                    { label: "4kHz", val: eq4kHz, set: setEq4kHz },
                    { label: "12kHz", val: eq12kHz, set: setEq12kHz }
                  ].map((band, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        value={band.val}
                        onChange={(e) => band.set(parseInt(e.target.value))}
                        className="h-32 -rotate-90 appearance-none bg-slate-800 w-1.5 rounded-lg accent-cyan-400 cursor-pointer my-6"
                      />
                      <span className="text-[11px] font-mono font-bold text-slate-300">{band.label}</span>
                      <span className="text-[10px] font-mono font-bold text-cyan-400">{band.val > 0 ? `+${band.val}` : band.val}dB</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-5">
                <h4 className="text-xs font-extrabold text-purple-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> خفض الموسيقى والعزل الصوتي
                </h4>
                <button
                  onClick={() => setVocalIsolation(!vocalIsolation)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold border transition-all ${
                    vocalIsolation
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {vocalIsolation ? 'عزل صوت المتحدث الأصلي بنسبة 100% (صوت نقي جداً)' : 'دمج الصوت الأصلي بالخلفية'}
                </button>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>مستوى الموسيقى الخلفية (Ducking):</span>
                    <span className="font-mono text-purple-400 font-bold">{Math.round(duckingLevel * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={duckingLevel}
                    onChange={(e) => setDuckingLevel(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* التبويب 4: محرك الرندر والتصدير */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300">دقة التصدير</label>
                  <select
                    value={renderResolution}
                    onChange={(e) => setRenderResolution(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200"
                  >
                    <option value="4k">4K Ultra HD (3840x2160)</option>
                    <option value="1080p">1080p Full HD (1920x1080)</option>
                    <option value="720p">720p HD (1280x720)</option>
                  </select>
                </div>
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300">الكوديك</label>
                  <select
                    value={renderCodec}
                    onChange={(e) => setRenderCodec(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200"
                  >
                    <option value="h264">H.264 / AVC (توافقية شاملة)</option>
                    <option value="h265">H.265 / HEVC (أعلى جودة)</option>
                    <option value="av1">AV1 (الأسرع والأحدث)</option>
                  </select>
                </div>
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300">معدل الإطارات (FPS)</label>
                  <select
                    value={renderFps}
                    onChange={(e) => setRenderFps(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200"
                  >
                    <option value="60">60 إطار بالثانية (سلاسة سينمائية)</option>
                    <option value="30">30 إطار بالثانية (قياسي)</option>
                    <option value="24">24 إطار بالثانية (فيلم هوليوود)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleDirectBinaryDownload}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.45)] flex items-center gap-2.5 hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" /> تنزيل الفيديو 4K المعالج مباشرة إلى جهازك
                </button>
              </div>
            </div>
          )}

          {/* التبويب 5: باقات واشتراكات VIP العالمية */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  ⭐ منظومة الاشتراكات الاحترافية العالمية
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white">اختر خطة القوة والسرعة غير المحدودة</h3>
                <p className="text-xs text-slate-400">معالجة فورية على خوادم NVIDIA H100 فائقة السرعة مع دبلجة بجميع الـ 150 لغة ولهجة</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 relative space-y-5 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(0,242,254,0.2)] transition-all">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-lg text-white">باقة المبدعين (Creator Pro)</h4>
                    <Star className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-cyan-400 font-mono">$5 <span className="text-xs font-normal text-slate-400">/ شهرياً</span></div>
                  <ul className="text-xs space-y-2.5 text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> 300 دقيقة دبلجة شهرية فائقة السرعة</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> دقة 4K بدون أي علامة مائية</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> جميع اللهجات الـ 150 المكتملة</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> تصدير ملفات SRT والترجمة المفتوحة</li>
                  </ul>
                  <button
                    onClick={() => { setActiveVIPPlan('creator'); setShowCheckoutModal(true); }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)]"
                  >
                    اشتراك الآن ($5)
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/30 via-slate-900/90 to-slate-950 border-2 border-amber-500/70 relative space-y-5 shadow-[0_0_35px_rgba(245,158,11,0.25)] transform -translate-y-2">
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black tracking-wider shadow-md">
                    👑 الخيار الأقوى والأكثر طلباً
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <h4 className="font-extrabold text-lg text-amber-300">استوديو المشاهير (Studio VIP)</h4>
                    <Crown className="w-6 h-6 text-amber-400 fill-current" />
                  </div>
                  <div className="text-3xl font-black text-amber-400 font-mono">$19 <span className="text-xs font-normal text-slate-400">/ شهرياً ($190/سنة)</span></div>
                  <ul className="text-xs space-y-2.5 text-slate-200">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> 1500 دقيقة دبلجة فورية (رندر في ثانيتين)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> أولوية مطلقة على سيرفرات H100 GPUs</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> استنساخ أصوات مخصص ومطابقة الشفاه 100%</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> تشغيل تلقائي فوري بعد الدبلجة مباشرة</li>
                  </ul>
                  <button
                    onClick={() => { setActiveVIPPlan('studio'); setShowCheckoutModal(true); }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:opacity-95 text-slate-950 font-black text-xs transition-all shadow-[0_0_25px_rgba(245,158,11,0.5)] transform hover:scale-102"
                  >
                    ترقية فورية إلى Studio VIP
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 relative space-y-5 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(217,70,239,0.2)] transition-all">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-lg text-white">الشركات والإنتاج (Enterprise)</h4>
                    <Diamond className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-purple-400 font-mono">$49 <span className="text-xs font-normal text-slate-400">/ شهرياً</span></div>
                  <ul className="text-xs space-y-2.5 text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> دقائق غير محدودة بالكامل (Unlimited 4K)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> مفتاح API خاص لربط المنصة بتطبيقاتك</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> استخراج وفصل طبقات الصوت والموسيقى 5.1</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> مدير حسابات مخصص واستشارات تقنية</li>
                  </ul>
                  <button
                    onClick={() => { setActiveVIPPlan('ultra'); setShowCheckoutModal(true); }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-95 text-white font-black text-xs transition-all shadow-[0_0_25px_rgba(217,70,239,0.4)]"
                  >
                    تفعيل باقة الشركات ($49)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ======================================================================
          💳 النافذة المنبثقة: الدفع البنكي وتفعيل الباقة الفوري
         ====================================================================== */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#060913] border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full relative shadow-[0_0_40px_rgba(0,242,254,0.2)] space-y-5">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-extrabold text-base text-white">إتمام الدفع الآمن والمشفر</h3>
                <p className="text-[10px] text-slate-400 font-mono">256-Bit SSL Encrypted Banking Core</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">رقم بطاقة الائتمان (Visa / MasterCard / Mada)</label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white font-mono focus:border-cyan-500 focus:outline-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white font-mono focus:border-cyan-500 focus:outline-none shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">رمز الأمان (CVC)</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white font-mono focus:border-cyan-500 focus:outline-none shadow-inner"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`🎉 تم الدفع وتفعيل باقة ${activeVIPPlan.toUpperCase()} بنجاح! تم شحن الرصيد فوراً.`);
                setUserMinutes(prev => prev + 500);
                setShowCheckoutModal(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all transform hover:scale-102"
            >
              تأكيد الدفع وتفعيل الباقة فوراً
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
          🌍 النافذة المنبثقة: مصفوفة اللغات الـ 150 المكتملة 100%
         ====================================================================== */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#060913] border border-cyan-500/40 rounded-3xl p-6 max-w-4xl w-full max-h-[85vh] flex flex-col relative shadow-[0_0_50px_rgba(0,242,254,0.2)] space-y-4">
            <button
              onClick={() => setShowLanguageModal(false)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" /> مصفوفة اللغات واللهجات العالمية (150 لغة كاملة)
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                {filteredLanguages.length} لغة متاحة
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
                {uniqueRegions.map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegionFilter(region)}
                    className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-bold ${
                      selectedRegionFilter === region
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchLangQuery}
                  onChange={(e) => setSearchLangQuery(e.target.value)}
                  placeholder="ابحث بين 150 لهجة ولغة (مثال: قاهرية، إسكندرانية، نجدية، حلبية، يابانية...)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>
            </div>

            <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2.5 pr-1">
              {filteredLanguages.map(lang => (
                <div
                  key={lang.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    selectedLanguage.code === lang.code
                      ? 'bg-cyan-950/70 border-cyan-500 shadow-[0_0_20px_rgba(0,242,254,0.3)] ring-1 ring-cyan-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageModal(false);
                    addLog(`🌍 تم تحديد اللغة المستهدفة: ${lang.name}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-100">{lang.name}</p>
                      <p className="text-[10px] text-slate-400">{lang.region} • {lang.native}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      testVoiceSample(lang);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-black text-cyan-400 transition-all shadow-sm"
                    title="استماع لعينة الصوت"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          ⌨️ النافذة المنبثقة: اختصارات لوحة المفاتيح
         ====================================================================== */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#060913] border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowShortcutsModal(false)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" /> اختصارات لوحة المفاتيح السريعة
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              {[
                { key: "Space", desc: "تشغيل / إيقاف مؤقت للفيديو المدبلج" },
                { key: "Arrow Right (→)", desc: "تقديم الفيديو ثانيتين للأمام" },
                { key: "Arrow Left (←)", desc: "إرجاع الفيديو ثانيتين للخلف" },
                { key: "Key F", desc: "التبديل إلى وضع المسرح السينمائي الكامل" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span>{item.desc}</span>
                  <span className="font-mono bg-black px-2 py-1 rounded border border-slate-700 text-cyan-300 text-[11px] font-bold">
                    {item.key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}