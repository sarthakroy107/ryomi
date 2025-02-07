from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import sys
import srt
import os
import subprocess  # Use subprocess for AWS S3 command execution

def load_nllb_model():
    try:
        print("Loading NLLB model and tokenizer...")
        model_name = "facebook/nllb-200-distilled-600M"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to("cuda" if torch.cuda.is_available() else "cpu")
        print("NLLB model and tokenizer loaded successfully.")
        return tokenizer, model
    except Exception as e:
        print(f"Error loading model or tokenizer: {e}")
        sys.exit(1)

def translate_subtitles(input_file, target_languages, source_language, tokenizer, model, s3_upload_folder_without_slash, filename_without_codec):
    try:
        print(f"Opening subtitle file: {input_file}")
        with open(input_file, 'r') as f:
            subs = list(srt.parse(f.read()))
        print("Subtitle file opened and parsed successfully.")
    except Exception as e:
        print(f"Error reading or parsing subtitle file: {e}")
        sys.exit(1)

    for lang in target_languages:
        print(f"Translating subtitles to target language: {lang}")
        translated_subs = []
        for i, subtitle in enumerate(subs):
            try:
                input_text = subtitle.content
                print(f"Translating subtitle {i + 1}: {input_text}")
                inputs = tokenizer(input_text, return_tensors="pt", padding=True).to(model.device)

                translated_tokens = model.generate(
                    **inputs, forced_bos_token_id=tokenizer.convert_tokens_to_ids(lang)
                )

                translated_text = tokenizer.decode(translated_tokens[0], skip_special_tokens=True)
                subtitle.content = translated_text
                translated_subs.append(subtitle)
                print(f"Translated subtitle {i + 1}: {translated_text}")
            except Exception as e:
                print(f"Error translating subtitle '{input_text}' at index {i + 1}: {e}")
                continue  # Skip this subtitle and move to the next one

        # Output file name based on language
        output_file = f"{filename_without_codec}-{lang.split('_')[0]}.srt"
        try:
            print(f"Saving translated subtitles to file: {output_file}")
            with open(output_file, 'w') as out_f:
                out_f.write(srt.compose(translated_subs))
            print(f"Translated subtitles saved successfully to {output_file}. Now uploading to S3")

            # Upload to S3 using subprocess for better error handling
            upload_command = f"aws s3 cp {output_file} s3://{s3_upload_folder_without_slash}/{output_file}"
            print(f"Running AWS S3 command: {upload_command}")
            result = subprocess.run(upload_command, shell=True, capture_output=True, text=True)

            if result.returncode == 0:
                print(f"Uploaded {output_file} to S3 successfully.")
            else:
                print(f"Error uploading {output_file} to S3: {result.stderr}")
        except Exception as e:
            print(f"Error saving translated subtitles for language '{lang}': {e}")

def main():
    try:
        print("Starting subtitle translation process...")
        input_file = sys.argv[1]
        target_languages = sys.argv[2].split(",")
        source_language = sys.argv[3]
        s3_upload_folder_without_slash = sys.argv[4]
        filename_without_codec = sys.argv[5]
        
        print(f"Input file: {input_file}")
        print(f"Target languages: {target_languages}")
        print(f"Source language: {source_language}")
        print(f"S3 folder: {s3_upload_folder_without_slash}")
        print(f"Filename without codec: {filename_without_codec}")

        tokenizer, model = load_nllb_model()
        translate_subtitles(input_file, target_languages, source_language, tokenizer, model, s3_upload_folder_without_slash, filename_without_codec)
        print("Subtitle translation process completed successfully.")
    except IndexError:
        print("Error: Missing required arguments. Usage: python transcribe.py <input_file> <target_languages> <source_language> <s3_upload_folder> <filename_without_codec>")
    except Exception as e:
        print(f"Unexpected error in main function: {e}")

if __name__ == "__main__":
    main()
