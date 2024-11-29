import tensorflow as tf
import tensorflow_hub as hub
import librosa
import numpy as np
from datetime import datetime

print("Loading model...")
model_load_start = datetime.now()
yamnet_model = hub.load('https://tfhub.dev/google/yamnet/1')
model_load_complete = datetime.now()
time_to_load_model = (model_load_complete - model_load_start).total_seconds()
print(f"Model loaded in {time_to_load_model:.2f} seconds")

class_map_path = "yamnet_class_map.csv"
relevant_classes = {
    "baby cry": 20,
    "siren": 318,
    "doorbell": 349,
    "pets":68
}

# this is the Function to process audio and predict
def classify_audio(file_path, max_duration=5):

    # Load only the first max_duration seconds of audio
    duration = librosa.get_duration(filename=file_path)
    actual_duration = min(duration, max_duration)
    
    # Loading thee audio with optimized parameters
    data, sr = librosa.load(
        file_path,
        sr=16000,  # YAMNet requires 16kHz so standard vayo
        duration=actual_duration,
        mono=True,  # Ensure mono audio
        res_type='kaiser_fast'  
    )
    
    # Converting  to tensor efficiently
    waveform = tf.convert_to_tensor(data, dtype=tf.float32)
    
    # predictions goes hereee
    scores, _, _ = yamnet_model(waveform)
    
    relevant_scores = {}
    scores_np = scores.numpy()
    
    for label, class_id in relevant_classes.items():
        relevant_scores[label] = np.mean(scores_np[:, class_id])
    
    # Finding best match from class map
    best_match = max(relevant_scores, key=relevant_scores.get)
    return best_match, relevant_scores[best_match]

# Alerting the user
alerts = {
    "baby cry": "infantCrying",
    "siren": "fireAlarm",
    "doorbell": "doorBell",
    "pets": "petSound"
}

def process_audio_file(file_path, confidence_threshold=0.25):
    start_time = datetime.now()
    
    # Classify audio
    sound_label, confidence = classify_audio(file_path)
    print(f"confidence {confidence} for {sound_label}")
    
    # Processing results
    if confidence > confidence_threshold:
        print(f"Detected Sound: {sound_label} with confidence: {confidence:.3f}")
        return alerts[sound_label], confidence
        if sound_label in alerts:
            print(alerts[sound_label])
        else:
            print("No alert-worthy sound detected.")
    
    # timingggg
    processing_time = (datetime.now() - start_time).total_seconds()
    print(f"\nProcessing time: {processing_time:.2f} seconds")
    return "no sound detected", False


# if __name__ == "__main__":
#     file_path = "cryy.wav"
#     process_audio_file(file_path)
