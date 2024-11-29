import whisper
import string
import datetime

start = datetime.datetime.now()
model = whisper.load_model("base")

wake_words_mapping = {
    "dai": ["die"," dai"],
    "bhai": ["thai", "bye"],
    "didi" : ["Диди", "did"],
    "uncle" : ["अंकल"]
}

def wakeword_detection(file_path):
    result = model.transcribe(file_path)

    print("Transcription:")
    print(result["text"])

    # Remove punctuation 
    transcription_without_punctuation = result["text"].translate(str.maketrans('', '', string.punctuation))
    transcription_list = transcription_without_punctuation.split()

    # checkking the wake words
    matched_keys = find_matching_keys(wake_words_mapping, transcription_list)

    # returingn the match words
    print("Matched Keys:", matched_keys)

    end = datetime.datetime.now()
    # print("Time taken:", (end-start).total_seconds(), "seconds")

    if len(matched_keys)>0:
         return matched_keys[0]
    else:
        return None

def find_matching_keys(wake_words_mapping, transcription_list):
    transcription_lower = [word.lower().strip() for word in transcription_list]
    print(transcription_lower)
    matched_keys = []

    for key, wake_words in wake_words_mapping.items():
        for wake_word in wake_words:
            if wake_word.strip() in transcription_lower:
                matched_keys.append(wake_word.strip())
                break

    return matched_keys

if __name__ == "__main__":
    wakeword_detection("./test_audio/dai.m4a")