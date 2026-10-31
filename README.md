# Afeka Racing Team – אתר אורנע 2

אתר תדמית סטטי: Vite + React + TypeScript, ותלת-ממד עם React Three Fiber.

## הרצה מקומית

```bash
npm install
npm run dev
```

האתר נפתח בכתובת http://localhost:5173.

## עריכת תוכן

כל הטקסטים נמצאים בתיקייה `src/data/`, ואפשר לערוך אותם בלי לגעת בקוד:

| קובץ | מה יש בו |
|---|---|
| `site.ts` | שם, לוגואים, פרטי קשר, ניווט |
| `home.ts` | דף הבית |
| `about.ts` | מי אנחנו, ציר הזמן |
| `teams.ts` | חמשת הצוותים |
| `race.ts` | מספרי התחרות |
| `projects.ts` | כרטיסי הפרויקטים |
| `belgium.ts` | פרקי הסיפור של בלגיה, ציטוטים ותמונות |
| `sponsors.ts` | ספונסרים |
| `parts.ts` | רכיבי הצפייה התלת-ממדית: טקסטים, עובדות, קבצי מודל |

תוכן חסר מסומן `[להשלים]`.

## תמונות

1. מעתיקים את התמונות שנבחרו לתיקייה `images-source/<קבוצה>/<אירוע>/` (התיקייה לא נכנסת ל-Git).
2. מריצים `npm run images`.
3. נוצרים קבצי WebP בשני גדלים ב-`public/images/`, בלי נתוני מיקום (GPS), עם `manifest.json`.
4. בקבצי הנתונים מפנים לתמונה בלי סיומת, למשל `'story/race-rain'`.

קבצי HEIC (אייפון) ו-RAW צריך להמיר קודם ל-JPG.

לוגואים של ספונסרים: `node scripts/prepare-logos.mjs "<תיקיית לוגו חברות>"`.

## מודלים תלת-ממדיים

המודל הנוכחי בעמוד "פרקו את אורנע" זמני, מצורות פשוטות. הוראות להחלפה במודלים מ-SolidWorks: [docs/models.md](docs/models.md).

## הטופס

הטופס בעמוד "הצטרפו אלינו" שולח את התשובות ישירות ל-Google Form של המועדון, כך שהן מגיעות לגיליון הקיים. המיפוי נמצא ב-`src/data/join.ts`.

- אם משנים שאלה ב-Google Form, צריך לעדכן שם את מספר ה-entry ואת האפשרויות.
- ב-Google Form אין כרגע שאלת מייל, ולכן המייל נשלח בתחילת התשובה "ספרו לנו על עצמכם". אחרי שמוסיפים שאלת מייל לטופס, כותבים את ה-entry שלה בשדה `email`.

## גלריה

1. מעתיקים תמונות ל-`images-source/gallery/<שם-אירוע>/` (שם התיקייה באנגלית, למשל `7-ecomotion`).
2. מריצים `npm run images`.
3. מוסיפים את האירוע לרשימה `galleryEvents` ב-`src/data/gallery.ts`.

תיוג לפי צוות ותיאורים לתמונות: באותו קובץ, ב-`teamTags` וב-`captions`.

## פריסה

### Vercel (מומלץ)

1. נכנסים ל-[vercel.com](https://vercel.com) ← **Sign Up** ← **Continue with GitHub**, עם החשבון AfekaRacing.
2. **Add New → Project** ← בוחרים את `afeka-racing-site` ← **Import**.
3. לא משנים כלום (Vercel מזהה Vite לבד) ← **Deploy**.
4. אחרי דקה האתר באוויר בכתובת כמו `afeka-racing-site.vercel.app`.

מעכשיו כל `git push` ל-`main` מעדכן את האתר אוטומטית.

**דומיין משלכם:** בפרויקט ב-Vercel ← **Settings → Domains** ← מוסיפים את הדומיין, ומעדכנים אצל רשם הדומיין את רשומות ה-DNS שמופיעות שם.

### GitHub Pages (חלופה)

1. במאגר ב-GitHub: **Settings → Pages → Source: GitHub Actions**.
2. **Actions → Deploy to GitHub Pages → Run workflow**.
3. האתר יעלה לכתובת `https://afekaracing.github.io/afeka-racing-site/`.

ההגדרות בקובץ `.github/workflows/pages.yml`.
