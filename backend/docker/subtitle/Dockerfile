# Start with an Ubuntu base image
FROM ubuntu:24.04

# Install dependencies
RUN apt update && apt install -y ffmpeg unzip curl software-properties-common && apt-get clean

# Add the deadsnakes PPA and install Python 3.10
RUN add-apt-repository ppa:deadsnakes/ppa && \
    apt update && \
    apt install -y python3.10 python3.10-venv python3.10-distutils && \
    apt-get clean

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && ./aws/install && rm -rf awscliv2.zip ./aws

# Create and activate a virtual environment with Python 3.10
RUN python3.10 -m venv /env

# Install pip for Python 3.10 and upgrade it
RUN /env/bin/pip install --upgrade pip

# Install srt package
RUN /env/bin/pip install --no-cache-dir srt

# Install tensorflow
RUN /env/bin/pip install --no-cache-dir torch

# Install transformers
RUN /env/bin/pip install --no-cache-dir transformers

# Install openai-whisper
RUN /env/bin/pip install -U openai-whisper


# Create a working directory
WORKDIR /app

# Copy the scripts to the working directory
COPY ./process-video.sh /app/process-video.sh
COPY ./transcribe.py /app/transcribe.py

# Make the shell script executable
RUN chmod +x /app/process-video.sh

# Set the entry point to execute the shell script
ENTRYPOINT [ "/app/process-video.sh" ]
