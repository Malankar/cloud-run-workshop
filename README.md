# Project Overview
This project is a full-stack web application that consists of a frontend and a backend. The frontend is built using html css js, while the backend is developed with Node.js and Express. The application is designed to be deployed on Google Cloud Run, utilizing containerization for easy deployment and scalability.

# To run docker container
## Prerequisites
- Docker installed on your machine

## Steps to run the Docker container
`Optional - Run dockered to start the docker daemon`

1. Build the Docker image:
```bash
docker build -t cloud-run-workshop .
```
2. Run the Docker container:
```bash
docker run -p 3000:3000 cloud-run-workshop
```
3. Access the application in your web browser at `http://localhost:3000`.