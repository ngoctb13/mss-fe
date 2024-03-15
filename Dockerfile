# Stage 1: Build the React application
FROM node:18-alpine3.19 AS build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine as production-stage

# Copy the built assets from the build-stage
COPY --from=build-stage /app/build /usr/share/nginx/html

COPY ./default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]