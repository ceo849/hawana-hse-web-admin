# HAWANA HSE — WEB DEPLOYMENT RUNBOOK
# دليل تشغيل ونشر الويب — Hawana HSE

Document Type: Operational Deployment Runbook
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: ACTIVE — MANDATORY BEFORE ANY WEB DEPLOYMENT
Date: 2026-05-18

────────────────────────────────────────────
1) PURPOSE | الهدف
────────────────────────────────────────────

هذا الملف هو المرجع التنفيذي الوحيد المعتمد لأي عملية Web Deployment داخل Hawana HSE.

أي مطور أو مسؤول تشغيل يجب أن يراجع هذا الملف بالكامل قبل تنفيذ أي Deployment.

الهدف من الملف:

✔ منع Environment Drift
✔ منع Runtime Drift
✔ منع تغيير Core بالخطأ
✔ منع تغيير Database بالخطأ
✔ منع Deploy غير قابل للرجوع
✔ منع اختلاف خطوات التشغيل بين المطورين
✔ تثبيت طريقة Deploy موحدة وواضحة

هذا الملف خاص فقط بـ:

Web Admin Deployment

ولا يسمح بـ:

❌ Core Deployment
❌ Prisma Migration
❌ Database Modification
❌ Billing Redesign
❌ Workflow Redesign
❌ Infrastructure Redesign

────────────────────────────────────────────
2) NON-NEGOTIABLE ARCHITECTURE RULES
────────────────────────────────────────────

المعمارية الإلزامية:

Web → API Proxy → Core

القواعد الإلزامية:

✔ استخدام /api فقط
✔ استخدام serverAppFetch فقط
✔ استخدام HttpOnly Cookies فقط
✔ Backend هو Source of Truth
✔ companyId يأتي من JWT فقط

ممنوع نهائيًا:

❌ Direct Core Access من UI
❌ استخدام :3001 داخل UI
❌ Frontend Workflow Logic
❌ Frontend Business Logic
❌ Frontend Billing Logic
❌ تمرير companyId من UI

أي مخالفة = Deployment مرفوض.

────────────────────────────────────────────
3) WEB DEPLOYMENT CLASSIFICATION
────────────────────────────────────────────

تصنيف Web Deployment:

LOW → MEDIUM RISK

مسموح:

✔ UI Fixes
✔ Responsive Fixes
✔ Mobile Fixes
✔ SSR Fixes
✔ API Proxy Fixes
✔ Layout Improvements
✔ Visibility / Role UI Fixes

ممنوع:

❌ Core API Contract Changes
❌ Prisma Changes
❌ DB Changes
❌ Billing Redesign
❌ Workflow Redesign
❌ Docker Network Changes
❌ Nginx Changes
❌ PostgreSQL Restart

إذا احتاج التغيير أي شيء من الممنوعات:

STOP.

يجب إنشاء خطة منفصلة.

────────────────────────────────────────────
4) PRE-DEPLOYMENT CHECKLIST
────────────────────────────────────────────

قبل أي Build أو Deploy:

نفّذ:

cd ~/hawana-hse-web-admin

git status

git log --oneline -5

git diff

الحالة المطلوبة:

✔ Working Tree نظيف أو يحتوي فقط على الملفات المقصودة
✔ لا يوجد Backup Files غير متجاهلة
✔ لا يوجد .env داخل Git
✔ لا يوجد Build Artifacts داخل Git
✔ لا يوجد Local Archives داخل Git

تحقق من الملفات المتجاهلة:

git status --ignored

ممنوع رفع:

.env
.env.local
.env.production
.next/
node_modules/
*.bak
*.backup
*.tar.gz
.local-archive/

────────────────────────────────────────────
5) REQUIRED LOCAL VALIDATION
────────────────────────────────────────────

قبل أي Commit أو Deploy:

نفّذ:

npm run build

يجب أن ينجح Build بالكامل.

إذا فشل:

STOP.

لا يوجد Deploy قبل إصلاح Build.

────────────────────────────────────────────
6) REQUIRED WEB AUDIT
────────────────────────────────────────────

يجب أن ينجح Web Audit قبل Push أو Deploy.

النتيجة المطلوبة:

✅ Web Audit Passed — Push Allowed

مسموح في DRIFT:

✔ Dynamic Pages
✔ Edit Pages
✔ New Pages
✔ Internal Utility Pages

غير مسموح:

❌ Direct Core Calls
❌ Frontend Business Logic
❌ companyId Manipulation
❌ Workflow Derivation داخل Frontend

────────────────────────────────────────────
7) COMMIT RULES
────────────────────────────────────────────

الـ Commit يجب أن يكون:

✔ صغير
✔ واضح
✔ محدد
✔ Single Purpose

أمثلة صحيحة:

fix(web): align admin action plan metric fetch
fix(web): improve mobile usability
docs(web): add deployment runbook

ممنوع:

❌ Large Refactor Commit
❌ Hidden Cleanup داخل Commit
❌ Mixing Code + Infra + Docs بدون سبب
❌ Uncontrolled Multi-Change Commit

────────────────────────────────────────────
8) TAGGING RULES
────────────────────────────────────────────

أي Production Deployment يجب أن يملك Tag.

صيغة الـ Tag:

web-<scope>-<date>

أمثلة:

web-admin-metric-fix-2026-05-18
web-mobile-fix-2026-05-18
web-pilot-ui-fix-2026-05-18

إنشاء الـ Tag:

git tag <tag-name>

git push origin <tag-name>

────────────────────────────────────────────
9) IMAGE TAGGING RULES
────────────────────────────────────────────

Docker Image يجب أن تكون Immutable.

الصيغة:

hawana-hse-web:<scope>-YYYY-MM-DD

مثال:

hawana-hse-web:web-admin-metric-fix-2026-05-18

ممنوع:

latest
temp
test
local
unnamed

────────────────────────────────────────────
10) WEB IMAGE BUILD
────────────────────────────────────────────

بناء الـ Web Image:

docker build \
  -t us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<IMAGE_TAG> \
  .

رفع الـ Image:

docker push us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<IMAGE_TAG>

ممنوع أثناء Web Deploy:

❌ Build Core Image
❌ Push Core Image

────────────────────────────────────────────
11) SERVER PRE-DEPLOYMENT VALIDATION
────────────────────────────────────────────

على السيرفر:

sudo docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

يجب التحقق من:

✔ hawana-web يعمل
✔ hawana-core يعمل
✔ hawana-postgres يعمل
✔ لا يوجد Restart Loop
✔ Core Image لم تتغير
✔ PostgreSQL لن يتم Restart له

تحقق من Image الحالية:

sudo docker inspect hawana-web --format '{{.Config.Image}}'

sudo docker inspect hawana-core --format '{{.Config.Image}}'

ممنوع تغيير Core أثناء Web-only Deploy.

────────────────────────────────────────────
12) WEB DEPLOYMENT EXECUTION
────────────────────────────────────────────

المسموح:

✔ Pull Web Image الجديدة
✔ Recreate hawana-web فقط

ممنوع:

❌ Recreate hawana-core
❌ Recreate hawana-postgres
❌ Delete Volumes
❌ Blind Docker Prune
❌ Random Nginx Changes
❌ Firewall Changes
❌ Runtime Hot Patching

يجب الحفاظ على:

✔ Web → API Proxy → Core
✔ Internal Docker Networking
✔ Session Persistence
✔ HttpOnly Cookie Flow

────────────────────────────────────────────
13) POST-DEPLOYMENT VALIDATION
────────────────────────────────────────────

بعد الـ Deploy:

نفّذ:

curl -i https://hawanaglobal.com/api/health

المتوقع:

HTTP/1.1 200 OK
{"status":"ok"}

ثم تحقق من:

✔ Login
✔ Dashboard
✔ Admin Panel
✔ Safety Reports
✔ Action Plans
✔ Session Persistence
✔ API Proxy Flow

في حالة Metrics Fix:

تحقق من:

✔ Dashboard Metrics
✔ Admin Metrics
✔ Action Plans Count
✔ Safety Reports Count

────────────────────────────────────────────
14) FAILURE HANDLING
────────────────────────────────────────────

إذا فشل Deploy:

ممنوع:

❌ تغيير Core
❌ Restart DB عشوائي
❌ Docker Prune عشوائي
❌ تعديل Runtime يدويًا
❌ تجاوز API Proxy
❌ Hot Fix داخل Container

المسموح:

1. جمع Evidence
2. مراجعة Logs
3. مراجعة Container Status
4. Rollback إذا لزم
5. توثيق Incident

Logs:

sudo docker logs hawana-web --tail 120

Rollback:

sudo docker rm -f hawana-web

ثم إعادة تشغيل آخر Image مستقرة.

Rollback لا يجب أن يلمس:

✔ Core
✔ DB

────────────────────────────────────────────
15) ENVIRONMENT DRIFT PREVENTION
────────────────────────────────────────────

قبل وبعد Deploy تحقق من:

✔ Web Image معروفة
✔ Core Image ثابتة
✔ DB Container ثابت
✔ /api ما زالت مستخدمة
✔ serverAppFetch ما زال مستخدمًا
✔ CORE_API_BASE_URL Server-side only
✔ لا يوجد Direct Core Exposure

ممنوع:

❌ نسخ Local Env للإنتاج عشوائيًا
❌ رفع Production Env إلى Git
❌ كشف Core داخل UI
❌ تعديل docker-compose بدون خطة Infra

────────────────────────────────────────────
16) FINAL DEPLOYMENT DECISION
────────────────────────────────────────────

يسمح بالـ Deploy فقط إذا:

✔ Build Passed
✔ Web Audit Passed
✔ Commit واضح
✔ Git Tag موجود
✔ Image Tag Immutable
✔ Core لم تتغير
✔ DB لم تتغير
✔ Billing لم تتغير
✔ Workflow لم تتغير
✔ Rollback Path موجود
✔ Validation Plan موجود

إذا فشل أي بند:

STOP.

لا يوجد Deploy.

────────────────────────────────────────────
17) FINAL GOVERNANCE STATEMENT
────────────────────────────────────────────

هذا الملف موجود للحفاظ على Hawana HSE كنظام:

Governed Multi-Tenant SaaS Platform

أي Web Deployment يجب أن يكون:

✔ Controlled
✔ Reversible
✔ Additive
✔ Architecture-Safe
✔ Production-Safe

أي Deployment يخالف هذا الملف يعتبر غير مسموح.

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────