#!/bin/bash

##############################################################################
############################### TRANSCODE ####################################
##############################################################################

transcode() {

    # Log the start time
    echo "Starting transcoding at $(date)"

    echo $TRANSCODE_FFMPEG_COMMAND
    echo $TRANSCODE_UPLOAD_OUTPUT_OBJECTS_COMMAND

    mkdir -p /output

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

##############################################################################
############################## SUBTITLE ######################################
##############################################################################

generate_subtitles() {
    echo "Starting subtitle generation at $(date)"
    source /env/bin/activate # Activate virtual environment

    # Extract audio
    ffmpeg -i "$VIDEO_FILE" -q:a 0 -map a audio.mp3
    echo "Audio extracted successfully at $(date)\n"

    # Generate subtitles in English
    echo "Generating English subtitles with Whisper"
    whisper audio.mp3 --model medium --device cpu --fp16 False --language "$VIDEO_LANGUAGE" --task translate

    # Upload transcribed autdio to s3
    # echo "Uploading transcribed audio to s3"
    # aws s3 cp audio.srt s3://"$SUBTITLE_UPLOAD_FOLDER_WITH_SLASH"audio_wshiper.srt

    if [ $? -ne 0 ]; then
        echo "Subtitle generation failed at $(date)"
        exit 1
    fi

    echo "Subtitle generation completed successfully at $(date)"
    
    # Assuming Whisper outputs an srt file named 'audio.srt'
    echo "Entering python environment for translation"

    python transcribe.py audio.srt "$TARGET_SUBTITLE_LANGUAGES" "$VIDEO_LANGUAGE" "$SUBTITLE_UPLOAD_FOLDER_WITH_SLASH" "$VIDEO_FILE_ONLY_NAME"

    if [ $? -ne 0 ]; then
        echo "Subtitle translation failed at $(date)"
        exit 1
    fi

    echo "All subtitle generations and uploads completed successfully at $(date)"
}


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

if [ ! -z "$VIDEO_LANGUAGE" ] && [ ! -z "$TARGET_SUBTITLE_LANGUAGES" ] && [ ! -z "$SUBTITLE_UPLOAD_FOLDER_WITH_SLASH" ] && [ ! -z "$VIDEO_FILE_ONLY_NAME" ]; then
    echo "Executing generate_subtitles"
    generate_subtitles
fi
