FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY yarn.lock .

# Copy the rest of the application source code
COPY . .
RUN rm -rf node_modules dist
RUN yarn install
# Build the React application
RUN yarn build

# Stage 2: Create the production image
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# Copy the build artifacts from the previous stage
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf
# Expose port 4173
EXPOSE 4173

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]