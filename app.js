// ============================================================
// app.js — Multi-language Conversation Learning App
// Supports Chinese (zh) and Spanish (es)
// ============================================================

// ------------------------------------------------------------
// 0. Language Configuration
// ------------------------------------------------------------
const LANGS = {
  zh: {
    code: 'zh',
    name: '中文',
    nameKr: '중국어',
    emoji: '🐼',
    progressKey: 'learnChinese_progress',
    ttsLang: 'zh-CN',
    ttsRate: 0.85,
    foreignField: 'chinese',
    pronField: 'pinyin',
    titleField: 'titleCn',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '중국어 → 한국어',
      kr_to_foreign: '한국어 → 중국어',
    },
  },
  es: {
    code: 'es',
    name: 'Español',
    nameKr: '스페인어',
    emoji: '🇪🇸',
    progressKey: 'learnSpanish_progress',
    ttsLang: 'es-ES',
    ttsRate: 0.9,
    foreignField: 'spanish',
    pronField: 'pronunciation',
    titleField: 'titleEs',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '스페인어 → 한국어',
      kr_to_foreign: '한국어 → 스페인어',
    },
  },
  fr: {
    code: 'fr',
    name: 'Français',
    nameKr: '프랑스어',
    emoji: '🇫🇷',
    progressKey: 'learnFrench_progress',
    ttsLang: 'fr-FR',
    ttsRate: 0.9,
    foreignField: 'french',
    pronField: 'pronunciation',
    titleField: 'titleFr',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '프랑스어 → 한국어',
      kr_to_foreign: '한국어 → 프랑스어',
    },
  },
  ja: {
    code: 'ja',
    name: '日本語',
    nameKr: '일본어',
    emoji: '🇯🇵',
    progressKey: 'learnJapanese_progress',
    ttsLang: 'ja-JP',
    ttsRate: 0.9,
    foreignField: 'japanese',
    pronField: 'reading',
    titleField: 'titleJa',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '일본어 → 한국어',
      kr_to_foreign: '한국어 → 일본어',
    },
  },
  sw: {
    code: 'sw',
    name: 'Kiswahili',
    nameKr: '스와힐리어',
    emoji: '🇰🇪',
    progressKey: 'learnSwahili_progress',
    ttsLang: 'sw',
    ttsRate: 0.9,
    foreignField: 'swahili',
    pronField: 'pronunciation',
    titleField: 'titleSw',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '스와힐리어 → 한국어',
      kr_to_foreign: '한국어 → 스와힐리어',
    },
  },
  ar: {
    code: 'ar',
    name: 'العربية',
    nameKr: '아랍어',
    emoji: '🇸🇦',
    progressKey: 'learnArabic_progress',
    ttsLang: 'ar-SA',
    ttsRate: 0.85,
    foreignField: 'arabic',
    pronField: 'romanization',
    titleField: 'titleAr',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '아랍어 → 한국어',
      kr_to_foreign: '한국어 → 아랍어',
    },
  },
  th: {
    code: 'th',
    name: 'ภาษาไทย',
    nameKr: '태국어',
    emoji: '🇹🇭',
    progressKey: 'learnThai_progress',
    ttsLang: 'th-TH',
    ttsRate: 0.85,
    foreignField: 'thai',
    pronField: 'pronunciation',
    titleField: 'titleTh',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '태국어 → 한국어',
      kr_to_foreign: '한국어 → 태국어',
    },
  },
  vi: {
    code: 'vi',
    name: 'Tiếng Việt',
    nameKr: '베트남어',
    emoji: '🇻🇳',
    progressKey: 'learnVietnamese_progress',
    ttsLang: 'vi-VN',
    ttsRate: 0.9,
    foreignField: 'vietnamese',
    pronField: 'pronunciation',
    titleField: 'titleVi',
    quizLabels: {
      vocab: '단어 시험',
      foreign_to_kr: '베트남어 → 한국어',
      kr_to_foreign: '한국어 → 베트남어',
    },
  },
};

// ------------------------------------------------------------
// 0-0.5. Language Introduction Data
// ------------------------------------------------------------
const LANG_INTROS = {
  zh: {
    countries: '중국, 대만, 싱가포르, 말레이시아',
    countriesEmoji: '🇨🇳🇹🇼🇸🇬🇲🇾',
    speakers: '약 14억 명 (모국어 기준 세계 1위)',
    features: [
      '성조 언어: 4개의 성조(1성~4성)로 같은 발음도 뜻이 달라집니다',
      '한자 기반: 간체자(중국 대륙)와 번체자(대만, 홍콩)를 사용합니다',
      '어순: 주어-동사-목적어(SVO) 순서로 한국어와 다릅니다',
      '문법이 비교적 단순: 시제 변화, 격 변화가 없고 어순과 조사로 의미를 전달합니다'
    ],
    reading: [
      '병음(Pīnyīn): 한자의 발음을 로마자로 표기한 체계입니다',
      'ā á ǎ à — 각각 1성(평평), 2성(올림), 3성(내렸다올림), 4성(내림)',
      '성조를 틀리면 전혀 다른 뜻이 됩니다: mā(엄마) vs mǎ(말) vs mà(욕하다)',
      'zh, ch, sh는 한국어에 없는 권설음으로 혀를 말아 발음합니다'
    ],
    basicWords: [
      { word: '你好', pron: 'nǐ hǎo / 니하오', meaning: '안녕하세요' },
      { word: '谢谢', pron: 'xiè xie / 시에시에', meaning: '감사합니다' },
      { word: '对不起', pron: 'duì bu qǐ / 뚜이부치', meaning: '죄송합니다' },
      { word: '再见', pron: 'zài jiàn / 짜이찌엔', meaning: '안녕히 가세요' },
      { word: '是', pron: 'shì / 스', meaning: '~이다' },
      { word: '我', pron: 'wǒ / 워', meaning: '나' }
    ],
    sentenceStructure: [
      { pattern: '주어 + 是 + 명사', example: '我是韩国人 (Wǒ shì Hánguó rén)', meaning: '나는 한국인입니다' },
      { pattern: '주어 + 동사 + 목적어', example: '我喝咖啡 (Wǒ hē kāfēi)', meaning: '나는 커피를 마신다' },
      { pattern: '주어 + 很 + 형용사', example: '天气很好 (Tiānqì hěn hǎo)', meaning: '날씨가 좋다' }
    ]
  },
  es: {
    countries: '스페인, 멕시코, 콜롬비아, 아르헨티나, 페루, 칠레',
    countriesEmoji: '🇪🇸🇲🇽🇨🇴🇦🇷🇵🇪🇨🇱',
    speakers: '약 5억 9천만 명 (모국어 기준 세계 4위)',
    features: [
      '로마자 기반: 영어와 같은 알파벳을 사용하며 ñ(에녜)가 추가됩니다',
      '동사 변화가 풍부: 인칭(1·2·3인칭)과 시제에 따라 동사 어미가 변합니다',
      '명사에 성(性)이 있음: 모든 명사가 남성형 또는 여성형으로 나뉩니다',
      '발음이 규칙적: 철자와 발음의 대응이 일정하여 읽기가 비교적 쉽습니다'
    ],
    reading: [
      '모음은 a, e, i, o, u 다섯 가지이며 항상 같은 소리로 발음됩니다',
      'j는 [ㅎ] 소리, ll은 [ㅇ/ㅈ] 소리, ñ는 [ㄴㅑ] 소리로 발음합니다',
      'h는 묵음이며 발음하지 않습니다: hola → [올라]',
      '강세 규칙: 모음·n·s로 끝나면 끝에서 두 번째 음절, 그 외는 마지막 음절에 강세'
    ],
    basicWords: [
      { word: 'Hola', pron: '올라', meaning: '안녕하세요' },
      { word: 'Gracias', pron: '그라시아스', meaning: '감사합니다' },
      { word: 'Perdón', pron: '페르돈', meaning: '죄송합니다' },
      { word: 'Adiós', pron: '아디오스', meaning: '안녕히 가세요' },
      { word: 'Sí', pron: '시', meaning: '네' },
      { word: 'No', pron: '노', meaning: '아니오' }
    ],
    sentenceStructure: [
      { pattern: '주어 + ser + 명사/형용사', example: 'Yo soy coreano', meaning: '나는 한국인입니다' },
      { pattern: '주어 + 동사 + 목적어', example: 'Yo bebo café', meaning: '나는 커피를 마신다' },
      { pattern: '주어 + estar + 형용사', example: 'El clima está bien', meaning: '날씨가 좋다' }
    ]
  },
  fr: {
    countries: '프랑스, 캐나다(퀘벡), 벨기에, 스위스, 코트디부아르, 세네갈',
    countriesEmoji: '🇫🇷🇨🇦🇧🇪🇨🇭🇨🇮🇸🇳',
    speakers: '약 3억 2천만 명 (모국어 + 제2언어 포함)',
    features: [
      '로마자 기반: 영어와 같은 알파벳에 악센트 기호(é, è, ê, ë, ç 등)가 추가됩니다',
      '동사 변화가 복잡: 인칭·시제·법에 따라 동사 어미가 세밀하게 변합니다',
      '명사에 성(性)이 있음: 남성형(le)과 여성형(la)으로 나뉘며 관사가 달라집니다',
      '연음(Liaison): 단어 끝 자음이 다음 단어의 모음과 연결되어 발음됩니다'
    ],
    reading: [
      '끝 자음은 대부분 묵음: paris → [파리], petit → [프티]',
      'r은 목 뒤에서 내는 소리로 한국어에 없는 발음입니다',
      '비모음이 중요: an/en [앙], on [옹], in [앵], un [엥] 등 코를 울려 발음합니다',
      'ou [우], au/eau [오], eu [외], oi [와] 등 모음 조합의 규칙을 익혀야 합니다'
    ],
    basicWords: [
      { word: 'Bonjour', pron: '봉주르', meaning: '안녕하세요' },
      { word: 'Merci', pron: '메르시', meaning: '감사합니다' },
      { word: 'Pardon', pron: '파르동', meaning: '죄송합니다' },
      { word: 'Au revoir', pron: '오 르부아르', meaning: '안녕히 가세요' },
      { word: 'Oui', pron: '위', meaning: '네' },
      { word: 'Non', pron: '농', meaning: '아니오' }
    ],
    sentenceStructure: [
      { pattern: '주어 + être + 명사/형용사', example: 'Je suis coréen(ne)', meaning: '나는 한국인입니다' },
      { pattern: '주어 + 동사 + 목적어', example: 'Je bois du café', meaning: '나는 커피를 마신다' },
      { pattern: '주어 + 동사 + 형용사', example: 'Il fait beau', meaning: '날씨가 좋다' }
    ]
  },
  ja: {
    countries: '일본',
    countriesEmoji: '🇯🇵',
    speakers: '약 1억 2,500만 명',
    features: [
      '3종류 문자 체계: 히라가나(あ), 가타카나(ア), 한자(漢字)를 혼용합니다',
      '어순이 한국어와 동일: 주어-목적어-동사(SOV) 순서로 한국어 화자에게 유리합니다',
      '조사 사용: 은/는(は), 을/를(を), 이/가(が) 등 한국어와 유사한 조사 체계가 있습니다',
      '경어 체계: 존경어·겸양어·정중어 등 한국어처럼 복잡한 높임말 체계가 있습니다'
    ],
    reading: [
      '히라가나: 46자의 기본 문자로 일본어 고유어와 문법 요소를 표기합니다',
      '가타카나: 외래어, 의성어, 강조 표현에 사용되며 히라가나와 1:1 대응됩니다',
      '한자: 음독(중국식 읽기)과 훈독(일본식 읽기) 두 가지 읽는 방법이 있습니다',
      '장음과 촉음: 장음(おう→오우)과 촉음(っ→작은 つ)의 길이 차이에 주의해야 합니다'
    ],
    basicWords: [
      { word: 'こんにちは', pron: 'konnichiwa / 곤니치와', meaning: '안녕하세요' },
      { word: 'ありがとう', pron: 'arigatō / 아리가토우', meaning: '감사합니다' },
      { word: 'すみません', pron: 'sumimasen / 스미마셍', meaning: '죄송합니다' },
      { word: 'さようなら', pron: 'sayōnara / 사요우나라', meaning: '안녕히 가세요' },
      { word: 'はい', pron: 'hai / 하이', meaning: '네' },
      { word: 'いいえ', pron: 'iie / 이이에', meaning: '아니오' }
    ],
    sentenceStructure: [
      { pattern: '주어 + は + 명사 + です', example: '私は韓国人です (Watashi wa Kankokujin desu)', meaning: '나는 한국인입니다' },
      { pattern: '주어 + は + 목적어 + を + 동사', example: '私はコーヒーを飲みます (Watashi wa kōhī o nomimasu)', meaning: '나는 커피를 마십니다' },
      { pattern: '명사 + は + 형용사 + です', example: '天気はいいです (Tenki wa ii desu)', meaning: '날씨가 좋습니다' }
    ]
  },
  sw: {
    countries: '탄자니아, 케냐, 우간다, 콩고민주공화국, 르완다',
    countriesEmoji: '🇹🇿🇰🇪🇺🇬🇨🇩🇷🇼',
    speakers: '약 1억~1억 5천만 명 (모국어 + 제2언어 포함)',
    features: [
      '반투어족 언어: 아프리카 동부의 공용어이자 아프리카연합(AU) 공식 언어입니다',
      '명사 클래스 체계: 명사가 18개의 클래스로 분류되며 접두사가 달라집니다',
      '교착어적 특성: 동사에 주어·시제·목적어 등의 정보가 접사로 붙습니다',
      '아랍어 차용어가 많음: 오랜 교역으로 아랍어에서 온 어휘가 상당수 있습니다'
    ],
    reading: [
      '로마자 표기: 라틴 알파벳을 사용하여 읽기가 비교적 쉽습니다',
      '발음이 매우 규칙적: 철자 그대로 읽으면 되며 묵음이 거의 없습니다',
      '모음은 a[아], e[에], i[이], o[오], u[우] 다섯 가지로 일정합니다',
      "ng'은 비음으로 [응]에 가까운 소리이며 ny는 [니]에 가까운 소리입니다"
    ],
    basicWords: [
      { word: 'Habari', pron: '하바리', meaning: '안녕하세요 (소식이 어때요?)' },
      { word: 'Asante', pron: '아산테', meaning: '감사합니다' },
      { word: 'Pole', pron: '폴레', meaning: '죄송합니다 / 유감입니다' },
      { word: 'Kwaheri', pron: '콰헤리', meaning: '안녕히 가세요' },
      { word: 'Ndiyo', pron: '은디요', meaning: '네' },
      { word: 'Hapana', pron: '하파나', meaning: '아니오' }
    ],
    sentenceStructure: [
      { pattern: '주어접사 + ni + 명사', example: 'Mimi ni Mkorea', meaning: '나는 한국인입니다' },
      { pattern: '주어접사 + 시제접사 + 동사', example: 'Ninakunywa kahawa', meaning: '나는 커피를 마신다' },
      { pattern: '명사 + 형용사', example: 'Hali ya hewa ni nzuri', meaning: '날씨가 좋다' }
    ]
  },
  ar: {
    countries: '사우디아라비아, 이집트, 모로코, 이라크, 아랍에미리트, 요르단',
    countriesEmoji: '🇸🇦🇪🇬🇲🇦🇮🇶🇦🇪🇯🇴',
    speakers: '약 4억 2천만 명 (모국어 + 제2언어 포함)',
    features: [
      '오른쪽에서 왼쪽(RTL)으로 쓰고 읽는 독특한 표기 방향을 가집니다',
      '아랍 문자: 28개 자음 문자로 이루어지며 글자가 위치에 따라 형태가 변합니다',
      '어근 체계: 대부분의 단어가 3개 자음 어근에서 파생되어 어휘 확장이 체계적입니다',
      '표준 아랍어와 방언: 공식 석상의 표준어(후스하)와 지역별 구어(암미야)가 다릅니다'
    ],
    reading: [
      '아랍 문자는 28개 자음으로 구성되며 단모음은 기본적으로 표기하지 않습니다',
      '모음 부호(하라캇): 파트하(아), 담마(우), 카스라(이) 등으로 모음을 나타냅니다',
      '글자 연결: 각 글자는 독립형·어두형·어중형·어말형 최대 4가지 형태가 있습니다',
      '인후음과 강조음: ع(아인), ح(하), ق(까프) 등 목 깊은 곳에서 내는 소리가 있습니다'
    ],
    basicWords: [
      { word: 'مرحبا', pron: 'marhaba / 마르하바', meaning: '안녕하세요' },
      { word: 'شكراً', pron: 'shukran / 슈크란', meaning: '감사합니다' },
      { word: 'آسف', pron: 'āsif / 아시프', meaning: '죄송합니다' },
      { word: 'مع السلامة', pron: "ma'a s-salāma / 마아 쌀라마", meaning: '안녕히 가세요' },
      { word: 'نعم', pron: "na'am / 나암", meaning: '네' },
      { word: 'لا', pron: 'lā / 라', meaning: '아니오' }
    ],
    sentenceStructure: [
      { pattern: '주어 + 명사 (명사문)', example: 'أنا كوري (Anā Kūrī)', meaning: '나는 한국인입니다' },
      { pattern: '동사 + 주어 + 목적어 (동사문)', example: 'أشرب القهوة (Ashrabu al-qahwa)', meaning: '나는 커피를 마신다' },
      { pattern: '명사 + 형용사', example: 'الطقس جميل (Aṭ-ṭaqsu jamīl)', meaning: '날씨가 좋다' }
    ]
  },
  th: {
    countries: '태국',
    countriesEmoji: '🇹🇭',
    speakers: '약 6,900만 명',
    features: [
      '성조 언어: 5개의 성조(평성·저성·하강·고성·상승)로 의미가 구별됩니다',
      '태국 고유 문자: 44개 자음자와 32개 모음 기호로 구성된 독자적 문자를 사용합니다',
      '단어 사이 띄어쓰기 없음: 문장 내 단어 경계를 표시하지 않아 읽기 연습이 필요합니다',
      '고립어적 특성: 동사 변화나 어미 변화가 없으며 어순과 보조어로 문법 관계를 표현합니다'
    ],
    reading: [
      '자음은 저자음·중자음·고자음 세 그룹으로 나뉘며 성조 규칙에 영향을 줍니다',
      '모음은 자음의 위·아래·앞·뒤 등 다양한 위치에 표기됩니다',
      '성조 부호: ่(마이엑), ้(마이토), ๊(마이뜨리), ๋(마이짜따와) 등으로 성조를 표시합니다',
      '장모음과 단모음의 길이 차이가 의미를 구별하므로 정확한 발음이 중요합니다'
    ],
    basicWords: [
      { word: 'สวัสดี', pron: 'sawatdii / 싸왓디', meaning: '안녕하세요' },
      { word: 'ขอบคุณ', pron: 'khɔ̀ɔp khun / 컵쿤', meaning: '감사합니다' },
      { word: 'ขอโทษ', pron: 'khɔ̌ɔ thôot / 커톳', meaning: '죄송합니다' },
      { word: 'ลาก่อน', pron: 'laa kɔ̀ɔn / 라꼰', meaning: '안녕히 가세요' },
      { word: 'ใช่', pron: 'châi / 차이', meaning: '네' },
      { word: 'ไม่', pron: 'mâi / 마이', meaning: '아니오' }
    ],
    sentenceStructure: [
      { pattern: '주어 + เป็น + 명사', example: 'ฉันเป็นคนเกาหลี (Chǎn pen khon Kaolǐi)', meaning: '나는 한국인입니다' },
      { pattern: '주어 + 동사 + 목적어', example: 'ฉันดื่มกาแฟ (Chǎn dùum kaafɛɛ)', meaning: '나는 커피를 마신다' },
      { pattern: '명사 + 형용사', example: 'อากาศดี (Aakàat dii)', meaning: '날씨가 좋다' }
    ]
  },
  vi: {
    countries: '베트남',
    countriesEmoji: '🇻🇳',
    speakers: '약 8,500만 명',
    features: [
      '라틴 문자 기반: 알파벳에 성조 부호와 특수 문자(ơ, ư, đ 등)를 추가한 쯔꾸옥응으를 사용합니다',
      '성조 언어: 6개의 성조로 같은 철자도 성조에 따라 완전히 다른 뜻이 됩니다',
      '고립어적 특성: 단어의 형태 변화가 없으며 어순과 보조어로 문법 관계를 나타냅니다',
      '한자어 차용: 한국어처럼 한자에서 유래한 한월어(漢越語)가 전체 어휘의 약 60%를 차지합니다'
    ],
    reading: [
      '6개 성조: 평성(a), 현성(à), 예성(á), 물음성(ả), 넘어짐성(ã), 무거운성(ạ)',
      '라틴 알파벳 기반이지만 d는 [z], đ는 [d] 소리로 영어와 다릅니다',
      '모음이 풍부: a, ă, â, e, ê, i, o, ô, ơ, u, ư 등 11개의 모음 문자가 있습니다',
      'nh[니], ng/ngh[응], tr[쯔], gi[지] 등 자음 조합의 발음 규칙을 익혀야 합니다'
    ],
    basicWords: [
      { word: 'Xin chào', pron: '신 짜오', meaning: '안녕하세요' },
      { word: 'Cảm ơn', pron: '깜 언', meaning: '감사합니다' },
      { word: 'Xin lỗi', pron: '신 로이', meaning: '죄송합니다' },
      { word: 'Tạm biệt', pron: '땀 비엣', meaning: '안녕히 가세요' },
      { word: 'Vâng', pron: '방', meaning: '네' },
      { word: 'Không', pron: '콩', meaning: '아니오' }
    ],
    sentenceStructure: [
      { pattern: '주어 + là + 명사', example: 'Tôi là người Hàn Quốc', meaning: '나는 한국인입니다' },
      { pattern: '주어 + 동사 + 목적어', example: 'Tôi uống cà phê', meaning: '나는 커피를 마신다' },
      { pattern: '명사 + 형용사', example: 'Thời tiết đẹp', meaning: '날씨가 좋다' }
    ]
  }
};

// ------------------------------------------------------------
// 0-0.6. Language Alphabet / Phonetic Guide Data
// ------------------------------------------------------------
const LANG_ALPHABETS = {
  es: {
    title: '스페인어 알파벳',
    description: '스페인어는 27개의 알파벳을 사용합니다. 영어 알파벳에 ñ(에녜)이 추가됩니다.',
    sections: [
      { name: '모음 (Vocales)', chars: [
        { char: 'A a', pron: '아', note: '항상 [아] 소리' },
        { char: 'E e', pron: '에', note: '항상 [에] 소리' },
        { char: 'I i', pron: '이', note: '항상 [이] 소리' },
        { char: 'O o', pron: '오', note: '항상 [오] 소리' },
        { char: 'U u', pron: '우', note: '항상 [우] 소리, gu/qu 뒤에서 묵음일 수 있음' }
      ]},
      { name: '자음 (Consonantes)', chars: [
        { char: 'B b', pron: '베', note: '영어 b와 유사, 어중에서는 약하게 발음' },
        { char: 'C c', pron: '세', note: 'e/i 앞에서 [ㅅ](중남미)/[ㅆ](스페인), 나머지 [ㅋ]' },
        { char: 'D d', pron: '데', note: '어중에서 약화' },
        { char: 'F f', pron: '에페', note: '영어 f와 동일' },
        { char: 'G g', pron: '헤', note: 'e/i 앞에서 [ㅎ], 나머지 [ㄱ]' },
        { char: 'H h', pron: '아체', note: '항상 묵음, 소리 없음' },
        { char: 'J j', pron: '호타', note: '항상 [ㅎ] 소리 (강한 ㅎ)' },
        { char: 'K k', pron: '카', note: '외래어에서만 사용, [ㅋ] 소리' },
        { char: 'L l', pron: '엘레', note: '영어 l과 유사' },
        { char: 'M m', pron: '에메', note: '영어 m과 동일' },
        { char: 'N n', pron: '에네', note: '영어 n과 동일' },
        { char: 'Ñ ñ', pron: '에녜', note: '[니] 소리, español → 에스파뇰' },
        { char: 'P p', pron: '페', note: '영어 p와 유사, 기식 없음' },
        { char: 'Q q', pron: '꾸', note: '항상 qu로 쓰이며 [ㅋ] 소리, u는 묵음' },
        { char: 'R r', pron: '에레', note: '어두에서 굴림 소리, 어중 단타' },
        { char: 'S s', pron: '에세', note: '항상 [ㅅ] 소리' },
        { char: 'T t', pron: '테', note: '영어 t와 유사, 기식 없음' },
        { char: 'V v', pron: '우베', note: 'b와 거의 동일하게 발음' },
        { char: 'W w', pron: '우베 도블레', note: '외래어에서만 사용' },
        { char: 'X x', pron: '에키스', note: '[ㅋㅅ] 또는 [ㅅ] 소리' },
        { char: 'Y y', pron: '예', note: '자음 [ㅇ/ㅈ], 단독 모음 [이]' },
        { char: 'Z z', pron: '세타', note: '[ㅅ](중남미) 또는 [θ](스페인)' }
      ]}
    ],
    tips: ['스페인어는 철자와 발음이 거의 일치하여 읽기가 쉽습니다', 'rr은 혀를 굴리는 강한 진동음입니다 (perro: 뻬로)', 'll은 지역에 따라 [ㅇ], [ㅈ], [ㅅ] 등으로 발음됩니다', 'h는 항상 묵음입니다 (hola → 올라)']
  },
  fr: {
    title: '프랑스어 알파벳',
    description: '프랑스어는 26개의 알파벳을 사용합니다. 영어와 같은 글자지만 발음이 매우 다르며, 악센트 부호가 추가됩니다.',
    sections: [
      { name: '모음 (Voyelles)', chars: [
        { char: 'A a', pron: '아', note: '[아] 소리' },
        { char: 'E e', pron: '으', note: '약한 [으], 위치에 따라 묵음 가능' },
        { char: 'I i', pron: '이', note: '[이] 소리' },
        { char: 'O o', pron: '오', note: '[오] 소리' },
        { char: 'U u', pron: '위', note: '[위] 소리, 입술을 둥글게 모으고 [이]' },
        { char: 'Y y', pron: '이그렉', note: '모음 [이] 또는 반모음 역할' }
      ]},
      { name: '자음 (Consonnes)', chars: [
        { char: 'B b', pron: '베', note: '영어 b와 동일' },
        { char: 'C c', pron: '세', note: 'e/i 앞에서 [ㅅ], 나머지 [ㅋ]' },
        { char: 'D d', pron: '데', note: '영어 d와 유사, 어말에서 묵음' },
        { char: 'F f', pron: '에프', note: '영어 f와 동일' },
        { char: 'G g', pron: '제', note: 'e/i 앞에서 [ㅈ], 나머지 [ㄱ]' },
        { char: 'H h', pron: '아슈', note: '항상 묵음' },
        { char: 'J j', pron: '지', note: '[ㅈ] 소리' },
        { char: 'K k', pron: '카', note: '외래어에서 사용' },
        { char: 'L l', pron: '엘', note: '영어 l과 유사' },
        { char: 'M m', pron: '엠', note: '영어 m과 동일' },
        { char: 'N n', pron: '엔', note: '영어 n과 동일' },
        { char: 'P p', pron: '페', note: '영어 p와 유사' },
        { char: 'Q q', pron: '퀴', note: '항상 qu로 쓰이며 [ㅋ] 소리' },
        { char: 'R r', pron: '에르', note: '목젖 진동음' },
        { char: 'S s', pron: '에스', note: '모음 사이 [ㅈ], 나머지 [ㅅ]' },
        { char: 'T t', pron: '테', note: '어말에서 보통 묵음' },
        { char: 'V v', pron: '베', note: '영어 v와 동일' },
        { char: 'W w', pron: '두블르베', note: '외래어에서 사용' },
        { char: 'X x', pron: '익스', note: '[ㅋㅅ] 또는 [ㄱㅈ] 소리' },
        { char: 'Z z', pron: '제드', note: '[ㅈ] 소리' }
      ]},
      { name: '악센트 부호 (Accents)', chars: [
        { char: 'é', pron: '에', note: 'accent aigu: 닫힌 [에]' },
        { char: 'è', pron: '에', note: 'accent grave: 열린 [에]' },
        { char: 'ê', pron: '에', note: 'accent circonflexe: 열린 [에]' },
        { char: 'ë', pron: '에', note: 'tréma: 앞 모음과 분리 발음' },
        { char: 'à', pron: '아', note: '동음이의어 구별용 (a/à)' },
        { char: 'â', pron: '아', note: '약간 긴 [아]' },
        { char: 'ù', pron: '위', note: '동음이의어 구별용 (ou/où)' },
        { char: 'û', pron: '위', note: '약간 긴 [위]' },
        { char: 'î', pron: '이', note: '약간 긴 [이]' },
        { char: 'ô', pron: '오', note: '닫힌 [오]' },
        { char: 'ç', pron: '쎄디유', note: 'a/o/u 앞에서 c를 [ㅅ]으로, français → 프랑세' }
      ]}
    ],
    tips: ['어말 자음(d, t, s, x, z, p 등)은 대부분 묵음입니다', '비모음: an/en=[앙], on=[옹], in=[앵], un=[엥]', 'ch=[슈], ph=[프], gn=[니] 등 조합 발음에 주의하세요', '연음(liaison)으로 어말 묵음 자음이 다음 모음과 연결됩니다']
  },
  ja: {
    title: '일본어 가나',
    description: '일본어는 히라가나와 가타카나 각 46자를 사용합니다. 히라가나는 일반 표기, 가타카나는 외래어 표기에 주로 씁니다.',
    sections: [
      { name: 'あ행 (모음)', chars: [
        { char: 'あ ア', pron: '아', note: 'a' }, { char: 'い イ', pron: '이', note: 'i' }, { char: 'う ウ', pron: '우', note: 'u' }, { char: 'え エ', pron: '에', note: 'e' }, { char: 'お オ', pron: '오', note: 'o' }
      ]},
      { name: 'か행', chars: [
        { char: 'か カ', pron: '카', note: 'ka' }, { char: 'き キ', pron: '키', note: 'ki' }, { char: 'く ク', pron: '쿠', note: 'ku' }, { char: 'け ケ', pron: '케', note: 'ke' }, { char: 'こ コ', pron: '코', note: 'ko' }
      ]},
      { name: 'さ행', chars: [
        { char: 'さ サ', pron: '사', note: 'sa' }, { char: 'し シ', pron: '시', note: 'shi' }, { char: 'す ス', pron: '스', note: 'su' }, { char: 'せ セ', pron: '세', note: 'se' }, { char: 'そ ソ', pron: '소', note: 'so' }
      ]},
      { name: 'た행', chars: [
        { char: 'た タ', pron: '타', note: 'ta' }, { char: 'ち チ', pron: '치', note: 'chi' }, { char: 'つ ツ', pron: '츠', note: 'tsu' }, { char: 'て テ', pron: '테', note: 'te' }, { char: 'と ト', pron: '토', note: 'to' }
      ]},
      { name: 'な행', chars: [
        { char: 'な ナ', pron: '나', note: 'na' }, { char: 'に ニ', pron: '니', note: 'ni' }, { char: 'ぬ ヌ', pron: '누', note: 'nu' }, { char: 'ね ネ', pron: '네', note: 'ne' }, { char: 'の ノ', pron: '노', note: 'no' }
      ]},
      { name: 'は행', chars: [
        { char: 'は ハ', pron: '하', note: 'ha (조사일 때 wa)' }, { char: 'ひ ヒ', pron: '히', note: 'hi' }, { char: 'ふ フ', pron: '후', note: 'fu' }, { char: 'へ ヘ', pron: '헤', note: 'he (조사일 때 e)' }, { char: 'ほ ホ', pron: '호', note: 'ho' }
      ]},
      { name: 'ま행', chars: [
        { char: 'ま マ', pron: '마', note: 'ma' }, { char: 'み ミ', pron: '미', note: 'mi' }, { char: 'む ム', pron: '무', note: 'mu' }, { char: 'め メ', pron: '메', note: 'me' }, { char: 'も モ', pron: '모', note: 'mo' }
      ]},
      { name: 'や행', chars: [
        { char: 'や ヤ', pron: '야', note: 'ya' }, { char: 'ゆ ユ', pron: '유', note: 'yu' }, { char: 'よ ヨ', pron: '요', note: 'yo' }
      ]},
      { name: 'ら행', chars: [
        { char: 'ら ラ', pron: '라', note: 'ra' }, { char: 'り リ', pron: '리', note: 'ri' }, { char: 'る ル', pron: '루', note: 'ru' }, { char: 'れ レ', pron: '레', note: 're' }, { char: 'ろ ロ', pron: '로', note: 'ro' }
      ]},
      { name: 'わ행 + ん', chars: [
        { char: 'わ ワ', pron: '와', note: 'wa' }, { char: 'を ヲ', pron: '오', note: 'wo (조사 전용)' }, { char: 'ん ン', pron: '응/은/엄', note: 'n' }
      ]},
      { name: '탁음 (濁音)', chars: [
        { char: 'が ガ', pron: '가', note: 'ga' }, { char: 'ぎ ギ', pron: '기', note: 'gi' }, { char: 'ぐ グ', pron: '구', note: 'gu' }, { char: 'げ ゲ', pron: '게', note: 'ge' }, { char: 'ご ゴ', pron: '고', note: 'go' },
        { char: 'ざ ザ', pron: '자', note: 'za' }, { char: 'じ ジ', pron: '지', note: 'ji' }, { char: 'ず ズ', pron: '즈', note: 'zu' }, { char: 'ぜ ゼ', pron: '제', note: 'ze' }, { char: 'ぞ ゾ', pron: '조', note: 'zo' },
        { char: 'だ ダ', pron: '다', note: 'da' }, { char: 'ぢ ヂ', pron: '지', note: 'ji' }, { char: 'づ ヅ', pron: '즈', note: 'zu' }, { char: 'で デ', pron: '데', note: 'de' }, { char: 'ど ド', pron: '도', note: 'do' },
        { char: 'ば バ', pron: '바', note: 'ba' }, { char: 'び ビ', pron: '비', note: 'bi' }, { char: 'ぶ ブ', pron: '부', note: 'bu' }, { char: 'べ ベ', pron: '베', note: 'be' }, { char: 'ぼ ボ', pron: '보', note: 'bo' }
      ]},
      { name: '반탁음 (半濁音)', chars: [
        { char: 'ぱ パ', pron: '파', note: 'pa' }, { char: 'ぴ ピ', pron: '피', note: 'pi' }, { char: 'ぷ プ', pron: '푸', note: 'pu' }, { char: 'ぺ ペ', pron: '페', note: 'pe' }, { char: 'ぽ ポ', pron: '포', note: 'po' }
      ]}
    ],
    tips: ['히라가나는 일상 표기, 가타카나는 외래어·의성어·강조에 사용합니다', '탁음(゛)은 점 두 개, 반탁음(゜)은 동그라미를 붙입니다', 'し(shi), ち(chi), つ(tsu), ふ(fu)는 로마자 표기가 불규칙합니다', '장음은 히라가나에서 모음 추가, 가타카나에서 ー를 씁니다']
  },
  sw: {
    title: '스와힐리어 알파벳',
    description: '스와힐리어는 라틴 알파벳을 사용하며, 발음이 매우 규칙적입니다.',
    sections: [
      { name: '모음 (Vokali)', chars: [
        { char: 'A a', pron: '아', note: '항상 [아]' }, { char: 'E e', pron: '에', note: '항상 [에]' }, { char: 'I i', pron: '이', note: '항상 [이]' }, { char: 'O o', pron: '오', note: '항상 [오]' }, { char: 'U u', pron: '우', note: '항상 [우]' }
      ]},
      { name: '자음 (Konsonanti)', chars: [
        { char: 'B b', pron: '브', note: '영어 b' }, { char: 'C c', pron: '츠', note: 'ch 조합으로 주로 사용' }, { char: 'D d', pron: '드', note: '영어 d' }, { char: 'F f', pron: '프', note: '영어 f' },
        { char: 'G g', pron: '그', note: '항상 [ㄱ]' }, { char: 'H h', pron: '흐', note: '가볍게 [ㅎ]' }, { char: 'J j', pron: '즈', note: '영어 j [ㅈ]' }, { char: 'K k', pron: '크', note: '영어 k' },
        { char: 'L l', pron: '을', note: '영어 l' }, { char: 'M m', pron: '음', note: '음절 형성 가능 (mtoto)' }, { char: 'N n', pron: '은', note: '음절 형성 가능 (nchi)' }, { char: 'P p', pron: '프', note: '영어 p' },
        { char: 'R r', pron: '르', note: '혀끝 탄설음' }, { char: 'S s', pron: '스', note: '항상 [ㅅ]' }, { char: 'T t', pron: '트', note: '영어 t' }, { char: 'V v', pron: '브', note: '영어 v' },
        { char: 'W w', pron: '우', note: '반모음 [w]' }, { char: 'Y y', pron: '이', note: '반모음 [j]' }, { char: 'Z z', pron: '즈', note: '영어 z' }
      ]},
      { name: '특수 자음 조합', chars: [
        { char: 'ch', pron: '치', note: '영어 ch와 동일' }, { char: 'dh', pron: '드', note: '영어 this의 th' }, { char: 'gh', pron: '그', note: '목구멍 마찰음' },
        { char: 'kh', pron: '크', note: '강한 기식음' }, { char: 'mb', pron: '음브', note: '비음+파열음' }, { char: 'nd', pron: '은드', note: '비음+파열음' },
        { char: 'ng', pron: '응그', note: '비음+파열음' }, { char: "ng'", pron: '응', note: '비음만' }, { char: 'nj', pron: '은즈', note: '비음+파찰음' },
        { char: 'ny', pron: '니', note: '구개 비음' }, { char: 'sh', pron: '쉬', note: '영어 sh와 동일' }, { char: 'th', pron: '스', note: '영어 think의 th' }
      ]}
    ],
    tips: ['철자와 발음이 거의 완벽하게 일치합니다', '강세는 거의 항상 끝에서 두 번째 음절에 옵니다', 'm-, n-으로 시작하는 비음 접두사는 독립 음절을 형성합니다', '아랍어 차용어로 인해 dh, gh, kh, th 같은 조합이 있습니다']
  },
  ar: {
    title: '아랍어 알파벳',
    description: '아랍어는 28개의 자음 글자를 사용하며, 오른쪽에서 왼쪽으로 씁니다. 모음은 부호(하라캇)로 표시합니다.',
    sections: [
      { name: '기본 글자 (1~7)', chars: [
        { char: 'ا', pron: '알리프', note: 'a 또는 장모음 [아]' }, { char: 'ب', pron: '바', note: 'b 소리' }, { char: 'ت', pron: '타', note: 't 소리' },
        { char: 'ث', pron: '싸', note: 'th (think의 th)' }, { char: 'ج', pron: '짐', note: 'j 소리' }, { char: 'ح', pron: '하', note: '강한 h, 목구멍 마찰' }, { char: 'خ', pron: '하', note: 'kh 소리, 목구멍 마찰음' }
      ]},
      { name: '기본 글자 (8~14)', chars: [
        { char: 'د', pron: '달', note: 'd 소리' }, { char: 'ذ', pron: '잘', note: 'dh (this의 th)' }, { char: 'ر', pron: '라', note: 'r 소리, 탄설음' },
        { char: 'ز', pron: '자이', note: 'z 소리' }, { char: 'س', pron: '신', note: 's 소리' }, { char: 'ش', pron: '쉰', note: 'sh 소리' }, { char: 'ص', pron: '싸드', note: '강조 s' }
      ]},
      { name: '기본 글자 (15~21)', chars: [
        { char: 'ض', pron: '다드', note: '강조 d' }, { char: 'ط', pron: '따', note: '강조 t' }, { char: 'ظ', pron: '자', note: '강조 dh/z' },
        { char: 'ع', pron: '아인', note: '목구멍 유성 마찰음' }, { char: 'غ', pron: '가인', note: 'gh, 목젖 마찰음' }, { char: 'ف', pron: '파', note: 'f 소리' }, { char: 'ق', pron: '까프', note: 'q, 목젖 파열음' }
      ]},
      { name: '기본 글자 (22~28)', chars: [
        { char: 'ك', pron: '카프', note: 'k 소리' }, { char: 'ل', pron: '람', note: 'l 소리' }, { char: 'م', pron: '밈', note: 'm 소리' },
        { char: 'ن', pron: '눈', note: 'n 소리' }, { char: 'ه', pron: '하', note: 'h, 가벼운 날숨' }, { char: 'و', pron: '와우', note: 'w 또는 장모음 [우]' }, { char: 'ي', pron: '야', note: 'y 또는 장모음 [이]' }
      ]},
      { name: '모음 부호 (하라캇)', chars: [
        { char: 'فَ', pron: '파', note: '파트하: 짧은 [아]' }, { char: 'فِ', pron: '피', note: '카스라: 짧은 [이]' }, { char: 'فُ', pron: '푸', note: '담마: 짧은 [우]' },
        { char: 'فْ', pron: '프', note: '수쿤: 모음 없음' }, { char: 'فّ', pron: '프프', note: '샷다: 자음 겹침' }
      ]}
    ],
    tips: ['오른쪽에서 왼쪽으로 읽고 씁니다', '글자는 어두·어중·어말·독립형 4가지 형태가 있습니다', '강조음(ص, ض, ط, ظ)은 혀를 뒤로 말아 발음합니다', '일상 텍스트에는 모음 부호를 생략하는 경우가 많습니다']
  },
  th: {
    title: '태국어 자모',
    description: '태국어는 44개의 자음과 다양한 모음 기호를 사용합니다. 자음은 중자음·고자음·저자음 3그룹으로 나뉩니다.',
    sections: [
      { name: '중자음 (9자)', chars: [
        { char: 'ก', pron: '꼬 까이', note: 'k/g, 닭' }, { char: 'จ', pron: '쩌 짠', note: 'j/ch, 접시' }, { char: 'ฎ', pron: '도 차다', note: 'd/t, 왕관' },
        { char: 'ฏ', pron: '또 빠딱', note: 't, 창' }, { char: 'ด', pron: '도 덱', note: 'd/t, 어린이' }, { char: 'ต', pron: '또 따오', note: 't, 거북이' },
        { char: 'บ', pron: '보 바이마이', note: 'b/p, 잎' }, { char: 'ป', pron: '뽀 쁠라', note: 'p, 물고기' }, { char: 'อ', pron: '어 앙', note: '성문음/묵음, 대야' }
      ]},
      { name: '고자음 (11자)', chars: [
        { char: 'ข', pron: '커 카이', note: 'kh, 달걀' }, { char: 'ฃ', pron: '커 쿠앗', note: 'kh (미사용)' }, { char: 'ฉ', pron: '처 칭', note: 'ch, 심벌즈' },
        { char: 'ฐ', pron: '터 탄', note: 'th, 받침대' }, { char: 'ถ', pron: '터 퉁', note: 'th, 자루' }, { char: 'ผ', pron: '퍼 픙', note: 'ph, 벌' },
        { char: 'ฝ', pron: '퍼 파', note: 'f, 뚜껑' }, { char: 'ศ', pron: '서 살라', note: 's, 정자' }, { char: 'ษ', pron: '서 르시', note: 's, 은둔자' },
        { char: 'ส', pron: '서 스아', note: 's, 호랑이' }, { char: 'ห', pron: '허 힙', note: 'h, 상자' }
      ]},
      { name: '저자음 (24자)', chars: [
        { char: 'ค', pron: '커 콰이', note: 'kh, 물소' }, { char: 'ฅ', pron: '커 콘', note: 'kh (미사용)' }, { char: 'ฆ', pron: '커 라캉', note: 'kh, 종' },
        { char: 'ง', pron: '응어 응우', note: 'ng, 뱀' }, { char: 'ช', pron: '처 창', note: 'ch, 코끼리' }, { char: 'ซ', pron: '서 소', note: 's, 쇠사슬' },
        { char: 'ฌ', pron: '처 끄쩡', note: 'ch, 나무' }, { char: 'ญ', pron: '여 잉', note: 'y, 여인' }, { char: 'ฑ', pron: '터 몬토', note: 'th' },
        { char: 'ฒ', pron: '터 푸타오', note: 'th, 노인' }, { char: 'ณ', pron: '너 넨', note: 'n, 사미승' }, { char: 'ท', pron: '터 타한', note: 'th, 군인' },
        { char: 'ธ', pron: '터 통', note: 'th, 깃발' }, { char: 'น', pron: '너 누', note: 'n, 쥐' }, { char: 'พ', pron: '퍼 판', note: 'ph, 쟁반' },
        { char: 'ฟ', pron: '퍼 판', note: 'f, 이빨' }, { char: 'ภ', pron: '퍼 삼파오', note: 'ph, 범선' }, { char: 'ม', pron: '머 마', note: 'm, 말' },
        { char: 'ย', pron: '여 약', note: 'y, 거인' }, { char: 'ร', pron: '러 르아', note: 'r, 배' }, { char: 'ล', pron: '러 링', note: 'l, 원숭이' },
        { char: 'ว', pron: '워 왠', note: 'w, 반지' }, { char: 'ฬ', pron: '러 쭐라', note: 'l, 연' }, { char: 'ฮ', pron: '허 녹훅', note: 'h, 부엉이' }
      ]},
      { name: '기본 모음', chars: [
        { char: '-า', pron: '아:', note: '장모음 [아]' }, { char: '-ะ', pron: '아', note: '단모음 [아]' }, { char: '-ิ', pron: '이', note: '단모음 [이]' }, { char: '-ี', pron: '이:', note: '장모음 [이]' },
        { char: '-ุ', pron: '우', note: '단모음 [우]' }, { char: '-ู', pron: '우:', note: '장모음 [우]' }, { char: '-ึ', pron: '으', note: '단모음 [으]' }, { char: '-ื', pron: '으:', note: '장모음 [으]' },
        { char: 'เ-', pron: '에:', note: '장모음 [에]' }, { char: 'แ-', pron: '애:', note: '장모음 [애]' }, { char: 'โ-', pron: '오:', note: '장모음 [오]' },
        { char: 'เ-อ', pron: '어:', note: '장모음 [어]' }, { char: 'ไ-', pron: '아이', note: '이중모음' }, { char: 'ใ-', pron: '아이', note: '이중모음 (20개 단어만)' }
      ]}
    ],
    tips: ['자음 그룹(중·고·저)에 따라 성조 규칙이 달라집니다', '모음은 자음의 위·아래·앞·뒤에 붙으며 위치가 다양합니다', '장모음과 단모음의 길이 차이가 의미를 구별합니다', '받침(종성)으로 쓰일 때 자음 소리가 달라질 수 있습니다']
  },
  vi: {
    title: '베트남어 알파벳',
    description: '베트남어는 29개의 라틴 알파벳을 사용하며, 6개의 성조 부호가 있습니다.',
    sections: [
      { name: '모음 (Nguyên âm)', chars: [
        { char: 'A a', pron: '아', note: '입을 크게 벌린 [아]' }, { char: 'Ă ă', pron: '아', note: '짧은 [아]' }, { char: 'Â â', pron: '어', note: '[어]에 가까운 소리' },
        { char: 'E e', pron: '에', note: '넓은 [에]' }, { char: 'Ê ê', pron: '에', note: '좁은 [에]' }, { char: 'I i', pron: '이', note: '[이]' },
        { char: 'O o', pron: '오', note: '넓은 [오]' }, { char: 'Ô ô', pron: '오', note: '좁은 [오]' }, { char: 'Ơ ơ', pron: '어', note: '[어]' },
        { char: 'U u', pron: '우', note: '[우]' }, { char: 'Ư ư', pron: '으', note: '[으]' }, { char: 'Y y', pron: '이', note: '[이], i와 동일' }
      ]},
      { name: '자음 (Phụ âm)', chars: [
        { char: 'B b', pron: '버', note: '[ㅂ] 내파음' }, { char: 'C c', pron: '꺼', note: '[ㅋ/ㄲ]' }, { char: 'D d', pron: '저/이어', note: '북부 [ㅈ], 남부 [j]' },
        { char: 'Đ đ', pron: '더', note: '[ㄷ], 영어 d' }, { char: 'G g', pron: '거', note: '[ㄱ]' }, { char: 'H h', pron: '허', note: '[ㅎ]' },
        { char: 'K k', pron: '까', note: '[ㅋ/ㄲ], e/ê/i/y 앞에서' }, { char: 'L l', pron: '러', note: '[ㄹ]' }, { char: 'M m', pron: '머', note: '[ㅁ]' },
        { char: 'N n', pron: '너', note: '[ㄴ]' }, { char: 'P p', pron: '퍼', note: '[ㅂ], 주로 받침이나 ph' }, { char: 'Q q', pron: '꿔', note: 'qu로 [ㅋ우]' },
        { char: 'R r', pron: '러', note: '북부 [ㅈ], 남부 [ɹ]' }, { char: 'S s', pron: '서', note: '[ㅅ]' }, { char: 'T t', pron: '터', note: '[ㄷ]' },
        { char: 'V v', pron: '버', note: '북부 [v], 남부 [j]' }, { char: 'X x', pron: '써', note: '[ㅅ], 영어 s' }
      ]},
      { name: '성조 부호 (6성)', chars: [
        { char: 'a (없음)', pron: '평성', note: '높고 평평하게 — ma: 유령' },
        { char: 'à (huyền)', pron: '하강', note: '낮고 내려가는 소리 — mà: 그런데' },
        { char: 'á (sắc)', pron: '상승', note: '높이 올라가는 소리 — má: 뺨' },
        { char: 'ả (hỏi)', pron: '하강상승', note: '내려갔다 올라가는 — mả: 무덤' },
        { char: 'ã (ngã)', pron: '상승끊김', note: '올라가다 끊기는 — mã: 코드' },
        { char: 'ạ (nặng)', pron: '하강끊김', note: '낮고 급히 끊기는 — mạ: 모종' }
      ]}
    ],
    tips: ['6성조는 의미를 완전히 바꾸므로 성조 연습이 가장 중요합니다', '남부와 북부 발음 차이가 크며, d, r, s, v, gi 등이 다릅니다', 'ph=[ㅍ], th=[ㅌ], kh=[ㅋ], nh=[니], ng/ngh=[ㅇ] 등 자음 조합에 주의하세요', 'ă는 a의 짧은 버전, â는 a의 중앙화된 버전입니다']
  }
};

// ------------------------------------------------------------
// 0-1. Data Loader (fetch JSON from data/{lang}/)
// ------------------------------------------------------------
const DataLoader = {
  _metaCache: {},   // { zh: { totalLevels, titles, icons }, es: ... }
  _levelCache: {},  // { 'zh-1': { ... }, 'es-3': { ... } }

  async loadMeta(langCode) {
    if (this._metaCache[langCode]) return this._metaCache[langCode];
    const resp = await fetch(`data/${langCode}/meta.json`);
    const meta = await resp.json();
    this._metaCache[langCode] = meta;
    return meta;
  },

  async loadLevel(langCode, level) {
    const key = `${langCode}-${level}`;
    if (this._levelCache[key]) return this._levelCache[key];
    const num = String(level).padStart(2, '0');
    const resp = await fetch(`data/${langCode}/level${num}.json`);
    const data = await resp.json();
    this._levelCache[key] = data;
    return data;
  },

  async getTotal(langCode) {
    const meta = await this.loadMeta(langCode);
    return meta.totalLevels;
  },

  async getTitles(langCode) {
    const meta = await this.loadMeta(langCode);
    return meta.titles;
  },

  async getIcons(langCode) {
    const meta = await this.loadMeta(langCode);
    return meta.icons;
  },
};

let currentLang = null; // set by router

function getLang() {
  return LANGS[currentLang] || LANGS.zh;
}

// ------------------------------------------------------------
// 1. Progress Manager (per-language)
// ------------------------------------------------------------
const Progress = {
  _stores: {},

  _getStore(langCode) {
    const key = LANGS[langCode]?.progressKey || 'learnChinese_progress';
    if (!this._stores[key]) {
      let data = null;
      try {
        const saved = localStorage.getItem(key);
        if (saved) data = JSON.parse(saved);
      } catch {}
      this._stores[key] = data || { completedLevels: [], scores: {} };
    }
    return { key, data: this._stores[key] };
  },

  _save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  isLevelAvailable() { return true; },

  isLevelCompleted(level) {
    const { data } = this._getStore(currentLang);
    return data.completedLevels.includes(level);
  },

  completeLevel(level, score) {
    const { key, data } = this._getStore(currentLang);
    if (!data.completedLevels.includes(level)) {
      data.completedLevels.push(level);
    }
    data.scores[level] = score;
    this._save(key, data);
  },

  getScore(level) {
    const { data } = this._getStore(currentLang);
    return data.scores[level] ?? null;
  },

  getTotalProgress() {
    const { data } = this._getStore(currentLang);
    return data.completedLevels.length;
  },
};

// ------------------------------------------------------------
// 2. Router
// ------------------------------------------------------------
function navigate(path) {
  window.location.hash = '#' + path;
}

async function handleRoute() {
  const hash = window.location.hash || '#/';
  let match;

  // Language-prefixed routes: #/zh/... or #/es/...
  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar|th|vi)\/result\/(\d+)\??(.*)?$/);
  if (match) {
    currentLang = match[1];
    const level = parseInt(match[2]);
    const searchParams = new URLSearchParams(match[3] || '');
    await renderResult(level, searchParams);
    return;
  }

  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar|th|vi)\/quiz\/(\d+)$/);
  if (match) {
    currentLang = match[1];
    await renderQuiz(parseInt(match[2]));
    return;
  }

  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar|th|vi)\/lesson\/(\d+)$/);
  if (match) {
    currentLang = match[1];
    await renderLesson(parseInt(match[2]));
    return;
  }

  // Language alphabet page: #/es/alphabet, etc.
  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar|th|vi)\/alphabet$/);
  if (match) {
    currentLang = match[1];
    renderAlphabet(match[1]);
    return;
  }

  // Language levels page: #/zh/levels, #/es/levels, etc.
  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar|th|vi)\/levels$/);
  if (match) {
    currentLang = match[1];
    await renderHome();
    return;
  }

  // Language intro page: #/zh, #/es, etc.
  match = hash.match(/^#\/(zh|es|fr|ja|sw|ar|th|vi)$/);
  if (match) {
    currentLang = match[1];
    await renderLangIntro(match[1]);
    return;
  }

  // Legacy name aliases
  const legacyMap = { '#/chinese': 'zh', '#/spanish': 'es', '#/french': 'fr', '#/japanese': 'ja', '#/swahili': 'sw', '#/arabic': 'ar', '#/thai': 'th', '#/vietnamese': 'vi' };
  if (legacyMap[hash]) {
    currentLang = legacyMap[hash];
    await renderLangIntro(currentLang);
    return;
  }

  // Legacy routes without language prefix → Chinese
  match = hash.match(/^#\/result\/(\d+)\??(.*)?$/);
  if (match) {
    currentLang = 'zh';
    await renderResult(parseInt(match[1]), new URLSearchParams(match[2] || ''));
    return;
  }
  match = hash.match(/^#\/quiz\/(\d+)$/);
  if (match) {
    currentLang = 'zh';
    await renderQuiz(parseInt(match[1]));
    return;
  }
  match = hash.match(/^#\/lesson\/(\d+)$/);
  if (match) {
    currentLang = 'zh';
    await renderLesson(parseInt(match[1]));
    return;
  }

  // Landing: language selection
  currentLang = null;
  await renderLangSelect();
}

// Page transition wrapper
async function handleRouteWithTransition() {
  const app = document.getElementById('app');
  // Exit: slide left
  app.classList.add('page-exit');
  await new Promise(r => setTimeout(r, 250));
  // Route change (new content)
  await handleRoute();
  app.classList.remove('page-exit');
  // Enter: children drop in with random delay & duration
  const children = app.querySelectorAll(':scope > *, :scope > * > .intro-section, :scope > * > .alpha-section, :scope > * > .alpha-tips');
  let maxEnd = 0;
  children.forEach((el, i) => {
    const delay = i * 0.06 + Math.random() * 0.12;
    const dur = 0.8 + Math.random() * 0.4;
    el.style.animation = `dropIn ${dur}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s both`;
    maxEnd = Math.max(maxEnd, (delay + dur) * 1000);
  });
  setTimeout(() => {
    children.forEach(el => el.style.animation = '');
  }, maxEnd + 50);
}

window.addEventListener('hashchange', handleRouteWithTransition);

// ------------------------------------------------------------
// TTS — Multi-language speech (Web Speech API)
// ------------------------------------------------------------
const _ttsVoices = {};

function findVoice(langCode) {
  const voices = window.speechSynthesis.getVoices();
  const lang = LANGS[langCode];
  if (!lang) return null;
  const ttsLang = lang.ttsLang;

  // Exact match
  let voice = voices.find(v => v.lang === ttsLang);
  if (voice) return voice;
  // Prefix match
  voice = voices.find(v => v.lang.startsWith(ttsLang.split('-')[0]));
  if (voice) return voice;
  // For Chinese, also try cmn
  if (langCode === 'zh') {
    voice = voices.find(v => v.lang.startsWith('cmn'));
    if (voice) return voice;
  }
  return null;
}

function speakForeign(text, onEnd) {
  if (!('speechSynthesis' in window) || !currentLang) { if (onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();
  const lang = getLang();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang.ttsLang;
  utterance.rate = lang.ttsRate;
  if (!_ttsVoices[currentLang]) _ttsVoices[currentLang] = findVoice(currentLang);
  if (_ttsVoices[currentLang]) utterance.voice = _ttsVoices[currentLang];
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

// 자동 음성 재생 설정 (localStorage에서 복원)
let _autoTTS = false;
try { _autoTTS = localStorage.getItem('learnLangs_autoTTS') === 'true'; } catch {}
function setAutoTTS(val) { _autoTTS = val; try { localStorage.setItem('learnLangs_autoTTS', val ? 'true' : 'false'); } catch {} }

// 음성 목록이 비동기로 로드되므로 미리 요청
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    Object.keys(LANGS).forEach(code => { _ttsVoices[code] = findVoice(code); });
  };
  window.speechSynthesis.getVoices();
}

function ttsButton(text) {
  return `<button class="tts-btn" data-tts="${text.replace(/"/g, '&quot;')}" title="발음 듣기">🔊</button>`;
}

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
function renderProgressBar(current, total, label) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return `
    <div class="progress-bar-wrapper">
      ${label ? `<div class="progress-label">${label}</div>` : ''}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${pct}%"></div>
      </div>
    </div>
  `;
}

function createConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const colors = ['#FA5D29', '#222222', '#EDEDED', '#0693E3', '#7BDCB5', '#FFF083', '#BE185D', '#3B5998'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => {
    if (container.parentNode) container.parentNode.removeChild(container);
  }, 3000);
}

// ------------------------------------------------------------
// renderLangSelect() — Language selection landing page
// ------------------------------------------------------------
async function renderLangSelect() {
  hideLessonBg();
  const app = document.getElementById('app');
  const langCodes = Object.keys(LANGS);
  const metas = await Promise.all(langCodes.map(code => DataLoader.loadMeta(code)));

  const langData = langCodes.map((code, i) => {
    const lang = LANGS[code];
    const progress = Progress._getStore(code).data.completedLevels.length;
    const total = metas[i].totalLevels;
    return { code, lang, progress, total };
  });

  // Build wheel items
  let itemsHTML = langData.map((d, i) => `
    <div class="wheel-item" data-index="${i}" data-code="${d.code}">
      <span class="wheel-item-emoji">${d.lang.emoji}</span>
      <div class="wheel-item-info">
        <span class="wheel-item-name">${d.lang.name}</span>
        <span class="wheel-item-kr">${d.lang.nameKr}</span>
      </div>
      <span class="wheel-item-progress">${d.progress}/${d.total}</span>
    </div>
  `).join('');

  app.innerHTML = `
    <div class="lang-select-page">
      <h1 class="lang-select-title">어떤 언어를 배울까요?</h1>
      <p class="lang-select-subtitle">스크롤하여 언어를 선택하세요</p>
      <div class="wheel-container" id="wheelContainer">
        <div class="wheel-highlight"></div>
        <div class="wheel-mask wheel-mask-top"></div>
        <div class="wheel-mask wheel-mask-bottom"></div>
        <div class="wheel-track" id="wheelTrack">
          ${itemsHTML}
        </div>
      </div>
      <a id="wheelSelectBtn" class="wheel-select-btn" href="#/${langData[0].code}">
        ${langData[0].lang.nameKr} 시작하기
      </a>
      <div class="lang-select-tts-toggle">
        <label class="tts-switch">
          <input type="checkbox" id="langSelectAutoTTS" ${_autoTTS ? 'checked' : ''}>
          <span class="tts-slider"></span>
        </label>
        <span class="lang-select-tts-label" id="langSelectTTSLabel">자동 음성 ${_autoTTS ? 'ON' : 'OFF'}</span>
      </div>
    </div>
  `;

  // --- Wheel scroll logic ---
  const container = document.getElementById('wheelContainer');
  const track = document.getElementById('wheelTrack');
  const btn = document.getElementById('wheelSelectBtn');
  const ITEM_H = 72;
  const count = langData.length;
  let currentIndex = 0;
  let scrollY = 0;
  let velocity = 0;
  let lastY = 0;
  let lastTime = 0;
  let isDragging = false;

  function clampIndex(idx) { return Math.max(0, Math.min(count - 1, idx)); }

  function updateWheel(animate) {
    scrollY = -currentIndex * ITEM_H;
    if (animate) {
      track.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateY(${scrollY}px)`;

    track.querySelectorAll('.wheel-item').forEach((el, i) => {
      const dist = Math.abs(i - currentIndex);
      if (dist === 0) {
        el.classList.add('wheel-item-active');
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      } else if (dist === 1) {
        el.classList.remove('wheel-item-active');
        el.style.opacity = '0.45';
        el.style.transform = 'scale(0.88)';
      } else {
        el.classList.remove('wheel-item-active');
        el.style.opacity = '0.2';
        el.style.transform = 'scale(0.78)';
      }
    });

    const d = langData[currentIndex];
    btn.href = `#/${d.code}`;
    btn.textContent = `${d.lang.nameKr} 시작하기`;
  }

  function snapToNearest() {
    currentIndex = clampIndex(Math.round(-scrollY / ITEM_H));
    updateWheel(true);
  }

  // Touch — preventDefault to stop browser scroll
  container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    lastY = e.touches[0].clientY;
    lastTime = Date.now();
    velocity = 0;
    track.style.transition = 'none';
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDragging) return;
    const y = e.touches[0].clientY;
    const dy = y - lastY;
    const now = Date.now();
    velocity = dy / (now - lastTime || 1);
    lastY = y;
    lastTime = now;
    scrollY += dy;
    track.style.transform = `translateY(${scrollY}px)`;
  }, { passive: false });

  container.addEventListener('touchend', (e) => {
    e.preventDefault();
    isDragging = false;
    scrollY += velocity * 120;
    snapToNearest();
  });

  // Mouse wheel
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    currentIndex = clampIndex(currentIndex + (e.deltaY > 0 ? 1 : -1));
    updateWheel(true);
  }, { passive: false });

  // Click on item to select
  track.querySelectorAll('.wheel-item').forEach(el => {
    el.addEventListener('click', () => {
      currentIndex = parseInt(el.dataset.index);
      updateWheel(true);
    });
  });

  // Mouse drag
  let mouseDown = false;
  container.addEventListener('mousedown', (e) => {
    mouseDown = true;
    lastY = e.clientY;
    lastTime = Date.now();
    velocity = 0;
    track.style.transition = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    const dy = e.clientY - lastY;
    const now = Date.now();
    velocity = dy / (now - lastTime || 1);
    lastY = e.clientY;
    lastTime = now;
    scrollY += dy;
    track.style.transform = `translateY(${scrollY}px)`;
  });
  document.addEventListener('mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    scrollY += velocity * 120;
    snapToNearest();
  });

  // Initial render
  updateWheel(false);

  // TTS toggle
  const langTTSSwitch = document.getElementById('langSelectAutoTTS');
  if (langTTSSwitch) {
    langTTSSwitch.addEventListener('change', (e) => {
      setAutoTTS(e.target.checked);
      const label = document.getElementById('langSelectTTSLabel');
      if (label) label.textContent = '자동 음성 ' + (_autoTTS ? 'ON' : 'OFF');
    });
  }
}

// ------------------------------------------------------------
// renderAlphabet() — Alphabet / phonetic guide page
// ------------------------------------------------------------
function renderAlphabet(langCode) {
  hideLessonBg();
  const app = document.getElementById('app');
  const alpha = LANG_ALPHABETS[langCode];
  if (!alpha) { window.location.hash = `#/${langCode}`; return; }

  // Extract the first meaningful character for TTS
  function ttsChar(charStr) {
    // Remove leading dash for Thai vowels like "-า"
    const cleaned = charStr.replace(/^-/, '').trim();
    // Take first character/word (before space if present, e.g. "A a" → "A", "あ ア" → "あ")
    return cleaned.split(/\s/)[0];
  }

  const sectionsHTML = alpha.sections.map(sec => `
    <div class="alpha-section">
      <h3 class="alpha-section-name">${sec.name}</h3>
      <div class="alpha-grid">
        ${sec.chars.map(c => `
          <div class="alpha-cell" data-tts="${ttsChar(c.char).replace(/"/g, '&quot;')}">
            <span class="alpha-char">${c.char}</span>
            <span class="alpha-pron">${c.pron}</span>
            <span class="alpha-note">${c.note}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  const tipsHTML = alpha.tips.map(t => `<li>${t}</li>`).join('');

  app.innerHTML = `
    <div class="alpha-page">
      <a class="alpha-back" href="#/${langCode}">← 돌아가기</a>
      <h1 class="alpha-title">${alpha.title}</h1>
      <p class="alpha-desc">${alpha.description}</p>
      ${sectionsHTML}
      <div class="alpha-tips">
        <h3 class="alpha-section-name">발음 팁</h3>
        <ul class="intro-list">${tipsHTML}</ul>
      </div>
      <a class="alpha-back-bottom" href="#/${langCode}">← 소개 페이지로 돌아가기</a>
    </div>
  `;

  // TTS on alphabet cell click
  app.querySelectorAll('.alpha-cell[data-tts]').forEach(cell => {
    cell.addEventListener('click', () => {
      const text = cell.dataset.tts;
      if (text) speakForeign(text);
    });
  });
}

// ------------------------------------------------------------
// renderLangIntro() — Language introduction page
// ------------------------------------------------------------
async function renderLangIntro(langCode) {
  hideLessonBg();
  const app = document.getElementById('app');
  const lang = LANGS[langCode];
  const intro = LANG_INTROS[langCode];
  if (!intro) { await renderHome(); return; }

  const featuresHTML = intro.features.map(f => `<li>${f}</li>`).join('');
  const readingHTML = intro.reading.map(r => `<li>${r}</li>`).join('');
  const wordsHTML = intro.basicWords.map(w => `
    <div class="intro-word-card" data-tts="${w.word.replace(/"/g, '&quot;')}">
      <span class="intro-word-foreign">${w.word}</span>
      <span class="intro-word-pron">${w.pron}</span>
      <span class="intro-word-meaning">${w.meaning}</span>
    </div>
  `).join('');
  const sentenceHTML = intro.sentenceStructure.map(s => {
    // Extract foreign text before parenthesis for TTS
    const ttsText = s.example.replace(/\s*\(.*\)$/, '').trim();
    return `
    <div class="intro-sentence-card">
      <span class="intro-sentence-pattern">${s.pattern}</span>
      <span class="intro-sentence-example">${s.example} <span class="intro-tts-btn" data-tts="${ttsText.replace(/"/g, '&quot;')}">🔊</span></span>
      <span class="intro-sentence-meaning">${s.meaning}</span>
    </div>
  `;
  }).join('');

  app.innerHTML = `
    <div class="intro-page">
      <div class="intro-header">
        <span class="intro-emoji">${lang.emoji}</span>
        <h1 class="intro-title">${lang.name}</h1>
        <p class="intro-title-kr">${lang.nameKr}</p>
      </div>

      <div class="intro-section">
        <h2 class="intro-section-title">사용 국가</h2>
        <p class="intro-countries">${intro.countriesEmoji}</p>
        <p class="intro-countries-text">${intro.countries}</p>
        <p class="intro-speakers">${intro.speakers}</p>
      </div>

      <a class="intro-quick-btn" href="#/${langCode}/levels">바로 레벨 학습하기 →</a>

      <div class="intro-section">
        <h2 class="intro-section-title">언어의 특징</h2>
        <ul class="intro-list">${featuresHTML}</ul>
      </div>

      <div class="intro-section">
        <h2 class="intro-section-title">읽는 방법</h2>
        <ul class="intro-list">${readingHTML}</ul>
        ${LANG_ALPHABETS[langCode] ? `<a class="intro-alphabet-btn" href="#/${langCode}/alphabet">${LANG_ALPHABETS[langCode].title} 보기</a>` : ''}
      </div>

      <div class="intro-section">
        <h2 class="intro-section-title">기초 단어</h2>
        <div class="intro-words-grid">${wordsHTML}</div>
      </div>

      <div class="intro-section">
        <h2 class="intro-section-title">기초 문장 구조</h2>
        <div class="intro-sentences">${sentenceHTML}</div>
      </div>

      <a class="intro-skip-btn" href="#/${langCode}/levels">학습 시작하기</a>
    </div>
  `;

  // TTS on word card click
  app.querySelectorAll('.intro-word-card[data-tts]').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.tts) speakForeign(card.dataset.tts);
    });
  });

  // TTS on sentence speaker icon click
  app.querySelectorAll('.intro-tts-btn[data-tts]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.dataset.tts) speakForeign(btn.dataset.tts);
    });
  });
}

// ------------------------------------------------------------
// renderHome() — Level grid (language-aware)
// ------------------------------------------------------------
async function renderHome() {
  hideLessonBg();
  const app = document.getElementById('app');
  const lang = getLang();
  const completedCount = Progress.getTotalProgress();
  const meta = await DataLoader.loadMeta(currentLang);
  const TOTAL = meta.totalLevels;
  const titles = meta.titles;
  const icons = meta.icons;

  const levels = Array.from({ length: TOTAL }, (_, i) => i + 1);
  const rows = [];
  for (let i = 0; i < levels.length; i += 5) {
    rows.push(levels.slice(i, i + 5));
  }

  let gridHTML = '';
  rows.forEach((row, rowIndex) => {
    const orderedRow = rowIndex % 2 === 0 ? row : [...row].reverse();
    gridHTML += '<div class="level-row">';
    orderedRow.forEach((level) => {
      const completed = Progress.isLevelCompleted(level);
      const available = Progress.isLevelAvailable(level);
      const status = completed ? 'completed' : available ? 'available' : 'locked';
      const icon = icons[level - 1] || '📚';
      const title = titles[level] || '';
      const statusClass = { locked: 'level-locked', available: 'level-available', completed: 'level-completed' }[status];
      const clickable = status !== 'locked';

      gridHTML += `
        <div class="level-card" ${clickable ? `data-level="${level}"` : ''}>
          <div class="level-node-wrapper">
            <div class="level-node ${statusClass}">
              ${status === 'locked' ? '<span class="level-icon">🔒</span>' : `<span class="level-icon">${icon}</span>`}
            </div>
            ${status === 'completed' ? '<div class="pass-ribbon"><span>PASS</span></div>' : ''}
          </div>
          <span class="level-label">
            ${status === 'locked'
              ? `<span class="level-label-locked">Lv.${level}</span>`
              : `<span class="level-label-${status}">${title}</span>`
            }
          </span>
        </div>
      `;
    });
    gridHTML += '</div>';
  });

  app.innerHTML = `
    <div class="home-page">
      <div class="home-header">
        <h1 class="home-title">${lang.emoji} ${lang.name} — ${lang.nameKr} 레벨 선택</h1>
        <div class="home-progress">
          ${renderProgressBar(completedCount, TOTAL, `${completedCount} / ${TOTAL} 레벨 완료`)}
        </div>
      </div>
      <div class="level-grid">
        ${gridHTML}
      </div>
    </div>
  `;

  const grid = app.querySelector('.level-grid');
  if (grid) {
    grid.addEventListener('click', function (e) {
      const card = e.target.closest('[data-level]');
      if (card) {
        const level = parseInt(card.getAttribute('data-level'));
        navigate(`/${currentLang}/lesson/${level}`);
      }
    });
  }
}

// ------------------------------------------------------------
// renderLesson(level) — Conversation lesson (language-aware)
// ------------------------------------------------------------
async function renderLesson(level) {
  showLessonBg(currentLang);
  const app = document.getElementById('app');
  const lang = getLang();
  const levelData = await DataLoader.loadLevel(currentLang, level);
  const ff = lang.foreignField; // e.g. 'chinese' or 'spanish'
  const pf = lang.pronField;   // e.g. 'pinyin' or 'pronunciation'
  const titles = await DataLoader.getTitles(currentLang);

  if (!levelData) {
    app.innerHTML = `
      <div class="error-page">
        <div class="error-emoji">😥</div>
        <h2 class="error-title">레벨을 찾을 수 없습니다</h2>
        <p class="error-text">레벨 ${level} 데이터가 존재하지 않습니다.</p>
        <a href="#/${currentLang}" class="btn-game btn-primary">홈으로 돌아가기</a>
      </div>
    `;
    return;
  }

  const rawConversations = levelData.conversations || [];
  const vocabulary = levelData.vocabulary || [];
  const TOTAL_ROUNDS = 3;
  let currentRound = 1;
  let conversations = pickVariants(rawConversations);
  const totalBubbles = conversations.length;
  let visibleCount = 0;

  function pickVariants(raw) {
    return raw.map(conv => {
      if (conv.variants && conv.variants.length > 0) {
        const pick = conv.variants[Math.floor(Math.random() * conv.variants.length)];
        return { speaker: conv.speaker, ...pick };
      }
      return conv;
    });
  }

  function render() {
    const allRevealed = visibleCount >= totalBubbles;
    const isLastRound = currentRound >= TOTAL_ROUNDS;

    let bubblesHTML = '';
    conversations.slice(0, visibleCount).forEach((conv) => {
      const isA = conv.speaker === 'A';
      const foreignText = conv[ff];
      const pronText = conv[pf];
      bubblesHTML += `
        <div class="bubble-row ${isA ? 'bubble-row-left' : 'bubble-row-right'}">
          <div class="bubble ${isA ? 'bubble-a' : 'bubble-b'}">
            <div class="bubble-speaker">${isA ? '👤 A' : '👥 B'}</div>
            <p class="bubble-chinese ${conv.highlight ? 'bubble-highlight' : ''}">${foreignText} ${ttsButton(foreignText)}</p>
            <p class="bubble-pinyin">${pronText}</p>
            <p class="bubble-korean">${conv.korean}</p>
          </div>
        </div>
      `;
    });

    let vocabHTML = '';
    if (allRevealed && isLastRound && vocabulary.length > 0) {
      vocabHTML = `
        <div class="vocab-section animate-slide-up">
          <div class="vocab-header">
            <span class="vocab-icon">📝</span>
            <h2 class="vocab-title">핵심 단어</h2>
          </div>
          <div class="vocab-grid">
            ${vocabulary.map((word) => `
              <div class="vocab-card card-game">
                <p class="vocab-chinese">${word[ff]} ${ttsButton(word[ff])}</p>
                <p class="vocab-pinyin">${word[pf]}</p>
                <p class="vocab-korean">${word.korean}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    let bottomBtnHTML = '';
    if (allRevealed && isLastRound) {
      bottomBtnHTML = `
        <div class="lesson-quiz-btn animate-slide-up">
          <button class="btn-game btn-success quiz-start-btn" id="startQuizBtn">🎯 퀴즈 시작</button>
        </div>
      `;
    } else if (allRevealed && !isLastRound) {
      bottomBtnHTML = `
        <div class="lesson-quiz-btn animate-slide-up">
          <button class="btn-game btn-next-round" id="nextRoundBtn">다음 대화 시나리오로 (${currentRound} / ${TOTAL_ROUNDS})</button>
        </div>
      `;
    }

    let revealBtnHTML = '';
    if (!allRevealed) {
      revealBtnHTML = `
        <div class="lesson-reveal-btn">
          <button class="btn-game btn-primary reveal-next-btn" id="revealNextBtn">
            다음 대화 보기 (${visibleCount + 1} / ${totalBubbles})
          </button>
        </div>
      `;
    }

    let roundDots = '';
    for (let i = 1; i <= TOTAL_ROUNDS; i++) {
      const cls = i < currentRound ? 'round-dot completed' : i === currentRound ? 'round-dot active' : 'round-dot';
      roundDots += `<span class="${cls}">${i}</span>`;
    }

    const foreignTitle = levelData[lang.titleField] || '';

    app.innerHTML = `
      <div class="lesson-page">
        <div class="lesson-container">
          <a href="#/${currentLang}" class="back-link">&larr; 레벨 선택</a>

          <div class="lesson-header card-game">
            <div class="lesson-header-top">
              <span class="lesson-level-badge">${level}</span>
              <div class="lesson-header-info">
                <h1 class="lesson-title">${levelData.title}</h1>
                <p class="lesson-title-cn">${foreignTitle}</p>
              </div>
            </div>
            ${levelData.description ? `<p class="lesson-description">${levelData.description}</p>` : ''}
            <div class="lesson-header-bottom">
              <div class="round-indicator">
                <span class="round-label">대화</span>
                ${roundDots}
              </div>
              <div class="auto-tts-toggle">
                <label class="tts-switch">
                  <input type="checkbox" id="autoTTSSwitch" ${_autoTTS ? 'checked' : ''}>
                  <span class="tts-slider"></span>
                </label>
                <span class="auto-tts-label">자동 음성 ${_autoTTS ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </div>

          ${renderProgressBar(visibleCount, totalBubbles, `대화 ${currentRound}/${TOTAL_ROUNDS} — 진행: ${visibleCount} / ${totalBubbles}`)}
        </div>

        <div class="lesson-container bubbles-container">
          ${bubblesHTML}
        </div>

        <div class="lesson-container">
          ${revealBtnHTML}
          ${vocabHTML}
          ${bottomBtnHTML}
        </div>
      </div>
    `;

    const autoTTSSwitch = document.getElementById('autoTTSSwitch');
    if (autoTTSSwitch) {
      autoTTSSwitch.addEventListener('change', (e) => {
        setAutoTTS(e.target.checked);
        const label = document.querySelector('.auto-tts-label');
        if (label) label.textContent = '자동 음성 ' + (_autoTTS ? 'ON' : 'OFF');
      });
    }

    const revealBtn = document.getElementById('revealNextBtn');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        if (visibleCount < totalBubbles) {
          visibleCount++;
          render();
          setTimeout(() => {
            const bubbles = document.querySelectorAll('.bubble-row');
            if (bubbles.length > 0) {
              bubbles[bubbles.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (_autoTTS && visibleCount > 0) {
              speakForeign(conversations[visibleCount - 1][ff]);
            }
          }, 50);
        }
      });
    }

    const nextRoundBtn = document.getElementById('nextRoundBtn');
    if (nextRoundBtn) {
      nextRoundBtn.addEventListener('click', () => {
        currentRound++;
        conversations = pickVariants(rawConversations);
        visibleCount = 1;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          if (_autoTTS) speakForeign(conversations[0][ff]);
        }, 300);
      });
    }

    const quizBtn = document.getElementById('startQuizBtn');
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        navigate(`/${currentLang}/quiz/${level}`);
      });
    }
  }

  visibleCount = 1;
  render();
  if (_autoTTS) {
    const speakFirst = () => speakForeign(conversations[0][ff]);
    // 음성 목록이 이미 로드되었으면 바로 재생, 아니면 로드 후 재생
    if (window.speechSynthesis && window.speechSynthesis.getVoices().length > 0) {
      setTimeout(speakFirst, 400);
    } else if (window.speechSynthesis) {
      const onReady = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onReady);
        setTimeout(speakFirst, 200);
      };
      window.speechSynthesis.addEventListener('voiceschanged', onReady);
    }
  }
}

// ------------------------------------------------------------
// renderQuiz(level) — Quiz (language-aware)
// ------------------------------------------------------------
async function renderQuiz(level) {
  showLessonBg(currentLang);
  const app = document.getElementById('app');
  const lang = getLang();
  const levelData = await DataLoader.loadLevel(currentLang, level);
  const ff = lang.foreignField;
  const pf = lang.pronField;
  const titles = await DataLoader.getTitles(currentLang);

  if (!levelData) {
    app.innerHTML = `
      <div class="error-page">
        <div class="error-emoji">😵</div>
        <h1 class="error-title">퀴즈를 찾을 수 없습니다</h1>
        <p class="error-text">레벨 ${level} 데이터가 존재하지 않습니다.</p>
        <a href="#/${currentLang}" class="btn-game btn-primary">홈으로 돌아가기</a>
      </div>
    `;
    return;
  }

  const rawConvs = levelData.conversations || [];
  const allSentences = rawConvs.map(conv => {
    if (conv.variants && conv.variants.length > 0) {
      const pick = conv.variants[Math.floor(Math.random() * conv.variants.length)];
      return { speaker: conv.speaker, ...pick };
    }
    return conv;
  });

  // 1) 단어 시험 4문제
  const vocab = levelData.vocabulary || [];
  const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);
  const vocabQuestions = shuffledVocab.slice(0, 4).map(word => {
    const wrongAnswers = vocab
      .filter(w => w.korean !== word.korean)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.korean);
    const options = [...wrongAnswers];
    const answerIdx = Math.floor(Math.random() * 4);
    options.splice(answerIdx, 0, word.korean);
    return {
      type: 'vocab',
      question: `${word[ff]} (${word[pf]})`,
      tts: word[ff],
      options,
      answer: answerIdx
    };
  });

  // 2) 외국어→한국어 3문제
  const shuffledSentences = [...allSentences].sort(() => Math.random() - 0.5);
  const foreignToKrQuestions = shuffledSentences.slice(0, 3).map(sent => {
    const wrongAnswers = allSentences
      .filter(s => s.korean !== sent.korean)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(s => s.korean);
    const options = [...wrongAnswers];
    const answerIdx = Math.floor(Math.random() * 4);
    options.splice(answerIdx, 0, sent.korean);
    return {
      type: 'foreign_to_kr',
      question: sent[ff],
      tts: sent[ff],
      options,
      answer: answerIdx
    };
  });

  // 3) 한국어→외국어 3문제
  const remainingSentences = shuffledSentences.slice(3);
  const krToForeignPool = remainingSentences.length >= 3 ? remainingSentences : [...allSentences].sort(() => Math.random() - 0.5);
  const krToForeignQuestions = krToForeignPool.slice(0, 3).map(sent => {
    const wrongAnswers = allSentences
      .filter(s => s[ff] !== sent[ff])
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(s => s[ff]);
    const options = [...wrongAnswers];
    const answerIdx = Math.floor(Math.random() * 4);
    options.splice(answerIdx, 0, sent[ff]);
    return {
      type: 'kr_to_foreign',
      question: sent.korean,
      options,
      answer: answerIdx
    };
  });

  const questions = [...vocabQuestions, ...foreignToKrQuestions, ...krToForeignQuestions];
  const totalQuestions = questions.length;
  const OPTION_LABELS = ['A', 'B', 'C', 'D'];

  let currentQuestion = 0;
  let selected = null;
  let score = 0;

  function render() {
    const question = questions[currentQuestion];
    const typeLabel = lang.quizLabels[question.type] || question.type;

    let optionsHTML = '';
    question.options.forEach((option, index) => {
      let optClass = 'quiz-option';
      if (selected !== null) {
        if (selected === index && index === question.answer) optClass += ' quiz-correct';
        else if (selected === index) optClass += ' quiz-wrong';
        else if (index === question.answer) optClass += ' quiz-correct';
        else optClass += ' quiz-option-default';
      } else {
        optClass += ' quiz-option-default';
      }
      optionsHTML += `
        <button class="${optClass}" data-option="${index}" ${selected !== null ? 'disabled' : ''}>
          <span class="quiz-option-label">${OPTION_LABELS[index]}</span>
          <span>${option}</span>
        </button>
      `;
    });

    let feedbackHTML = '';
    if (selected !== null) {
      if (selected === question.answer) {
        feedbackHTML = '<div class="quiz-feedback animate-fade-in"><p class="quiz-feedback-correct">정답입니다! 🎉</p></div>';
      } else {
        feedbackHTML = `<div class="quiz-feedback animate-fade-in"><p class="quiz-feedback-wrong">오답! 정답은 <span class="quiz-feedback-answer">${question.options[question.answer]}</span></p></div>`;
      }
    }

    app.innerHTML = `
      <div class="quiz-page">
        <div class="quiz-header">
          <span class="quiz-level-info">레벨 ${level} — ${titles[level] || ''}</span>
          <span class="quiz-counter">${currentQuestion + 1} / ${totalQuestions}</span>
        </div>

        ${renderProgressBar(currentQuestion + 1, totalQuestions)}

        <div class="quiz-type-badge-wrapper">
          <span class="quiz-type-badge">${typeLabel}</span>
        </div>

        <div class="quiz-question">
          <h2 class="quiz-question-text">${question.question}${question.tts ? ' ' + ttsButton(question.tts) : ''}</h2>
        </div>

        <div class="quiz-options" id="quizOptions">
          ${optionsHTML}
        </div>

        ${feedbackHTML}

        <div class="quiz-score-indicator">
          현재 점수: ${score} / ${currentQuestion + (selected !== null ? 1 : 0)}
        </div>
      </div>
    `;

    if (_autoTTS && selected === null && question.tts) {
      setTimeout(() => speakForeign(question.tts), 100);
    }

    const optionsContainer = document.getElementById('quizOptions');
    if (optionsContainer) {
      optionsContainer.addEventListener('click', function (e) {
        if (selected !== null) return;
        const btn = e.target.closest('[data-option]');
        if (!btn) return;

        const index = parseInt(btn.getAttribute('data-option'));
        selected = index;
        if (index === question.answer) score++;
        const newScore = score;
        window.speechSynthesis.cancel();
        render();

        setTimeout(() => {
          if (currentQuestion + 1 < totalQuestions) {
            currentQuestion++;
            selected = null;
            render();
          } else {
            navigate(`/${currentLang}/result/${level}?score=${newScore}&total=${totalQuestions}`);
          }
        }, 1500);
      });
    }
  }

  render();
}

// ------------------------------------------------------------
// renderResult(level, searchParams) — Result (language-aware)
// ------------------------------------------------------------
async function renderResult(level, searchParams) {
  const app = document.getElementById('app');
  const lang = getLang();
  const scoreVal = parseInt(searchParams.get('score')) || 0;
  const total = parseInt(searchParams.get('total')) || 5;
  const PASS_THRESHOLD = 8;
  const TOTAL_QUESTIONS = 10;
  const passed = scoreVal >= PASS_THRESHOLD;
  const totalLevels = await DataLoader.getTotal(currentLang);
  const isLastLevel = level >= totalLevels;
  const nextLevel = level + 1;

  if (passed) {
    Progress.completeLevel(level, scoreVal);
    createConfetti();
  }

  let buttonsHTML = '';
  if (passed) {
    if (!isLastLevel) {
      buttonsHTML += `<button class="result-btn result-btn-next" data-action="next">다음 레벨 &rarr;</button>`;
    }
    buttonsHTML += `<button class="result-btn result-btn-home-pass" data-action="home">홈으로</button>`;
  } else {
    buttonsHTML += `
      <button class="result-btn result-btn-retry" data-action="retry">다시 도전</button>
      <button class="result-btn result-btn-review" data-action="review">복습하기</button>
      <button class="result-btn result-btn-home-fail" data-action="home">홈으로</button>
    `;
  }

  app.innerHTML = `
    <div class="result-page">
      <div class="result-card-wrapper">
        <div class="result-card ${passed ? 'result-card-pass' : 'result-card-fail'}">
          <div class="result-top-bar ${passed ? 'result-top-bar-pass' : 'result-top-bar-fail'}"></div>
          <div class="result-content">
            <div class="result-emoji animate-bounce">${passed ? '🎉' : '😅'}</div>
            <h1 class="result-title ${passed ? 'result-title-pass' : 'result-title-fail'}">
              ${passed ? '축하합니다!' : '아쉬워요!'}
            </h1>
            <p class="result-subtitle">
              ${passed ? `레벨 ${level}을 통과했어요!` : `레벨 ${level} 통과 기준에 못 미쳤어요.`}
            </p>
            <div class="result-score-circle ${passed ? 'result-score-pass' : 'result-score-fail'}">
              <div>
                <span class="result-score-num ${passed ? 'result-score-num-pass' : 'result-score-num-fail'}">${scoreVal}</span>
                <span class="result-score-total ${passed ? 'result-score-total-pass' : 'result-score-total-fail'}">/${total}</span>
              </div>
            </div>
            <p class="result-pass-info">통과 기준: ${PASS_THRESHOLD}/${TOTAL_QUESTIONS} (${Math.round((PASS_THRESHOLD / TOTAL_QUESTIONS) * 100)}%)</p>
            <div class="result-buttons" id="resultButtons">${buttonsHTML}</div>
          </div>
          <div class="result-corner result-corner-left">
            <div class="result-corner-shape ${passed ? 'result-corner-pass' : 'result-corner-fail-left'}"></div>
          </div>
          <div class="result-corner result-corner-right">
            <div class="result-corner-shape ${passed ? 'result-corner-pass-right' : 'result-corner-fail-right'}"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnContainer = document.getElementById('resultButtons');
  if (btnContainer) {
    btnContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      switch (btn.getAttribute('data-action')) {
        case 'next': navigate(`/${currentLang}/lesson/${nextLevel}`); break;
        case 'retry': navigate(`/${currentLang}/quiz/${level}`); break;
        case 'review': navigate(`/${currentLang}/lesson/${level}`); break;
        case 'home': navigate(`/${currentLang}`); break;
      }
    });
  }
}

// ------------------------------------------------------------
// Background image overlay
// ------------------------------------------------------------
let _bgOverlay = null;

function showLessonBg(langCode) {
  if (!_bgOverlay) {
    _bgOverlay = document.createElement('div');
    _bgOverlay.id = 'lesson-bg-overlay';
    document.body.appendChild(_bgOverlay);
  }
  const num = String(Math.floor(Math.random() * 5) + 1).padStart(3, '0');
  _bgOverlay.style.backgroundImage = `url('data/${langCode}/images/${num}.jpg')`;
  _bgOverlay.style.display = 'block';
}

function hideLessonBg() {
  if (_bgOverlay) _bgOverlay.style.display = 'none';
}

// ------------------------------------------------------------
// Init on DOMContentLoaded
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  handleRoute();

  // Global TTS click delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tts-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      speakForeign(btn.getAttribute('data-tts'));
    }
  });
});
