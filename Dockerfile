FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
# SQLite lives in /app/data: mount a volume there to keep it.
VOLUME ["/app/data"]
EXPOSE 3000
CMD ["npm", "start"]
