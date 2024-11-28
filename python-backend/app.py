from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import wave
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

total_buffer = []

@app.route("/", methods=["GET"])
def home():
    return jsonify("You have reached the server!"), 200

@app.route("/save", methods=["GET"])
def save():
    global total_buffer

    if not total_buffer:
        return jsonify("No data available to save."), 400

    single_buffer = b"".join(total_buffer)

    # WAV file parameters
    sample_rate = 16000  # Sample rate in Hz
    num_channels = 1  # Mono
    bit_depth = 16  # 16 bits per sample

    # File path to save
    file_path = "./media/record.wav"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    try:
        with wave.open(file_path, 'wb') as wf:
            wf.setnchannels(num_channels)
            wf.setsampwidth(bit_depth // 8)
            wf.setframerate(sample_rate)
            wf.writeframes(single_buffer)

        return jsonify("You just saved the file!"), 200

    except Exception as e:
        return jsonify(f"Error saving file: {str(e)}"), 500

@socketio.on("storeChunk")
def handle_store_chunk(buffer):
    global total_buffer
    if buffer:
        total_buffer.append(buffer)
        print("Stored buffer chunk.")

@socketio.on("wakeWord")
def handle_wake_word():
    print("Heard wake word...")
    socketio.emit("vibrate")

if __name__ == "__main__":
    port = 3000
    print(f"Server running on http://localhost:{port}")
    socketio.run(app, host="0.0.0.0", port=port)
