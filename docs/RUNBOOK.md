# Hawana HSE — Operations Runbook

Project: Hawana HSE Platform
Phase: Phase 5 — Cloud Deployment
Purpose: Document standard deployment and operational recovery steps.

--------------------------------------------------

## 1. Production Deployment Flow

Standard deployment sequence:

build
→ push
→ pull
→ restart containers

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
--name hawana-web \
--restart always \
-p 3000:3000 \
-e N_API_BASE_URL=https://hawanaglobal.com \
-e NEXT_PUBLIC_API_PREFIX=/api/v1 \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-web:<tag>

--------------------------------------------------

## 3. Core API Deployment

### Pull core image on server

docker pull us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:<tag>

### Restart core container

docker stop hawana-core
docker rm hawana-core
docker run -d \
--name hawana-core \
--restart always \
-p 3001:3001 \
--env-file .env.production \
us-central1-docker.pkg.dev/hawana-hse-platform/hawana-hse/hawana-hse-core:<tag>

--------------------------------------------------

## 4. Nginx Verification

Configuration file:

/etc/nginx/sites-available/hawana

Validation:

sudo nginx -t

Reload:

sudo systemctl reload nginx

--------------------------------------------------

## 5. Container Verification

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

## 6. Health Verification

Core API health endpoint:

https://hawanaglobal.com/api/v1/health

Expected result:

{"status":"ok"}

--------------------------------------------------

## 7. Functional Verification

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

## 8. Automated Smoke Tests

Available scripts:

smoke-check.sh
deep-smoke-check.sh
workflow-smoke-check.sh

Recommended final verification:

./workflow-smoke-check.sh

Expected result:

WORKFLOW SMOKE CHECK PASSED

--------------------------------------------------

## 9. Production Incident Reference

Nginx reverse proxy issue was previously resolved by ensuring correct forwarding headers:

proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

Routing rule:

/api/v1/ → Core API
/api/ → Web Admin routes
/ → Web Admin pages

--------------------------------------------------

## 10. Rule

Do not modify Nginx routing or production environment structure unless a verified issue requires change.
