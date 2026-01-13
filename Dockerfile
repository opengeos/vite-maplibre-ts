# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build for production with correct base path
ENV GITHUB_ACTIONS=true
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx (served under /vite-maplibre-ts/ to match GitHub Pages base path)
COPY --from=builder /app/dist /usr/share/nginx/html/vite-maplibre-ts

# Copy custom nginx config
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location /vite-maplibre-ts/ { \
        try_files $uri $uri/ /vite-maplibre-ts/index.html; \
    } \
    \
    location = / { \
        return 302 /vite-maplibre-ts/; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Startup script that prints URL and starts nginx
RUN printf '#!/bin/sh\n\
echo ""\n\
echo "======================================================"\n\
echo "  Vite MapLibre TypeScript Demo"\n\
echo "======================================================"\n\
echo ""\n\
echo "  Server running on port 80"\n\
echo ""\n\
echo "  If you ran: docker run -p 8080:80 ..."\n\
echo "  Open: http://localhost:8080/vite-maplibre-ts/"\n\
echo ""\n\
echo "======================================================"\n\
echo ""\n\
exec nginx -g "daemon off;"\n' > /start.sh && chmod +x /start.sh

CMD ["/start.sh"]
