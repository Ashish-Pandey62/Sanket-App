from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import wave
import os
import optm_tfhub
from uuid import uuid4

def get_temp_file_path():
    return f"./media/{uuid4().hex}.wav"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

total_buffer = []

@app.route("/", methods=["GET"])
def home():
    return jsonify("You have reached the server!"), 200

@socketio.on("storeChunk")
def handle_store_chunk(buffer):
    global total_buffer
    if buffer:
        total_buffer.append(buffer)
        # print(f"Received chunk. Current buffer size: {len(total_buffer)}")

        total_samples = len(total_buffer)
        # print(f"length of total samples: {total_samples}")
        if total_samples > 75:
            # print("Buffer reached 3 seconds, processing...")
            transcription = transcribe_audio()
            socketio.emit("transcription", {"text": transcription})
            total_buffer.clear()

def transcribe_audio():
    global total_buffer
    try: 
        single_buffer = b"".join(total_buffer)

        file_path = get_temp_file_path()
        save_as_wav(single_buffer, file_path)
        
        sound_label, confidence = optm_tfhub.process_audio_file(file_path)
        if sound_label and confidence:
            socketio.emit("alert", {"sound_label": sound_label})
            
        # print(f"Detected Sound: {sound_label} with confidence: {confidence:.3f}")
        transcription = "some random text that will be provided by the model"

        # if os.path.exists(file_path):
        #     os.remove(file_path)
            # print(f"Deleted temporary file: {file_path}")

        return transcription

    except Exception as e:
        print(f"Error transcibing audio: {e}", exec_info=True)
        return "Error during transcription"

def save_as_wav(buffer, file_path):
    sample_rate = 16000  # Sample rate in Hz
    num_channels = 1  # Mono
    bit_depth = 16  # 16 bits per sample

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with wave.open(file_path, 'wb') as wf:
        wf.setnchannels(num_channels)
        wf.setsampwidth(bit_depth // 8)
        wf.setframerate(sample_rate)
        wf.writeframes(buffer)

@socketio.on("wakeWord")
def handle_wake_word():
    print("Heard wake word...")
    socketio.emit("vibrate")

if __name__ == "__main__":
    port = 3000
    print(f"Server running on http://localhost:{port}")
    socketio.run(app, host="0.0.0.0", port=port)