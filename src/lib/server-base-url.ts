export function getServerBaseUrl() {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }
  
    return "http://localhost:3000";
  }
  
  // ⚠️ هذا الملف أصبح Legacy (غير مستخدم في Server Components)
  // الاستخدام الصحيح الآن:
  //
  // const CORE_URL = process.env.CORE_API_BASE_URL
  //
  // Server Components → تتصل مباشرة بـ Core API
  // Client → يستخدم /api