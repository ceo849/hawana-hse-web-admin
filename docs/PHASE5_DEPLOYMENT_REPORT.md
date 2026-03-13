# Phase 5 — Cloud Deployment Report

Project: Hawana HSE  
Environment: Production  
Deployment Date: March 2026

---

## Infrastructure

Server:
Google Cloud VM

Operating System:
Ubuntu 22.04

Reverse Proxy:
Nginx

SSL:
Let's Encrypt

---

## Application Architecture

Production Stack:

Web Admin  
Next.js (Docker Container)

Core API  
NestJS (Docker Container)

Database  
PostgreSQL (Cloud)

Architecture Flow:

User Browser
→ Nginx (HTTPS Reverse Proxy)
→ Next.js Web Admin
→ NestJS Core API
→ PostgreSQL Database

---

## Containers

hawana-web  
Port: 3000  
Role: Web Admin Interface

hawana-core  
Port: 3001  
Role: Backend API

---

## Domain

Primary Domain:
https://hawanaglobal.com

Reverse Proxy Routes:

/ → Web Admin  
/api/v1 → Core API

---

## Security

HTTPS enforced  
Helmet enabled  
CORS configured  
Rate limiting enabled  
JWT authentication active

---

## Verification

The following production checks were performed:

Login test ✔  
Dashboard load ✔  
Companies module ✔  
Safety Reports ✔  
Action Plans ✔  
API health endpoint ✔

---

## Result

The Hawana HSE platform is successfully deployed to production and running end-to-end on cloud infrastructure.

Web → API → Database connectivity verified.

Deployment status: **Operational**
