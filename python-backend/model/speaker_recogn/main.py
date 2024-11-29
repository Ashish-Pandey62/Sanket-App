import torch
from torch.nn.functional import cosine_similarity
from speechbrain.pretrained import SpeakerRecognition
import librosa

speaker_model = SpeakerRecognition.from_hparams(
    source="speechbrain/spkrec-xvect-voxceleb",
    savedir="pretrained_models/spkrec-xvect-voxceleb"
)

def load_audio(file_path):
    data, sr = librosa.load(file_path, sr=16000) 
    return torch.tensor(data).unsqueeze(0)


database = {
    "Ashish": speaker_model.encode_batch(load_audio("test3.wav")),
    "Ram": speaker_model.encode_batch(load_audio("test.wav")),
}


new_audio_embedding = speaker_model.encode_batch(load_audio("test2.wav"))


similarities = {
    name: cosine_similarity(new_audio_embedding, embedding).mean().item()
    for name, embedding in database.items()
}

best_match = max(similarities.items(), key=lambda x: x[1])
print(f"Best Match: {best_match[0]} with similarity: {best_match[1]}")
