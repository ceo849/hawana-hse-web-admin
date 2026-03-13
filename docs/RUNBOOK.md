
# Hawana HSE — Operations Runbook

Project: Hawana HSE Platform
Phase: Phase 5 — Cloud Deployment
Purpose: Document standard deployment, rollback, and operational recovery steps.

--------------------------------------------------

## 1. Production Deployment Flow

Standard deployment sequence:

build
→ push
→ pull
→ restart containers
→ verify health
→ verify workflow

This flow must be followed for every production-safe deployment.

--------------------------------------------------

## 2. Web Admin Deployment

### Build image locally

docker buildx build \
--platform linux/amd64 \
--build-arg NEXT_PUBLIC_API_BASE_URL=https://hawanaglobal.com \
--build-arg NEXT_PUBLIC_API_PREFIX=/api/v1 \
-t us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<tag> \
--push .

### Pull image on server

docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<tag>

### Restart web container

docker stop hawana-web
docker rm hawana-web
docker run -d \
--name haestart always \
-p 3000:3000 \
-e NEXT_PUBLIC_API_BASE_URL=https://hawanaglobal.com \
-e NEXT_PUBLIC_API_PREFIX=/api/v1 \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<tag>

--------------------------------------------------

## 3. Core API Deployment

### Build and push core image

docker buildx build \
--platform linux/amd64 \
-t us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:latest \
--push .

### Pull core image on server

docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:latest

### Restart core container

docker stop hawana-core
docker rm hawana-core
docker run -d \
--name hawana-core \
--restart always \
--network hawana-network \
-p 3001:3001 \
-e NODE_ENV=production \
-e PORT=3001 \
-e DATABASE_URL="postgresql://postgres:Hawana%402026@34.44.9.217:5432/hawana_hse" \
-e JWT_SECRET="hawana_super_secure_jwt_secret_key_2026" \
-e JWT_EXPIRES_IN=15m \
-e REFRESH_TOKEN_SECRET="hawana_super_secure_refresh_secret_key_2026" \
-e REFRESH_TOKEN_EXPIRES_IN_DAYS=7 \
-e CORS_ORIGIN="*" \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:latest

--------------------------------------------------

## 4. Rollback Procedure

If a deployment fails:

### Rollback Web Admin

docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<previous-tag>
docker stop hawana-web
docker rm hawana-web
docker run -d \
--name hawana-web \
--restart always \
-p 3000:3000 \
-e NEXT_PUBLIC_API_BASE_URL=https://hawanaglobal.com \
-e NEXT_PUBLIC_API_PREFIX=/api/v1 \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<previous-tag>

### Rollback Core API

docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:<previous-tag>
docker stop hawana-core
docker rm hawana-core
docker run -d \
--name hawana-core \
--restart always \
--network hawana-network \
-p 3001:3001 \
-e NODE_ENV=production \
-e PORT=3001 \
-e DATABASE_URL="postgresql://postgres:Hawana%402026@34.44.9.217:5432/hawana_hse" \
-e JWT_SECRET="hawana_super_secure_jwt_secret_key_2026" \
-e JWT_EXPIRES_IN=15m \
-e REFRESH_TOKEN_SECRET="hawana_super_secure_refresh_secret_key_2026" \
-e REFRESH_TOKEN_EXPIRES_IN_DAYS=7 \
-e CORS_ORIGIN="*" \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:<previous-tag>

### Verify rollback

docker ps
curl https://hawanaglobal.com/api/v1/health
curl https://hawanaglobal.com/api/v1/health/ready

--------------------------------------------------

## 5. Nginx Verification

Configuration file:

/etc/nginx/sites-available/hawana

Validation:

sudo nginx -t

Reload:

sudo systemctl reload nginx

--------------------------------------------------

## 6. Container Verification

Check running containers:

docker ps

Check web logs:

docker logs hawana-web --tail 50

Check core logs:

docker logs hawana-core --tail 50

Expected result:

- hawana-web is running
- hawana-core is running
- restart policy is active
- no critical runtime errors

--------------------------------------------------

## 7. Health Verification

Core API health endpoint:

https://hawanaglobal.com/api/v1/health

Expected result:

{"status":"ok"}

Core API readiness endpoint:

https://hawanaglobal.com/api/v1/health/ready

Expected result:

{"status":"ready","database":"connected"}

--------------------------------------------------

## 8. Functional Verification

Minimum production verification after deployment:

1. Open login page
2. Sign in successfully
3. Open dashboard
4. Verify Users page
5. Verify Companies page
6. Verify Sites / Projects page
7. Verify Safety Reports page
8. Verify Action Plans page

--------------------------------------------------

## 9. Automated Smoke Tests

Available scripts:

smoke-check.sh
deep-smoke-check.sh
workflow-smoke-check.sh

Recommended final verification:

./workflow-smoke-check.sh

Expected result:

WORKFLOW SMOKE CHECK PASSED

--------------------------------------------------

## 10. Production Incident Reference

Nginx reverse proxy issue was previously resolved by ensuring correct forwarding headers:

proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

Routing rule:

/api/v1/ → Core API
/api/ → Web Admin routes
/ → Web Admin pages

--------------------------------------------------

## 11. Rule

Do not modify Nginx routing or production environment structure unless a verified issue requires change.
