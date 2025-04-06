# base image
FROM node:22

# set the working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
# this is only build command and not run command
RUN npm install

# copy the rest of the application code
COPY . .

# set the port in the env variable

ENV PORT=3000

# expose the port
EXPOSE 3000

# run the app
CMD ["npm", "start"]