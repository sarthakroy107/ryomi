FROM ubuntu:24.04

# Install dependencies
RUN apt update && apt install -y ffmpeg unzip curl && apt-get clean

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

RUN unzip awscliv2.zip && ./aws/install

# Create a working directory
WORKDIR /app

# Copy the script to the working directory
COPY ./process-video.sh /app/process-video.sh

# Make the script executable
RUN chmod +x /app/process-video.sh

# Set the entry point to execute the script
ENTRYPOINT [ "/app/process-video.sh" ]
