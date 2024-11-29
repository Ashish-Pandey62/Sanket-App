import torch
from torch.nn.functional import cosine_similarity
from speechbrain.pretrained import SpeakerRecognition
import librosa
import os
import torch.nn.functional as F

speaker_model = SpeakerRecognition.from_hparams(
    source="speechbrain/spkrec-xvect-voxceleb",
    savedir="pretrained_models/spkrec-xvect-voxceleb"
)

database = {}

def give_path(file_name):
    return os.path.join(f'/home/gyaneshwar/programming/hackathon/Sanket-App/python-backend/enrollment/{file_name}')

def recongnizer(file_name):
    print(f"Model is looking for file at {file_name}")
    feed_db_with_enrollment()  # Populate the database with enrolled speakers
    new_audio_embedding = normalize(speaker_model.encode_batch(load_audio(file_name)))  # Get the new audio embedding
    
    # Calculate similarities with each entry in the database
    similarities = {
        name: cosine_similarity(new_audio_embedding, embedding).mean().item()  # Cosine similarity as confidence score
        for name, embedding in database.items()
    }

    # Find the best match based on similarity score
    best_match = max(similarities.items(), key=lambda x: x[1])
    for name, confidence in similarities.items():
        print(f"{name}: {confidence:.3f}")
    # Print the best match and its confidence (similarity score)
    print(f"Best Match: {best_match[0]} with confidence: {best_match[1]}")

    # Return the best match and its confidence score
    return f"Best Match: {best_match[0]} with confidence: {best_match[1]}"

    

def load_audio(file_path):
    data, sr = librosa.load(file_path, sr=16000) 
    return torch.tensor(data).unsqueeze(0)

def normalize(embedding):
    return F.normalize(embedding, p=2, dim=1)


def feed_db_with_enrollment():
    enrollment_dir = os.path.join("/home/gyaneshwar/programming/hackathon/Sanket-App/python-backend/enrollment/")
    if not os.path.exists(enrollment_dir):
        print("No directory found.")
        return

    # Clear the existing database
    database.clear()

    # Populate the database with new enrollment data
    for filename in os.listdir(enrollment_dir):
        if filename.endswith('.wav'):  # Ensure only .wav files are processed
            name_without_extension = filename.replace('.wav', '')
            parts = name_without_extension.split('_')
            speaker_id = f"{parts[0]}_{parts[1]}_{parts[2]}"
            database[speaker_id] = speaker_model.encode_batch(load_audio(give_path(filename)))

    print(f"Database populated with {len(database)} speakers.") 
    

if __name__ == "__main__":
    recongnizer("darshan_bolyo.wav")
