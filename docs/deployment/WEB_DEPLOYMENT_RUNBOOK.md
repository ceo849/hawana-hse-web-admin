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
sudo docker inspect hawana-web \
  --format '{{range .Config.Env}}{{println .}}{{end}}' \
  | sed 's/=.*$/=<hidden>/'

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
────────────────────────────────────────────
19) MANDATORY WEB DEPLOYMENT GOVERNANCE ADDENDUM
────────────────────────────────────────────

This addendum upgrades the Web Deployment Runbook from an operational deployment guide into a mandatory governance control system.

This addendum is binding for all future Web production deployment work.

This addendum does not replace previous sections.

It governs how the previous sections must be applied.

────────────────────────────────────────────
19.1) Runbook Authority
────────────────────────────────────────────

This runbook is the official Web deployment authority.

Any future Web deployment must comply with:

- Architecture rules
- API Proxy rules
- serverAppFetch rules
- HttpOnly cookie rules
- Image platform rules
- Server pull rules
- Rollback rules
- Evidence rules
- Final closure rules
- Current state handoff rules

If any future instruction conflicts with this runbook:

STOP.

Create a controlled exception plan.

────────────────────────────────────────────
19.2) Mandatory Architecture Preservation
────────────────────────────────────────────

The mandatory architecture remains:

Web → API Proxy → Core → PostgreSQL

Web deployment must preserve:

- UI does not call Core directly.
- UI does not use :3001.
- Web business routes use /api only.
- Server-side Web flows use serverAppFetch only.
- CORE_API_BASE_URL remains server-side only.
- NEXT_PUBLIC_API_BASE_URL remains /api.
- HttpOnly cookie flow remains active.
- Backend remains source of truth.
- companyId remains JWT/backend-owned.
- Billing remains backend-controlled.
- Workflow remains backend-controlled.

Forbidden:

- Direct UI → Core calls
- Frontend Workflow derivation
- Frontend Billing derivation
- Passing companyId from UI as authority
- Public Core exposure
- Runtime patching inside container
- Changing Core during Web deployment
- Changing DB during Web deployment
- Changing Nginx during Web deployment
- Changing Docker network during Web deployment

If any forbidden item is required:

STOP.

Create a separate controlled plan.

────────────────────────────────────────────
19.3) Documentation Intensity Rule
────────────────────────────────────────────

Not every Web step requires the full deployment documentation chain.

Documentation intensity must be based on risk.

High-risk Web actions require full governance chain.

Examples:

- Production Web deployment
- Web container replacement
- Production server image pull
- Docker cleanup or prune
- Runtime environment change
- Nginx change
- Docker network change
- Rollback
- Any action affecting production runtime

Required high-risk documentation chain:

Plan → Approval Checkpoint → Execution → Result Evidence → Final Closure → Current State Report

Medium-risk Web actions require reduced chain.

Examples:

- UI visibility correction
- API Proxy correction
- SSR correction
- Layout correction
- Read-only dashboard correction
- Role visibility alignment

Required medium-risk documentation chain:

Execution Plan → Result Evidence → Commit → Tag

Low-risk Web actions require minimal documentation.

Examples:

- Documentation-only report
- Current state note
- Handoff file
- Read-only audit
- Typo-safe documentation correction

Required low-risk documentation chain:

Single document OR focused commit

────────────────────────────────────────────
19.4) Mandatory Checkpoint Chain For Production Deployment
────────────────────────────────────────────

A Web production deployment must be executed through checkpoints.

Valid chain:

1. Web current state inspection
2. Web deployment readiness plan
3. Local build approval checkpoint
4. Local build validation result
5. Web Docker image build approval checkpoint
6. Web image build and push validation result
7. Server pull approval checkpoint
8. Server pull result
9. Controlled Web container replacement approval checkpoint
10. Controlled Web container replacement result
11. Post-replacement functional validation approval checkpoint
12. Post-replacement functional validation result
13. Authenticated functional validation approval checkpoint
14. Authenticated functional validation result
15. Final deployment closure
16. Current state report

Each checkpoint must answer:

- What is approved?
- What is not approved?
- What must not be touched?
- What is the rollback path?
- What evidence is required?
- What is the next valid action?

A step is not allowed to proceed until the previous step has evidence.

If any step fails:

STOP.

Document the failure.

Create a corrected plan or approval checkpoint.

Do not improvise.

────────────────────────────────────────────
19.5) Disk Space Gate Before Server Pull
────────────────────────────────────────────

Before any production server image pull, disk space must be checked.

Mandatory server read-only commands:

df -h /
df -ih /
sudo docker system df -v

Minimum safe condition:

- Root filesystem must have at least 5GB available.
- Root filesystem should not be above 85% used.
- Inodes must not be under pressure.
- Docker reclaimable space must be understood before pull.

If available space is below 5GB or root usage is above 85%:

STOP.

Do not pull Web image.

Do not stop Web container.

Do not replace Web container.

Create a controlled production server disk cleanup plan.

────────────────────────────────────────────
19.6) Controlled Cleanup Governance
────────────────────────────────────────────

Production server cleanup is high-risk.

Cleanup must never be performed casually.

Forbidden:

- docker system prune -a without bounded plan
- docker volume prune
- deleting active containers
- deleting active images
- deleting database volumes
- deleting PostgreSQL data
- deleting unknown files
- deleting production env files
- deleting rollback containers before closure
- deleting backup containers without explicit approval
- Docker Compose action during cleanup
- Core restart during cleanup
- DB restart during cleanup

Allowed only with explicit approval:

- Removing explicitly listed stopped legacy containers
- Removing explicitly listed unused legacy images
- Removing dangling images only
- Removing temporary validation files
- Read-only disk audits

Cleanup approval must include:

- Exact candidate list
- Confirmation that candidates are unused
- Confirmation that no active runtime container is touched
- Confirmation that no volume is deleted
- Confirmation that no DB data is touched
- Required post-cleanup health checks
- Required evidence result

────────────────────────────────────────────
19.7) No Blind Command Execution Rule
────────────────────────────────────────────

Commands inside this runbook are templates, not blind commands.

Before execution, every command must be reviewed and populated with correct values.

Required values include:

- IMAGE_TAG
- WEB_PROD_IMAGE
- WEB_NEW_IMAGE
- WEB_OLD_NAME
- WEB_BACKUP_NAME
- WEB_ENV_FILE
- Deployment scope
- Deployment date
- Branch name
- Git tag
- Evidence file path

If a command contains placeholders such as:

<IMAGE_TAG>
<scope>
YYYY-MM-DD

STOP.

Replace placeholders before execution.

If a pasted command is partial, malformed, or includes terminal artifacts:

STOP.

Run a read-only safety check before continuing.

────────────────────────────────────────────
19.8) Production Server Tooling Limitation Rule
────────────────────────────────────────────

Production server must not be modified to satisfy convenience tooling during deployment.

Do not install tools during deployment unless a separate infra plan approves it.

Examples of tools that must not be assumed:

- node
- jq
- npm
- pnpm
- build tools
- local project dependencies

Allowed baseline tools:

- shell
- docker
- curl
- grep
- sed
- awk
- df
- du
- ls
- cat for read-only output only

If response preview or JSON formatting requires a missing tool:

- Do not install the tool.
- Mark preview limitation as non-blocking if HTTP status validation is sufficient.
- Document the limitation in evidence.

────────────────────────────────────────────
19.9) Server Documentation Rule
────────────────────────────────────────────

The production server is not a documentation workspace.

Forbidden on production server:

- Creating Markdown documentation files
- Writing official reports
- Editing repository docs
- Using cat > docs/*.md
- Storing deployment evidence as official docs outside Git

Correct flow:

Server evidence → Local documentation → Git commit → Git tag → Remote push

Runtime-only files allowed on server:

- Restricted env backup file for rollback
- Temporary cookie jar for validation
- Temporary response files for validation

Temporary validation files must be deleted after validation when safe.

Secrets must not be printed or documented.

────────────────────────────────────────────
19.10) Controlled Web Replacement Rule
────────────────────────────────────────────

The current runbook contains direct replacement commands.

For zero-risk governance, direct removal of hawana-web is not the preferred first action.

Preferred controlled replacement pattern:

1. Record current Web image.
2. Record current Web image id.
3. Record current Web restart policy.
4. Record current Web network.
5. Record current Web port bindings.
6. Save current Web env to restricted server file without printing secrets.
7. Stop old Web container.
8. Rename old Web container to backup name.
9. Start new Web container with same name, same network, same ports, same approved env.
10. Validate health.
11. Validate authenticated business routes.
12. Preserve backup container until final closure.

The command:

sudo docker rm -f hawana-web

must not be used as the primary deployment path unless:

- backup strategy is documented
- rollback path is already approved
- old image is recorded
- old env is preserved
- operator has explicit approval

Rollback must not touch:

- Core
- PostgreSQL
- Billing
- companyId
- Workflow
- Volumes
- Nginx unless explicitly scoped

────────────────────────────────────────────
19.11) Functional Validation Rule
────────────────────────────────────────────

Health checks are mandatory but not sufficient.

A Web deployment cannot be accepted by /api/health alone.

Minimum validation layers:

1. Web container running
2. Web active image confirmed
3. Web logs safe tail reviewed
4. Public /api/health returns 200
5. Login through Web works
6. Dashboard loads
7. Safety Reports loads
8. Action Plans loads
9. Users route behavior matches role
10. Billing route behavior remains valid
11. Session persistence remains valid
12. Logout behavior remains valid
13. API Proxy flow remains intact
14. No direct Core URL appears in UI output
15. Core health remains passed
16. Core readiness remains passed
17. Postgres remains running
18. No restart loop
19. Safe logs review

Business validation must preserve:

Web → API Proxy → Core

Direct UI to Core validation is not accepted.

────────────────────────────────────────────
19.12) Web Audit Rule
────────────────────────────────────────────

Before production deployment, Web audit must confirm:

- No direct Core calls from UI
- No browser-side :3001 usage
- No companyId authority from UI
- No frontend Workflow derivation
- No frontend Billing derivation
- API Proxy routes remain the boundary
- serverAppFetch remains approved server-side Core access path
- NEXT_PUBLIC_API_BASE_URL remains /api
- CORE_API_BASE_URL remains server-side only

If audit fails:

STOP.

Do not build.

Do not deploy.

────────────────────────────────────────────
19.13) Rollback Governance Rule
────────────────────────────────────────────

Rollback must be ready before replacement.

A Web replacement is not approved unless:

- Old Web image is recorded.
- Old Web container can be preserved.
- Backup container name is defined.
- Current Web env is saved without printing secrets.
- Rollback command path is known.
- Core is not touched.
- Postgres is not touched.
- Volumes are not touched.
- Nginx is not touched unless explicitly scoped.

If new Web fails:

STOP.

Rollback.

Do not debug by random restarts.

Do not change Core.

Do not change DB.

Do not change Nginx.

Do not change Docker network.

────────────────────────────────────────────
19.14) Failure Documentation Rule
────────────────────────────────────────────

Every failed high-risk Web step must be documented.

Failure result must include:

- What failed
- Exact failure type
- Root cause if known
- What was not touched
- Current runtime status
- Whether rollback was needed
- Whether rollback was executed
- Next valid action

Failure documentation is mandatory.

────────────────────────────────────────────
19.15) Final Closure Rule
────────────────────────────────────────────

A Web production deployment chain is not complete until a final closure document exists.

Final closure must include:

- Deployment result
- Active Web image
- Image platform
- Runtime status
- Rollback status
- Health validation
- Functional validation
- Architecture status
- Core untouched confirmation
- DB untouched confirmation
- Billing untouched confirmation
- companyId untouched confirmation
- Workflow untouched confirmation
- Deletion summary
- Production acceptance decision
- First real pilot status if applicable

If final closure is missing:

Deployment is not formally closed.

────────────────────────────────────────────
19.16) Current State Handoff Rule
────────────────────────────────────────────

After final closure, create a current state report.

Required example:

docs/deployment/WEB_CURRENT_STATE_AFTER_<SCOPE>_CLOSURE_<YYYY_MM_DD>.md

The current state report must include:

- Current Git HEAD
- Current tag
- Current active Web image
- Current platform
- Current runtime state
- Current Core image
- Current Core state
- Current architecture state
- Current next valid track
- What remains pending
- What is not approved yet

This file becomes the source-of-truth anchor for future chats.

Future conversations must read the latest Web current state report before continuing Web deployment or pilot work.

────────────────────────────────────────────
19.17) Final Governance Control
────────────────────────────────────────────

Before any future Web deployment execution, answer:

Does this preserve Web → API Proxy → Core?

If no:

STOP.

Does this use /api only from UI?

If no:

STOP.

Does this preserve serverAppFetch for server-side Core access?

If no:

STOP.

Does this touch Core?

If yes:

STOP and create separate Core plan.

Does this touch DB?

If yes:

STOP and create separate DB plan.

Does this touch Billing?

If yes:

STOP and create separate Billing plan.

Does this touch companyId?

If yes:

STOP and create separate architecture review.

Does this touch Workflow?

If yes:

STOP and create separate Workflow plan.

Does this touch Nginx or Docker network?

If yes:

STOP and create separate Infra plan.

Does this lack rollback?

If yes:

STOP.

Does this lack evidence plan?

If yes:

STOP.

Does this lack final current state handoff after closure?

If yes:

Deployment chain is incomplete.

────────────────────────────────────────────
20) ADDENDUM DELETION CONFIRMATION
────────────────────────────────────────────

Was anything deleted by creating this Web deployment governance addendum?

No.

This addendum is additive only.

No production files were deleted.

No repository files were deleted.

No database records were deleted.

No PostgreSQL volumes were deleted.

No Docker containers were changed.

No Docker images were changed.

No Core logic was changed.

No Billing logic was changed.

No companyId logic was changed.

No Workflow logic was changed.

No architecture changes were made.

────────────────────────────────────────────
END OF WEB DEPLOYMENT GOVERNANCE ADDENDUM
────────────────────────────────────────────
