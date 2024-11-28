import whisper
import string
import datetime

start = datetime.datetime.now()
model = whisper.load_model("base")

result = model.transcribe("suna_ram.m4a") 

print("Transcription:")
print(result["text"])

transcription_without_punctuation = result["text"].translate(str.maketrans('', '', string.punctuation))
list_of_words = transcription_without_punctuation.split()

wake_word = "sunoram"

wake_word_list = wake_word.lower().split()

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

if is_wake_word_detected(wake_word_list, list_of_words):
    print(f"'{wake_word}' detected!")
else:
    print(f"'{wake_word}' was not detected!")

end = datetime.datetime.now()
print("Time taken:", (end-start).total_seconds(), "seconds")
