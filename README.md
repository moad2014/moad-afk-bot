# MOAD AFK — Discord Voice Bot

البوت فيه أمرين فقط:
- `/دخول`: يدخل الروم الصوتي اللي أنت موجود فيه.
- `/خروج`: يطلع من الروم الصوتي.

## 1) إنشاء تطبيق البوت
1. افتح https://discord.com/developers/applications
2. New Application وسمّه `MOAD AFK`.
3. من Bot اضغط Add Bot، وخذ Bot Token. لا ترسل التوكن لأي شخص ولا تضعه في الكود.
4. من General Information انسخ Application ID؛ هذا هو `CLIENT_ID`.
5. من OAuth2 > URL Generator اختر `bot` و `applications.commands`.
6. من صلاحيات البوت اختر View Channels و Connect. لا يحتاج Administrator.
7. افتح رابط الدعوة الناتج وأضف البوت إلى سيرفرك.

## 2) إعداد الاستضافة
ارفع `index.js` و `package.json` إلى Replit أو استضافة Node.js تدعم عملية مستمرة.
أضف متغيرات البيئة (Secrets):
- `DISCORD_TOKEN` = توكن البوت
- `CLIENT_ID` = Application ID
- `GUILD_ID` = (اختياري) Server ID لتسجيل الأوامر بسرعة داخل سيرفر واحد

ثم شغّل:
```bash
npm install
npm start
```

إذا تركت `GUILD_ID` فارغاً، تسجل الأوامر عالمياً وقد يتأخر ظهورها بعض الوقت.

## 3) الاسم والصورة
من Developer Portal > Bot:
- غيّر اسم البوت إلى `MOAD AFK`.
- ارفع الصورة الرمزية التي تختارها.

ملاحظة: البوت حساب مستقل، ولا يمكنه انتحال حسابك الشخصي. تقدر تختار له نفس الاسم والصورة إذا كانت لك صلاحية تعديل ملف البوت.

## ملاحظات
- لازم البوت يكون عنده Connect في الروم.
- البوت يدخل صامتاً ومكبّر الصوت عنده معطّل (self-muted و self-deafened).
- الاستمرار 24/7 يعتمد على استضافة تعمل باستمرار؛ Replit المجاني قد يوقف المشروع عند الخمول أو حسب حدود الخطة.
