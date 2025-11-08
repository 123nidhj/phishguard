# 1. Base image
FROM node:18-alpine AS base

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm install

# 4. Copy rest of the code
COPY . .

# 5. Build the Next.js app
RUN npm run build

# 6. Start with lighter image
FROM node:18-alpine AS runner
WORKDIR /app

# 7. Copy build artifacts
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/next.config.js ./next.config.js

# 8. Set environment
ENV NODE_ENV=production

# 9. Start the app
CMD ["npm", "start"]
