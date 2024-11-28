import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from datetime import datetime
import librosa

# Load the YAMNet model
print("Loading model...")
model_load_start = datetime.now()
yamnet_model = hub.load('https://tfhub.dev/google/yamnet/1')
model_load_complete = datetime.now()
time_to_load_model = (model_load_complete - model_load_start).total_seconds()
print(f"Model loaded in {time_to_load_model:.2f} seconds")

# Define relevant classes
relevant_classes = {
    "baby cry": 20,
    "siren": 318,
    "doorbell": 349,
}

# Function to classify audio from a raw buffer
def classify_audio_buffer(audio_buffer, sample_rate, max_duration=5):
    # Resample to 16kHz if the sample rate is different
    if sample_rate != 16000:
        audio_buffer = librosa.resample(audio_buffer, orig_sr=sample_rate, target_sr=16000)
    
    # Truncate or pad audio to max_duration seconds
    max_samples = int(16000 * max_duration)  # 16kHz * max_duration seconds
    if len(audio_buffer) > max_samples:
        audio_buffer = audio_buffer[:max_samples]
    else:
        audio_buffer = np.pad(audio_buffer, (0, max_samples - len(audio_buffer)), mode='constant')
    
    # Convert to TensorFlow tensor
    waveform = tf.convert_to_tensor(audio_buffer, dtype=tf.float32)
    
    # Perform inference using YAMNet
    scores, _, _ = yamnet_model(waveform)
    
    # Extract scores for relevant classes
    relevant_scores = {label: np.mean(scores.numpy()[:, class_id]) for label, class_id in relevant_classes.items()}
    
    # Determine the best match
    best_match = max(relevant_scores, key=relevant_scores.get)
    return best_match, relevant_scores[best_match]

# Alerts for detected sounds
alerts = {
    "baby cry": "Baby is crying! Alerting user...",
    "siren": "Emergency siren detected!",
    "doorbell": "Someone is at the door!",
}

# Function to process the audio buffer
def process_audio_buffer(audio_buffer, sample_rate, confidence_threshold=0.5):
    start_time = datetime.now()
    
    # Classify the audio buffer
    sound_label, confidence = classify_audio_buffer(audio_buffer, sample_rate)
    
    # Print the detected sound and its confidence
    if confidence > confidence_threshold:
        print(f"Detected Sound: {sound_label} with confidence: {confidence:.3f}")
        if sound_label in alerts:
            print(alerts[sound_label])
        else:
            print("No alert-worthy sound detected.")
    else:
        print("No significant sound detected.")
    
    # Calculate and display processing time
    processing_time = (datetime.now() - start_time).total_seconds()
    print(f"\nProcessing time: {processing_time:.2f} seconds")
    
    return sound_label, confidence

# Read buffer data from temp.bin
def load_audio_buffer_from_bin(file_path, dtype=np.float32):
    """
    Reads raw audio buffer data from a binary file.
    """
    with open(file_path, "rb") as f:
        buffer = np.frombuffer(f.read(), dtype=dtype)  # Ensure the buffer matches the expected data type
    return buffer


if __name__ == "__main__":
    # Path to the binary file containing raw audio buffer
    buffer_file_path = "total_buffer.bin"  # Replace with the actual file path
    sample_rate = 16000  # Specify the sample rate of the saved buffer (update if necessary)
    
    # Load the audio buffer from temp.bin
    audio_buffer = load_audio_buffer_from_bin(buffer_file_path)
    
    # Process the loaded buffer
    process_audio_buffer(audio_buffer, sample_rate)
