# client/Dockerfile

# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Enable Corepack and prepare Yarn (Yarn Berry version as defined in package.json)
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Force Yarn to use the "node-modules" linker (instead of Plug'n'Play)
ENV YARN_NODE_LINKER=node-modules

# Copy package files first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies using Yarn's immutable install mode
RUN yarn install --immutable

# Copy the rest of the application code.
# Ensure your .dockerignore excludes node_modules and build directories like .next
COPY . .

# Build the Next.js app
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]