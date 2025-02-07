#!/bin/bash

##############################################################################
############################### TRANSCODE ####################################
##############################################################################

transcode() {

    # Log the start time
    echo "Starting transcoding at $(date)"

    echo $TRANSCODE_FFMPEG_COMMAND
    echo $TRANSCODE_UPLOAD_OUTPUT_OBJECTS_COMMAND

    # echo "pwd: $(pwd)"
    # echo "Making output directory..."
    mkdir -p /output

    # Check if commands are defined
    # if [ -z "$TRANSCODE_FFMPEG_COMMAND" ]; then
    #     echo "Error: FFMPEG_COMMAND is not set."
    #     exit 1
    # fi

    # if [ -z "$TRANSCODE_UPLOAD_OUTPUT_OBJECTS_COMMAND" ]; then
    #     echo "Error: UPLOAD_OUTPUT_OBJECTS_COMMAND is not set."
    #     exit 1
    # fi

    echo "Executing FFmpeg command..."
    eval "$TRANSCODE_FFMPEG_COMMAND"

    if [ $? -ne 0 ]; then
        echo "FFmpeg command failed at $(date)"
        exit 1
    fi

    echo "pwd: $(pwd)"
    echo "ls: $(ls)"

    echo "Executing upload command..."
    eval "$TRANSCODE_UPLOAD_OUTPUT_OBJECTS_COMMAND"

    if [ $? -ne 0 ]; then
        echo "Upload command failed at $(date)"
        exit 1
    fi

    # Delete the output directory
    rm -rf /output

    # Log the completion time
    echo "Files transfer completed successfully at $(date)"
}

##############################################################################
################################ CONVERT #####################################
##############################################################################

convert() {

    echo "Starting convertion at $(date)"

    echo $CONVERT_FFMPEG_COMMAND
    echo $CONVERT_UPLOAD_OUTPUT_OBJECTS_COMMAND

    # Create output directory
    mkdir -p /output

    # Check if commands are defined
    # if [ -z "$CONVERT_FFMPEG_COMMAND" ]; then
    #     echo "Error: FFMPEG_COMMAND is not set."
    #     exit 1
    # fi

    # if [ -z "$CONVERT _UPLOAD_OUTPUT_OBJECTS_COMMAND" ]; then
    #     echo "Error: UPLOAD_OUTPUT_OBJECTS_COMMAND is not set."
    #     exit 1
    # fi

    # Execute the commands

    echo "Executing convert FFmpeg command..."
    eval "$CONVERT_FFMPEG_COMMAND"

    if [ $? -ne 0 ]; then
        echo "Convert FFmpeg command failed at $(date)"
        exit 1
    fi

    echo "pwd: $(pwd)"
    echo "ls: $(ls)"

    echo "Executing upload command..."
    eval "$CONVERT_UPLOAD_OUTPUT_OBJECTS_COMMAND"

    if [ $? -ne 0 ]; then
        echo "Upload command failed at $(date)"
        exit 1
    fi

    # Upload to s3
    echo "Uploading to s3"
    eval "$CONVERT_UPLOAD_OUTPUT_OBJECTS_COMMAND"

    # Delete the output directory
    rm -rf /output

    echo "Files transfer completed successfully at $(date)"
}

# Log the completion time
echo "Files transfer completed successfully at $(date)"

##############################################################################
############################## SUBTITLE ######################################
##############################################################################

echo "Starting generating subtitle at $(date)"

echo "Skipping subtitle generation"

# Activate the virtual environment
### source /env/bin/activate

# Run the transcription script
### python /transcribe.py

##############################################################################
############################## MAIN ##########################################
##############################################################################

# Download the input video file

echo "Starting dowwloading input video at $(date)"

# Check if command is defined
if [ -z "$DOWNLOAD_OBJECT_COMMAND" ]; then
    echo "Error: DOWNLOAD_OBJECT_COMMAND is not set."
    exit 1
fi

# Execute the commands
echo "Executing download command..."
echo $DOWNLOAD_OBJECT_COMMAND
eval "$DOWNLOAD_OBJECT_COMMAND"

if [ ! -z "$TRANSCODE_FFMPEG_COMMAND" ] && [ ! -z "$TRANSCODE_UPLOAD_OUTPUT_OBJECTS_COMMAND" ]; then
    echo "Executing transcode"
    transcode
fi

if [ ! -z "$CONVERT_FFMPEG_COMMAND" ] && [ ! -z "$CONVERT_UPLOAD_OUTPUT_OBJECTS_COMMAND" ]; then
    echo "Executing convert"
    convert
fi

#####################################################################################
#####################################################################################
#####################################################################################

# # Log the start time
# echo "Starting file transfer at $(date)"

# echo $DOWNLOAD_OBJECT_COMMAND
# echo $FFMPEG_COMMAND
# echo $UPLOAD_OUTPUT_OBJECTS_COMMAND

# echo "pwd: $(pwd)"
# echo "Making output directory..."
# mkdir -p /output

# # Check if commands are defined
# if [ -z "$DOWNLOAD_OBJECT_COMMAND" ]; then
#     echo "Error: DOWNLOAD_OBJECT_COMMAND is not set."
#     exit 1
# fi

# if [ -z "$FFMPEG_COMMAND" ]; then
#     echo "Error: FFMPEG_COMMAND is not set."
#     exit 1
# fi

# if [ -z "$UPLOAD_OUTPUT_OBJECTS_COMMAND" ]; then
#     echo "Error: UPLOAD_OUTPUT_OBJECTS_COMMAND is not set."
#     exit 1
# fi

# # Execute the commands
# echo "Executing download command..."
# eval "$DOWNLOAD_OBJECT_COMMAND"

# if [ $? -ne 0 ]; then
#     echo "Download command failed at $(date)"
#     exit 1
# fi

# echo "Executing FFmpeg command..."
# eval "$FFMPEG_COMMAND"

# if [ $? -ne 0 ]; then
#     echo "FFmpeg command failed at $(date)"
#     exit 1
# fi

# echo "pwd: $(pwd)"
# echo "ls: $(ls)"

# echo "Executing upload command..."
# eval "$UPLOAD_OUTPUT_OBJECTS_COMMAND"

# if [ $? -ne 0 ]; then
#     echo "Upload command failed at $(date)"
#     exit 1
# fi

# # Log the completion time
# echo "Files transfer completed successfully at $(date)"
