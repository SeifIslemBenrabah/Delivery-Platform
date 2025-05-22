# Use official Node image (close to your version)
FROM node:23

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Expose the port your app runs on (update if not 3000)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
