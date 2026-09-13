// ============================================================
// Quran Group Bot — Cloudflare Worker
// ============================================================

const CONFIG = {
  // NEVER hardcode your token here. Set it as a Worker secret instead:
  //   npx wrangler secret put BOT_TOKEN
  BOT_TOKEN: '',
  GROUP_ID: '4905958372',
  ADMINS: [626810177, 1334866919],
  BALE_API: 'https://tapi.bale.ai/bot',
  TOTAL_WEEKS: 30,
  TOTAL_JUZ: 30,
};

// --- PEOPLE (index 0-29) ---
const PEOPLE = [
  'جواهریان','زهره سادات','سمیه قیمالی','فاطمه','خواجه احمدی',
  'سلیمانی','عاطفه','زهرا خانم','بغاری','سربندی',
  'محلوجی','نجفی','نسترن قربانعلی','هاجر خاتون حسینی','نسیمه',
  'فاطمه پسندیده','فائزه محمدی','مصدقی','خانم پسندیده','حاج خانم کرمی',
  'حاج خانم کرمی','راضیه کاشی','حسینی','آمنه سادات','فاطمه سربندی',
  'نینا خانم','زهرا سعدی راد','خانم چاوشانی','صباخانم','حدیث پرویزی',
];

// --- HADITHS (0‑24 → weeks 6‑30) ---
const HADITHS = [
  { a: 'مَن عَبَدَ اللَّهَ حَقَّ عِبَادَتِهِ آتاهُ اللَّهُ فَوْقَ ما يَرْجُو وَ كِفايَتِهِ', t: 'هرکس حق معبودیت خدا را به جا آورد، خداوند فوّق از حد انتظار و کفایت به او عطا کند.', s: 'بحارالانوار، ج۶۸، ص۱۸۴، ح۴۴' },
  { a: 'أَنَا قَتِيلُ العَبْرَةِ، لا يَذْكُرُنِي مُؤمِنٌ إلّا بَكَى', t: 'من کشته اشکم. هیچ مؤمنى مرا یاد نمى کند مگر آنکه گریه کند.', s: 'بحارالانوار، ج۴۴، ص۲۷۹' },
  { a: 'إنَّ حُبَّنا أَهْلَ البَيْتِ لَتَسْقِطُ الذُّنُوبَ كَما يَسْقِطُ الرِّيحُ وَرَقَ الشَّجَرَةِ', t: 'محبت ما اهل بیت سبب زشودن گناهان است، چنان که باد برگ درختان را می ریزد.', s: 'تحفة الإمام الحسین(ع)، ج۱، ص۱۵۶' },
  { a: 'لا تَتَكَلَّما فِيمَا لا يَعْنِيكَ فَإنّي أَخافُ عَلَيْكَ الوِزْرَ، وَ لا تَتَكَلَّما فِيمَا يَعْنِيكَ حَتّى تَرى لِلْكَلامِ مَوْضِعاً', t: 'هرگز سخن بیهوده مگوی؛ زیرا بیم گناه برای تو دارم، و سخن سودمند نیز هرگز مگوی، مگر اینکه آن سخن به جا باشد.', s: 'بحارالانوار، ج۱۰، ص۱۲۷، ح۷۸' },
  { a: 'سُئِلَ الإمامُ الحُسَيْنُ(ع) عَنِ الأَدَبِ، فَقالَ: الأَدَبُ أَن تَخْرُجَ مِنْ بَيْتِكَ فَلا تَلْقَى أَحَداً إلّا رَأَيْتَ لَهُ الفَضْلَ عَلَيْكَ', t: 'ادب آن است که از خانه که بیرون می روی، کسی را دیدی نکن مگر آن که او را برتر از خودت بپنداری.', s: 'موسوعة کلمات الإمام الحسین(ع)، ص۷۵۰' },
  { a: 'الإسْتِدْرَاجُ مِنَ اللَّهِ سُبْحانَهُ لِعَبْدِهِ أَن يُسْبِغَ عَلَيْهِ النِّعَمَ وَ يَسْلَبَهُ الشُّكْرَ', t: 'استدراج و مهلت دهى خداوند سبحان به بنده اش این است که به او نعمت هاى فراوان دهد و توفیق شکرگزارى را از وى بگیرد.', s: 'بحارالانوار، ج۷، ص۱۱۷، ح۷۸' },
  { a: 'شُكْرُكَ عَلَى النِّعْمَةِ السَّالِفَةِ يَقْتَضِي نِعْمَةً آتِفَةً', t: 'شکر تو بر نعمت گذشته زمینه ساز نعمت آینده است.', s: 'نزهة الناظر، ج۱، ص۸۰' },
  { a: 'إنَّ حَوائِجَ النّاسِ إِلَيْكُم مِن نِعَمِ اللَّهِ عَلَيْكُم فَلا تَمَلُّوا النِّعَمَ فَتَجُوزُوا النِّعَمَ', t: 'نیاز مردم به شما از نعمت هاى خدا بر شماست، پس از نعمت افسرده و بیزار نباشید.', s: 'بحارالانوار، ج۷۴، ص۲۰۵' },
  { a: 'خَمْسٌ مَنْ لَمْ تَكُنْ فيهِ لَمْ يَكُن فيهِ كَثِيرٌ مُسْتَمْتَعٌ: الدِّينُ وَ الْعَقْلُ وَ الأَدَبُ وَ الْحُرِيَّةُ وَ حُسْنُ الْخُلُقِ', t: 'پنج چیز است اگر در انسان نباشد، در او بهره ای از دین نخواهد بود:\n۱- عقل\n۲- دین\n۳- ادب\n۴- حیا\n۵- خوشاخلاقی.', s: 'تحفة الإمام الحسین(ع)، ج۱، ص۱۸۱' },
  { a: 'لا تَقُولُوا بِأَلْسِنَتِكُمْ ما يَنْقُصُ عَنْ قَدْرِكُمْ', t: 'چیزی را بر زبان نیاورید که از ارزش شما بکاهد.', s: 'جالئ العيون، ج۲، ص۲۰۵' },
  { a: 'لا تَقُلْ فِي أَخِيكَ الْمُؤمِنِ إِذا تَوارى عَنْكَ إلّا ما تُحِبُّ أَن يَقُولَ فِيكَ إِذا تَوارَيْتَ عَنْهُ', t: 'وقتی که برادر دینی ات از تو جدا شد، سخنی پشت سر او نگو، مگر اینکه دوست داری او در پشت سر تو آن را بگوید.', s: 'بحارالانوار، ج۷۸، ص۱۲۷' },
  { a: 'أَنَا أَعْفَى النّاسِ مَنْ عَفَى عِنْدَ قُدْرَتِهِ', t: 'با گذشت ترین مردم، کسی است که در زمان قدرت داشتن گذشت کند.', s: 'الدرة الباهرة، ص۲۴' },
  { a: 'مَن نَفَسَ عَنْ مُؤمِنٍ كُرْبَةً نَفَسَ اللَّهُ تَعالى عَنْهُ كُرْبَةً مِن كُرَبِ الدُّنْيَا وَ الآخِرَةِ', t: 'هر کس که رنج و اندوهی را از مؤمنی برطرف سازد، خداوند متعال غمهای دنیا و آخرت را از او دور می سازد.', s: 'اعلام الدین، ج۱، ص۲۹۸' },
  { a: 'أَوْصِيكُم بِتَقْوَى اللَّهِ فَإنَّ اللَّهَ قَد ضَمَنَ لِمَنِ اتَّقاهُ أَن يُحَوِّلَهُ عَمّا يَكْرَهُ إلَى ما يُحِبُّ وَ يَرْزُقَهُ مِنْ حَيْثُ لا يَحْتَسِبُ', t: 'شما را به تقواى الهى سفارش مى کنم؛ زیرا خدا ضمانت داده وضعیت کسى را که تقواى الهى پیشه سازد، از آنچه ناخوش مى دارد، به آنچه که خوشایند اوست متحوّل گردانَد.', s: 'بحارالانوار، ج۷۵، ص۱۲۰' },
  { a: 'لَوْ لا ثَلاثَةٌ ما وَضَعَ ابْنُ آدَمَ رَأْسَهُ لِشَيْء: الْفَقْرُ وَ الْمَرَضُ وَ الْمَوْتُ', t: 'اگر سه چیز نبود، آدمى سرش را در برابر هیچ چیز فرود نمى آورد؛ تنگدستى، بیمارى و مرگ.', s: 'نزهة الناظر و تنبیه الخاطر، ص۸۵، ح۴' },
  { a: 'إيّاكَ أَن تَكُونَ مِمَّن يَخافُ عَلَى العِبادِ مِن ذَنْبِهِم وَ يَأْمَنُ العَقُوبَةَ مِن ذَنْبِهِ', t: 'مبادا از کسانی باش که از گناهان سنگین خود گران مناکند و از یک فرگناه خود آسوده خاطرند.', s: 'تحف العقول، ص۲۷۳' },
  { a: 'اتَّخِذُوا عِنْدَ الْفُقَراءِ أيادِي فَإنَّ لَهُمْ دَوْلَةً يَوْمَ القِيامَةِ', t: 'با نیکی و کمک به نیازمندان نزد آنان جایگاهی برای خود بیابید که آنان روز قیامت مقام و منزلتی دارند.', s: 'کنزالعمال، ح۱۶۵۸۲' },
  { a: 'مَن طَلَبَ رِضا النّاسِ بِسَخَطِ اللَّهِ وَكَلَهُ اللَّهُ إلَى النّاسِ', t: 'هر که با خشم خدا خواهان خشنودی مردم باشد، خداوند او را به مردم واگذارد.', s: 'امالی صدوق، ص۲۶۸' },
  { a: 'إنَّ الْكَرِيمَ إِذا تَكَلَّمَ بكَلامٍ يَنْبَغِي أَن يُصَدَّقَهُ بِالْفِعْلِ', t: 'بزرگوار کسی است که گفتارش با عملش یکی باشد.', s: 'مستدرکوسائل، ج۷، ص۱۹۳، ح۶' },
  { a: 'مَن أَحْجَمَ عَنِ الرّأْيِ وَ تَحَيَّرَ فِيهِ كَانَ الرِّفْقُ مِفْتاحَهُ', t: 'کسی که در مشکلات سرگردان است و نمی داند چه کند و راه چاره ندارد، نرمی و مدارا کلید حل مشکلات اوست.', s: 'بحارالانوار، ج۷۵، ص۱۲۸' },
  { a: 'النّاسُ عَبِيدُ الدُّنْيَا وَ الدِّينُ لَعِقٌ عَلَى أَلْسِنَتِهِم يَحُوطُونَهُ ما دَرَّتْ مَعَايِشُهُم فَإذا مُحِّصُوا بِالبَلاءِ قَلَّ الدّايَانُونَ', t: 'مردم بنده دنیایند و به ظاهر، دم از دین می زنند و تا زمانی که زندگی شان تامین شود، از آن دفاع می کنند؛ اما چون در بوته آزمایش قرار گیرند، دینداران اندک اند.', s: 'تحف العقول، ص۲۴۵' },
  { a: 'الْخُلُقُ الْحَسَنُ عِبَادَةٌ وَ الصَّمْتُ زِيَادَةٌ', t: 'خوش خویی، عبادت است و سکوت نتیجه.', s: 'خیتاری العقوبة، ج۲، ص۲۶۴' },
  { a: 'أَعْجَزُ النّاسِ مَنْ عَجَزَ عَنِ الدُّعاءِ', t: 'ناتوان ترین مردم کسی است که از دعا عاجز باشد.', s: 'موسوعة کلمات الإمام الحسین(ع)، ص۷۸۱، ح۹۷۱' },
  { a: 'أَمّا إِنْ جَرى بَيْنَهُمَا كَلامٌ فَطَلَبَ أَحَدُهُما رِضا الآخَرِ كانَ سابِقَهُ إلى الجَنَّةِ', t: 'اگر در بین دو نفر اختلافی پیش شود و کسی از آن دو نفر از دیگری طلب رضایت نماید، سبقت گیرنده اهل بهشت خواهد بود.', s: 'محجة البیضاء، ج۴، ص۲۲۸' },
  { a: 'رُبَّ ذَنْبٍ أَحْسَنُ مِنَ الإعْتِذارِ مِنْهُ', t: 'چه بسا گناهى که عذرش بدتر از خود آن گناه است.', s: 'بحارالانوار، ج۵۷، ص۱۲۸، ح۱۱' },
];

// --- HELPERS ---
const P = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
function toFA(n) { return String(n).replace(/\d/g, d => P[+d]); }

const MF = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const ML = [31,31,31,31,31,31,30,30,30,30,30,29];

function gregToSH(date) {
  const d = Math.floor((date.getTime() - Date.UTC(2026,2,21)) / 864e5) + 1;
  if (d < 0) return null;
  let r = d, m = 0;
  while (m < 12) { if (r < ML[m]) return { mo: m+1, dy: r+1 }; r -= ML[m]; m++; }
  return null;
}

function dateRange(wn) {
  // Saturday to Friday
  const sat = new Date(Date.UTC(2026,5,12) + (wn-1)*7*864e5);
  const fri = new Date(sat.getTime() + 6*864e5);
  const ss = gregToSH(sat), sf = gregToSH(fri);
  if (!ss||!sf) return 'تاریخ نامشخص';
  return ss.mo===sf.mo
    ? `${toFA(ss.dy)} تا ${toFA(sf.dy)} ${MF[ss.mo-1]}`
    : `${toFA(ss.dy)} ${MF[ss.mo-1]} تا ${toFA(sf.dy)} ${MF[sf.mo-1]}`;
}

function juzList(wn) {
  return PEOPLE.map((nm,i) => `جزء ${toFA(((i+wn-1)%CONFIG.TOTAL_JUZ)+1)}. ${nm}`).join('\n');
}

function stateLabel(st) {
  const m = { idle: '🟢 ربات آماده است', waiting_for_image: '📸 منتظر دریافت عکس', waiting_for_approval: '⏳ منتظر تایید شما', message_ready: '✅ پیام آماده ارسال' };
  return m[st] || st;
}

// --- MESSAGE BUILDERS ---
function buildMsg(wn, hi) {
  const h = HADITHS[hi % HADITHS.length];
  return `💠 قال الإمام الحسین علیه السلام

${h.a}

💎 امام حسین (ع) فرمود: «${h.t}»

📚 ( ${h.s} )

🏴 السلام علیک یا اباعبدالله 🏴

📌 نوزدهمین #دوره ختم قرآن سالانه در طول سال ۱۴۰۵
جزء خوانی هفتگی
شروع از هفته اول محرم

💌 تلاوت قرآن مون را به نیابت از سیدالشهدا و اصحابشان (علیهم السلام) ؛ به نیت سلامتی و تعجیل در فرج امام عصر و برآورده شدن حاجات یکدیگر می خوانیم و ثوابش را هدیه می کنیم به امام زمان مون، حجه بن الحسن العسکری (عجل الله تعالی فرجه الشریف)

💥 لطفا عزیزانی که جزء ۱ و ۳۰ را قرائت می کنند ، دعای شروع و ختم قرآن را هم بخوانند.

هفته ${toFA(wn)} ( ${dateRange(wn)} )

سهم تلاوتی ⬅️ خانمها
${juzList(wn)}`;
}

function buildReminder(wn, hi) {
  const h = HADITHS[hi % HADITHS.length];
  return `🔔 یادآوری - هفته ${toFA(wn)}
تاریخ: ${dateRange(wn)}

💠 قال الإمام الحسین علیه السلام

${h.a}

💎 امام حسین (ع) فرمود: «${h.t}»

📚 ( ${h.s} )

لطفا عکس محتوای این هفته را ارسال کنید.`;
}

// --- BALE API ---
async function api(env, method, body) {
  const token = env.BOT_TOKEN || CONFIG.BOT_TOKEN;
  const r = await fetch(`${CONFIG.BALE_API}${token}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  return r.json();
}

async function sendMsg(env, cid, text, markup) {
  const b = { chat_id: cid, text };
  if (markup) b.reply_markup = markup;
  return api(env, 'sendMessage', b);
}

async function sendPhoto(env, cid, photo, caption) {
  return api(env, 'sendPhoto', { chat_id: cid, photo, caption });
}

async function answerCb(env, id, text) {
  return api(env, 'answerCallbackQuery', { callback_query_id: id, text, show_alert: true });
}

// --- STATE ---
async function getState(kv) {
  const d = await kv.get('bot_state', 'json');
  if (!d) {
    const w1 = new Date(Date.UTC(2026,5,12));
    const cw = Math.min(Math.max(Math.floor((Date.now() - w1.getTime()) / 864e5 / 7) + 1, 1), CONFIG.TOTAL_WEEKS);
    return { cw, hi: Math.max(0, cw-6), st: 'idle', img: null, msg: null, pv: null };
  }
  return {
    cw: d.cw || d.currentWeek || 6,
    hi: d.hi || d.hadithIndex || 0,
    st: d.st || d.state || 'idle',
    img: d.img || d.imageFileId || null,
    msg: d.msg || d.messageText || null,
    pv: d.pv || d.previewMessageId || null,
  };
}
async function saveState(kv, s) { await kv.put('bot_state', JSON.stringify(s)); }

// --- WEBHOOK HANDLER (real‑time) ---
async function handleUpdate(update, env) {
  const kv = env.KV;
  if (update.callback_query) {
    const cq = update.callback_query;
    const uid = cq.from?.id;
    if (!uid || !CONFIG.ADMINS.includes(uid)) return;
    const s = await getState(kv);
    if (s.st === 'waiting_for_approval') {
      if (cq.data === 'approve') {
        s.st = 'message_ready'; await saveState(kv, s);
        await answerCb(env, cq.id, '✅ تایید شد');
        await sendMsg(env, uid, `✅ پیام هفته ${toFA(s.cw)} تایید شد.\nشنبه ساعت ۸ صبح در گروه ارسال خواهد شد.`);
      } else if (cq.data === 'reject') {
        s.st = 'waiting_for_image'; s.img = null; s.pv = null;
        await saveState(kv, s);
        await answerCb(env, cq.id, '❌ رد شد');
        await sendMsg(env, uid, '❌ لطفا عکس جدید ارسال کنید.');
      }
    }
    return;
  }

  if (!update.message) return;
  const msg = update.message;
  const uid = msg.from?.id;
  if (msg.chat?.type !== 'private') return;
  if (!uid || !CONFIG.ADMINS.includes(uid)) return;

  const s = await getState(kv);
  const text = msg.text || '';

  if (msg.photo && s.st === 'waiting_for_image') {
    s.img = msg.photo[msg.photo.length - 1].file_id;
    s.st = 'waiting_for_approval';
    await saveState(kv, s);
    const pv = `📋 پیش‌نمایش پیام هفته ${toFA(s.cw)}:\n\n${s.msg}`;
    if (pv.length > 4000) {
      await sendPhoto(env, uid, s.img, `📸 عکس هفته ${toFA(s.cw)}`);
      await sendMsg(env, uid, s.msg.substring(0, 3900));
    } else if (s.msg.length > 1000) {
      await sendPhoto(env, uid, s.img, `📸 عکس هفته ${toFA(s.cw)}`);
      await sendMsg(env, uid, pv.length > 4000 ? s.msg.substring(0, 3900) : pv);
    } else {
      await sendPhoto(env, uid, s.img, pv);
    }
    const kb = { inline_keyboard: [[{ text: '✅ تایید', callback_data: 'approve' }, { text: '❌ رد', callback_data: 'reject' }]] };
    await sendMsg(env, uid, 'آیا پیام تایید می‌شود؟', kb);
    return;
  }

  if (text === '/start') await sendMsg(env, uid, '🤖 ربات ختم قرآن\n\n🔹 روند کار:\n۱. جمعه شب ساعت ۹ → یادآوری + حدیث هفته\n۲. عکس محتوا رو بفرستید\n۳. پیش‌نمایش رو تایید کنید\n۴. شنبه ساعت ۸ صبح → ارسال در گروه\n\n🔹 دستورات:\n/status - وضعیت فعلی\n/list - لیست جزءخوانی هفته\n/preview - پیش‌نمایش پیام\n/setweek <عدد> - تنظیم دستی هفته\n/skip - رد کردن هفته\n/reset - بازنشانی');
  else if (text === '/status') {
    const dr = dateRange(s.cw);
    const stText = { idle: '🟢 آماده دریافت دستور', waiting_for_image: '📸 منتظر دریافت عکس', waiting_for_approval: '⏳ منتظر تایید شما', message_ready: '✅ پیام تایید شده - منتظر ارسال شنبه' };
    await sendMsg(env, uid, `📊 وضعیت ربات ختم قرآن\n\nهفته ${toFA(s.cw)} از ${toFA(CONFIG.TOTAL_WEEKS)}\nتاریخ: ${dr}\nحدیث: ${toFA((s.hi % HADITHS.length)+1)} از ${toFA(HADITHS.length)}\n\nوضعیت: ${stText[s.st] || s.st}`);
  }
  else if (text === '/list') await sendMsg(env, uid, `👥 لیست جزءخوانی هفته ${toFA(s.cw)}\nتاریخ: ${dateRange(s.cw)}\n\nسهم تلاوتی ⬅️ خانمها\n\n${juzList(s.cw)}`);
  else if (text === '/preview') {
    const previewMsg = s.msg || buildMsg(s.cw, s.hi);
    await sendMsg(env, uid, `📋 پیش‌نمایش پیام هفته ${toFA(s.cw)}:\n\n${previewMsg}`);
  }
  else if (text.startsWith('/setweek ')) {
    const n = parseInt(text.split(' ')[1]);
    if (n >= 1 && n <= CONFIG.TOTAL_WEEKS) { s.cw = n; s.hi = Math.max(0,n-6); s.st = 'idle'; s.img=null; s.msg=null; s.pv=null; await saveState(kv,s); await sendMsg(env,uid,`✅ هفته ${toFA(n)} تنظیم شد.`); }
    else await sendMsg(env, uid, `❌ عدد بین ۱ تا ${toFA(CONFIG.TOTAL_WEEKS)}`);
  }
  else if (text === '/skip') { s.st='idle'; s.cw++; s.hi++; s.img=null; s.msg=null; s.pv=null; await saveState(kv,s); await sendMsg(env,uid,`⏭️ رد شد. هفته بعد: ${toFA(s.cw)}`); }
  else if (text === '/reset') {
    const w1 = new Date(Date.UTC(2026,5,12));
    const cw = Math.min(Math.max(Math.floor((Date.now() - w1.getTime()) / 864e5 / 7) + 1, 1), CONFIG.TOTAL_WEEKS);
    const hi = Math.max(0, cw-6);
    s.cw = cw; s.hi = hi; s.st='idle'; s.img=null; s.msg=null; s.pv=null;
    await saveState(kv, s);
    await sendMsg(env, uid, `✅ بازنشانی شد.\nهفته فعلی: ${toFA(cw)} (${dateRange(cw)})`);
  }
}

// --- CRON HANDLER (exact times only) ---
async function handleCron(env) {
  const kv = env.KV;
  const s = await getState(kv);
  const flags = await kv.get('cron_flags', 'json') || {};

  // Iran time
  const ir = new Date(Date.now() + 3.5*36e5);
  const h = ir.getUTCHours();
  const d = ir.getUTCDay(); // 0=Sun … 5=Fri … 6=Sat

  // Friday 21:00–23:59 → send reminder (once per week, flag-protected)
  if (d === 5 && h >= 21 && s.st === 'idle' && s.cw <= CONFIG.TOTAL_WEEKS) {
    const fk = `reminded_w${s.cw}`;
    if (!flags[fk]) {
      s.msg = buildMsg(s.cw, s.hi);
      s.st = 'waiting_for_image';
      await saveState(kv, s);
      let sentAll = true;
      for (const a of CONFIG.ADMINS) {
        const r = await sendMsg(env, a, buildReminder(s.cw, s.hi));
        if (!r.ok) sentAll = false;
      }
      if (sentAll) {
        flags[fk] = 1; await kv.put('cron_flags', JSON.stringify(flags));
      }
    }
    return;
  }

  // Saturday 08:00–23:59 → post to group (once per week, flag-protected)
  if (d === 6 && h >= 8 && s.st === 'message_ready') {
    const pk = `posted_w${s.cw}`;
    if (!flags[pk]) {
      let ok = false;
      if (s.img && s.msg && s.msg.length > 1000) {
        const r1 = await sendPhoto(env, CONFIG.GROUP_ID, s.img, `📸 هفته ${toFA(s.cw)}`);
        const r2 = await sendMsg(env, CONFIG.GROUP_ID, s.msg);
        ok = r1.ok && r2.ok;
      }
      else if (s.img) { const r = await sendPhoto(env, CONFIG.GROUP_ID, s.img, s.msg); ok = r.ok; }
      else { const r = await sendMsg(env, CONFIG.GROUP_ID, s.msg); ok = r.ok; }
      if (ok) {
        s.st='idle'; s.cw++; s.hi++; s.img=null; s.msg=null; s.pv=null;
        await saveState(kv, s);
        flags[pk] = 1; await kv.put('cron_flags', JSON.stringify(flags));
      }
    }
    return;
  }

  // Saturday 10:00–23:59 warn admin if not ready
  if (d === 6 && h >= 10 && s.st !== 'message_ready' && s.st !== 'idle') {
    const wk = `warned_w${s.cw}`;
    if (!flags[wk]) {
      for (const a of CONFIG.ADMINS) await sendMsg(env, a, `⚠️ پیام هفته ${toFA(s.cw)} هنوز آماده نیست!\n${stateLabel(s.st)}`);
      flags[wk] = 1; await kv.put('cron_flags', JSON.stringify(flags));
    }
  }
}

// --- WEBHOOK PARSE ---
function parseUpdate(body) {
  if (!body) return null;
  if (typeof body === 'object') {
    if (body.update_id !== undefined) return body;
    if (body.update) { try { return JSON.parse(body.update); } catch(e) {} }
    return null;
  }
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch(e) {}
  }
  return null;
}

// --- ENTRY ---
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/webhook' && request.method === 'POST') {
      let body;
      try {
        const ct = request.headers.get('content-type') || '';
        if (ct.includes('application/json')) { body = await request.json(); }
        else {
          const txt = await request.text();
          try { body = JSON.parse(txt); } catch(e) {
            const p = new URLSearchParams(txt);
            if (p.has('update')) { try { body = JSON.parse(p.get('update')); } catch(e2) {} }
          }
        }
      } catch(e) {}

      const update = parseUpdate(body);
      if (update) {
        try { await handleUpdate(update, env); } catch(e) { console.error('Update error:', e); }
      }
      return new Response('OK');
    }

    if (url.pathname === '/') return new Response('Quran Group Bot 🤲', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

    if (url.pathname === '/setup') {
      const r = await api(env, 'setWebhook', { url: `${url.origin}/webhook` });
      return new Response(JSON.stringify(r, null, 2), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/status') return new Response(JSON.stringify(await getState(env.KV), null, 2), { headers: { 'Content-Type': 'application/json' } });

    if (url.pathname === '/api/flags') {
      const f = await env.KV.get('cron_flags', 'json') || {};
      return new Response(JSON.stringify(f, null, 2), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Not Found', { status: 404 });
  },

  async scheduled(event, env, ctx) {
    try { await handleCron(env); } catch(e) { console.error('Cron error:', e); }
  },
};
