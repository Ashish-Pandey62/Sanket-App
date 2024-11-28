import whisper
import string
import datetime

start = datetime.datetime.now()
model = whisper.load_model("base")

def run_wakeword(file_path):
    result = model.transcribe(file_path) 

    print("Transcription:")
    print(result["text"])

    transcription_without_punctuation = result["text"].translate(str.maketrans('', '', string.punctuation))
    list_of_words = transcription_without_punctuation.split()

    return list_of_words
    # wake_word = "sunoram"

    # wake_word_list = wake_word.lower().split()

    # if is_wake_word_detected(wake_word_list, list_of_words):
    #     print(f"'{wake_word}' detected!")
    # else:
    #     print(f"'{wake_word}' was not detected!")

    end = datetime.datetime.now()
    print("Time taken:", (end-start).total_seconds(), "seconds")

def is_wake_word_detected(wake_word_list, transcription_list):
    transcription_lower = [word.lower() for word in transcription_list]
    try:
        start_index = transcription_lower.index(wake_word_list[0])
        for i in range(len(wake_word_list)):
            if transcription_lower[start_index + i] != wake_word_list[i]:
                return False
        return True
    except ValueError:
        return False  


if __name__ == "__main__":
    run_wakeword("suna_ram.m4a")

