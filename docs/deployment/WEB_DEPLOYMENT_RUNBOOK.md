# HAWANA HSE — WEB DEPLOYMENT RUNBOOK
# دليل تشغيل ونشر الويب — Hawana HSE

Document Type: Operational Deployment Runbook
Repository: hawana-hse-web-admin
Layer: Web Admin
Architecture: Web → API Proxy → Core → PostgreSQL
Mode: Stability First / Additive Only / No Breaking Changes
Status: ACTIVE — MANDATORY BEFORE ANY WEB DEPLOYMENT
Date: 2026-05-19

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
✔ منع مشكلة اختلاف Architecture بين Mac Apple Silicon و Linux Server

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
✔ Read-only Dashboard / Admin metric alignment

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

ملاحظة:

أي Backup file يتم إنشاؤه مؤقتًا يجب نقله إلى .local-archive أو التأكد أنه ignored قبل commit.

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
fix(web): use dashboard metrics in admin panel
fix(web): improve mobile usability
docs(web): add deployment runbook
docs(web): update deployment runbook with amd64 build rule

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
web-admin-dashboard-metrics-2026-05-19
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

hawana-hse-web:web-admin-dashboard-metrics-2026-05-19

ممنوع:

latest
temp
test
local
unnamed

ممنوع إعادة استخدام نفس Image Tag بعد اكتشاف فشل وظيفي أو platform mismatch.

إذا تم اكتشاف مشكلة في Image منشورة:

✔ أنشئ commit جديد إذا لزم
✔ أنشئ Git tag جديد
✔ أنشئ Docker image tag جديد
✔ لا تعدّل نفس tag القديم

────────────────────────────────────────────
10) WEB IMAGE BUILD
────────────────────────────────────────────

Production server يعمل على Linux AMD64.

لذلك أي Image خاصة بالإنتاج يجب أن تُبنى صراحةً كـ:

linux/amd64

خصوصًا عند استخدام Mac Apple Silicon.

الطريقة المعتمدة للإنتاج:

docker buildx build \
  --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<IMAGE_TAG> \
  --push \
  .

هذه الطريقة تقوم بـ:

✔ Build
✔ تحديد platform الصحيح
✔ Push إلى Artifact Registry
✔ منع مشكلة no matching manifest for linux/amd64

ممنوع استخدام هذا للإنتاج على Mac Apple Silicon:

docker build \
  -t us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<IMAGE_TAG> \
  .

إلا إذا تم إثبات أن الناتج linux/amd64.

ممنوع أثناء Web Deploy:

❌ Build Core Image
❌ Push Core Image
❌ استخدام latest
❌ استخدام Image بدون platform واضح
❌ Build على السيرفر بدون خطة منفصلة

مشكلة مثبتة عمليًا:

إذا تم بناء Image على Mac Apple Silicon بدون --platform linux/amd64 قد يفشل السيرفر عند pull بالخطأ:

no matching manifest for linux/amd64 in the manifest list entries

في هذه الحالة:

STOP.

لا تعمل restart.

أعد بناء Image من الماك باستخدام:

docker buildx build --platform linux/amd64 --push

────────────────────────────────────────────
11) SERVER PRE-DEPLOYMENT VALIDATION
────────────────────────────────────────────

على السيرفر، Docker commands قد تحتاج sudo.

السبب:

Production operator account قد لا يكون ضمن docker group.

لذلك أوامر السيرفر المعتمدة تستخدم sudo.

نفّذ:

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

يجب حفظ baseline قبل أي replacement:

echo "===== CURRENT RUNTIME BASELINE BEFORE WEB REPLACE ====="

sudo docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

echo
echo "===== CURRENT WEB IMAGE ====="
sudo docker inspect hawana-web --format='{{.Config.Image}}'

echo
echo "===== CURRENT CORE IMAGE ====="
sudo docker inspect hawana-core --format='{{.Config.Image}}'

تحقق من إعدادات hawana-web الحالية قبل replacement:

echo "===== WEB RUNTIME CONFIG ====="

sudo docker inspect hawana-web --format='name={{.Name}}'
sudo docker inspect hawana-web --format='restart={{.HostConfig.RestartPolicy.Name}}'
sudo docker inspect hawana-web --format='ports={{json .HostConfig.PortBindings}}'
sudo docker inspect hawana-web --format='networks={{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
sudo docker inspect hawana-web --format='env={{range .Config.Env}}{{println .}}{{end}}'

ممنوع تغيير Core أثناء Web-only Deploy.

────────────────────────────────────────────
12) WEB DEPLOYMENT EXECUTION
────────────────────────────────────────────

المسموح:

✔ Pull Web Image الجديدة
✔ Recreate hawana-web فقط
✔ استخدام نفس network
✔ استخدام نفس port mapping
✔ استخدام نفس env المعتمدة

Pull:

sudo docker pull \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<IMAGE_TAG>

إذا فشل Pull بسبب platform mismatch:

STOP.

لا تكمل.

ارجع إلى Section 10 وأعد بناء Image باستخدام linux/amd64.

استبدال Web فقط:

sudo docker rm -f hawana-web

sudo docker run -d \
  --name hawana-web \
  --restart unless-stopped \
  --network hawanaglobal_default \
  -p 3005:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_BASE_URL=/api \
  -e NEXT_PUBLIC_API_PREFIX=/v1 \
  -e CORE_API_BASE_URL=http://hawana-core:3001 \
  -e DOCKER_ENV=true \
  us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<IMAGE_TAG>

ممنوع:

❌ Recreate hawana-core
❌ Recreate hawana-postgres
❌ Delete Volumes
❌ Blind Docker Prune
❌ Random Nginx Changes
❌ Firewall Changes
❌ Runtime Hot Patching
❌ تغيير docker network
❌ تغيير ports بدون خطة Infra

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

echo "===== POST DEPLOY VERIFY ====="

sudo docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

echo
echo "===== ACTIVE WEB IMAGE ====="
sudo docker inspect hawana-web --format='{{.Config.Image}}'

echo
echo "===== WEB LOGS ====="
sudo docker logs hawana-web --tail 80

echo
echo "===== HEALTH ====="
curl -s https://hawanaglobal.com/api/health

المتوقع:

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

مثال قبول:

Dashboard:
- Reports = 3
- Action Plans = 2

Admin Panel:
- Reports = 3
- Plans = 2

إذا Dashboard صحيح وAdmin مختلف:

STOP.

المشكلة غالبًا في Admin metric source أو response parsing.

لا تعالجها من Docker أو Nginx.

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
❌ إعادة استخدام Image Tag فشل وظيفيًا

المسموح:

1. جمع Evidence
2. مراجعة Logs
3. مراجعة Container Status
4. مراجعة Image platform
5. Rollback إذا لزم
6. توثيق Incident

Logs:

sudo docker logs hawana-web --tail 120

Rollback:

sudo docker rm -f hawana-web

ثم إعادة تشغيل آخر Image مستقرة بنفس runtime config.

Rollback لا يجب أن يلمس:

✔ Core
✔ DB
✔ Billing
✔ Workflow

آخر Image مستقرة يجب أن تكون موثقة قبل replacement من Section 11.

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
✔ Docker network ثابت
✔ Port mapping ثابت
✔ Image platform صحيح linux/amd64

ممنوع:

❌ نسخ Local Env للإنتاج عشوائيًا
❌ رفع Production Env إلى Git
❌ كشف Core داخل UI
❌ تعديل docker-compose بدون خطة Infra
❌ تغيير Runtime network بدون خطة منفصلة
❌ تغيير Core أثناء Web deployment

────────────────────────────────────────────
16) FINAL DEPLOYMENT DECISION
────────────────────────────────────────────

يسمح بالـ Deploy فقط إذا:

✔ Build Passed
✔ Web Audit Passed
✔ Commit واضح
✔ Git Tag موجود
✔ Image Tag Immutable
✔ Production Image مبنية linux/amd64
✔ Image Push ناجح
✔ Server Pull ناجح
✔ Core لم تتغير
✔ DB لم تتغير
✔ Billing لم تتغير
✔ Workflow لم تتغير
✔ Rollback Path موجود
✔ Validation Plan موجود
✔ sudo requirement معروف على السيرفر

إذا فشل أي بند:

STOP.

لا يوجد Deploy.

────────────────────────────────────────────
17) FIELD-TESTED DEPLOYMENT NOTES
────────────────────────────────────────────

تم إثبات النقاط التالية عمليًا أثناء Production Web Deployment:

1. Google Artifact Registry auth قد يحتاج:

gcloud auth login

ثم:

gcloud auth configure-docker us-central1-docker.pkg.dev

2. على Production Server، Docker commands قد تحتاج sudo.

3. Mac Apple Silicon قد ينتج image غير مناسب للسيرفر إذا لم يتم تحديد:

--platform linux/amd64

4. Dashboard metrics قد تكون source of truth أفضل من تجميع أرقام Admin من endpoints منفصلة، إذا كانت Admin Panel read-only overview.

5. إذا نجح Health endpoint فهذا لا يكفي وحده لإثبات نجاح feature fix. يجب عمل Functional Verification من التطبيق.

────────────────────────────────────────────
18) FINAL GOVERNANCE STATEMENT
────────────────────────────────────────────

هذا الملف موجود للحفاظ على Hawana HSE كنظام:

Governed Multi-Tenant SaaS Platform

أي Web Deployment يجب أن يكون:

✔ Controlled
✔ Reversible
✔ Additive
✔ Architecture-Safe
✔ Production-Safe
✔ Field-Tested

أي Deployment يخالف هذا الملف يعتبر غير مسموح.

────────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────────