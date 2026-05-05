# ---------- BUILD STAGE ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    
    ARG NEXT_PUBLIC_API_BASE_URL
    ARG NEXT_PUBLIC_API_PREFIX
    
    ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
    ENV NEXT_PUBLIC_API_PREFIX=$NEXT_PUBLIC_API_PREFIX
    
    RUN npm run build
    
    # نحول node_modules إلى production فقط بدل npm ci مرة ثانية
    RUN npm prune --omit=dev
    
    
    # ---------- PRODUCTION STAGE ----------
    FROM node:20-alpine
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # ✅ FIX: استخدام Next standalone runtime
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    
    COPY --from=builder /app/public ./public
    
    EXPOSE 3000
    
    CMD ["node", "server.js"]