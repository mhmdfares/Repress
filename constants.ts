import { ConditionType, UserData, Target, Condition } from './types';

export const initialUserData: UserData = {
    language: "العربية",
    tone: "ودي",
    dialect: "اللهجة المصرية",
    emojis: "نعم",
    interests: "التكنولوجيا, السفر, القراءة",
    customPrompt: ""
};

export const defaultTargets = [
    {
        label: "وسائل التواصل الاجتماعي",
        options: [
            { value: 'facebook', label: 'إنشاء منشور فيسبوك' },
            { value: 'instagram', label: 'إنشاء منشور إنستقرام' },
            { value: 'twitter', label: 'إنشاء تغريدة (X/Twitter)' },
            { value: 'linkedin', label: 'إنشاء منشور لينكدإن' },
            { value: 'youtube', label: 'وصف فيديو يوتيوب' },
        ],
    },
    {
        label: "الكتابة المهنية",
        options: [
            { value: 'formalEmail', label: 'كتابة بريد إلكتروني رسمي' },
            { value: 'casualEmail', label: 'كتابة بريد إلكتروني ودي' },
            { value: 'article', label: 'إنشاء فقرة في مقال' },
            { value: 'blogIntro', label: 'كتابة مقدمة تدوينة' },
        ],
    },
    {
        label: "التسويق والمبيعات",
        options: [
            { value: 'adCopy', label: 'كتابة نسخة إعلانية (Ad Copy)' },
            { value: 'productDescription', label: 'وصف منتج للتجارة الإلكترونية' },
            { value: 'seoMeta', label: 'إنشاء وصف ميتا (SEO)' },
        ],
    },
    {
        label: "تحليل واستخدامات أخرى",
        options: [
            { value: 'analysis', label: 'تحليل المعلومات وتلخيصها' },
            { value: 'simplify', label: 'تبسيط نص معقد' },
        ],
    },
];

export const conditionOptions: Record<ConditionType, string[]> = {
    language: ["العربية", "الإنجليزية", "الفرنسية", "الإسبانية"],
    tone: ["ودي", "حماسي", "ملهم", "رسمي", "فكاهي", "احترافي", "تعليمي"],
    dialect: ["اللهجة المصرية", "اللهجة السعودية", "اللهجة الشامية", "العربية الفصحى", "بدون لهجة"],
    emojis: ["نعم", "لا"],
    audience: ["عام", "شباب", "كبار السن", "طلاب", "مهنيون", "خبراء في المجال"],
    length: ["قصير جداً", "قصير", "متوسط", "طويل", "مفصل"],
    formality: ["رسمي جداً", "رسمي", "محايد", "غير رسمي"],
    pointOfView: ["المتكلم (أنا)", "المخاطب (أنت)", "الغائب (هو/هي)"],
    format: ["فقرة واحدة", "نقاط", "قائمة مرقمة", "سؤال وجواب"],
    seoKeywords: [], // This will be a text input, not a dropdown.
    callToAction: ["تشجيع النقاش", "الدعوة للشراء", "طلب المشاركة", "توجيه لزيارة رابط", "بدون"],
    custom: ["مخصص"]
};

export const conditionLabels: Record<ConditionType, string> = {
    language: "اللغة",
    tone: "النبرة",
    dialect: "اللهجة",
    emojis: "الرموز التعبيرية",
    audience: "الجمهور المستهدف",
    length: "الطول",
    formality: "درجة الرسمية",
    pointOfView: "وجهة النظر",
    format: "التنسيق",
    seoKeywords: "الكلمات المفتاحية (SEO)",
    callToAction: "الدعوة لاتخاذ إجراء (CTA)",
    custom: "شرط مخصص"
};

type Preset = Omit<Condition, 'id'>;

export const targetPresets: Record<string, Preset[]> = {
    'facebook': [
        { type: 'tone', value: 'ودي' },
        { type: 'emojis', value: 'نعم' },
        { type: 'length', value: 'متوسط' },
        { type: 'callToAction', value: 'تشجيع النقاش' }
    ],
    'instagram': [
        { type: 'tone', value: 'حماسي' },
        { type: 'emojis', value: 'نعم' },
        { type: 'length', value: 'قصير' },
        { type: 'audience', value: 'شباب' }
    ],
    'twitter': [
        { type: 'length', value: 'قصير جداً' },
        { type: 'tone', value: 'مختصر ومباشر' }, // Custom value example
        { type: 'emojis', value: 'نعم' }
    ],
    'linkedin': [
        { type: 'formality', value: 'رسمي' },
        { type: 'tone', value: 'احترافي' },
        { type: 'audience', value: 'مهنيون' },
        { type: 'length', value: 'متوسط' }
    ],
    'formalEmail': [
        { type: 'formality', value: 'رسمي جداً' },
        { type: 'language', value: 'العربية الفصحى' },
        { type: 'pointOfView', value: 'المتكلم (أنا)' },
        { type: 'length', value: 'متوسط' }
    ],
    'adCopy': [
        { type: 'tone', value: 'مقنع' }, // Custom value example
        { type: 'length', value: 'قصير' },
        { type: 'callToAction', value: 'الدعوة للشراء' },
        { type: 'audience', value: 'عام' }
    ],
    'productDescription': [
        { type: 'format', value: 'نقاط' },
        { type: 'tone', value: 'وصفي وجذاب' }, // Custom value example
        { type: 'length', value: 'متوسط' }
    ],
    'simplify': [
        { type: 'audience', value: 'عام' },
        { type: 'tone', value: 'بسيط وواضح' }, // Custom value
        { type: 'length', value: 'قصير' }
    ]
};