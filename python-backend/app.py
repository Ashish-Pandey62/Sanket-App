from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import wave
import os
import optm_tfhub
from uuid import uuid4
from threading import Thread, Lock
from queue import Queue, Empty
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)

# Helper function to generate unique temporary file paths
def get_temp_file_path():
    return f"./media/{uuid4().hex}.wav"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

chunk_queue = Queue()  # Queue for incoming audio chunks
processing = False  # Flag to indicate if processing is active
processing_lock = Lock()  # Lock for concurrency

@app.route("/", methods=["GET"])
def home():
    return jsonify("You have reached the server!"), 200

@socketio.on("storeChunk")
def handle_store_chunk(buffer):
    if buffer:
        chunk_queue.put(buffer)  # Add the chunk to the queue
        logging.info(f"Received chunk. Queue size: {chunk_queue.qsize()}")

# Background worker thread to process the queue
def process_queue():
    global processing
    while True:
        try:
            # Collect chunks from the queue into a buffer
            buffer = []
            for _ in range(25):  # Process in batches of 25 chunks
                chunk = chunk_queue.get(timeout=1)  # Wait for a chunk
                buffer.append(chunk)
            
            # Process the collected buffer
            if buffer:
                single_buffer = b"".join(buffer)
                process_audio(single_buffer)

        except Empty:
            # No chunks available, wait briefly before checking again
            time.sleep(0.1)

def process_audio(single_buffer):
    try:
        logging.info("Starting audio processing...")
        file_path = get_temp_file_path()
        save_as_wav(single_buffer, file_path)
        logging.info(f"Temporary file created: {file_path}")

        sound_label, confidence = optm_tfhub.process_audio_file(file_path)
        if sound_label != "no sound detected" and confidence:
            socketio.emit("alert", {"sound_label": sound_label})
            logging.info(f"Detected Sound: {sound_label} with confidence: {confidence:.3f}")

        # Delete the temporary file after processing
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Deleted temporary file: {file_path}")

    except Exception as e:
        logging.error(f"Error processing audio: {e}", exc_info=True)

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
    logging.info("Heard wake word...")
    socketio.emit("vibrate")

if __name__ == "__main__":
    # Start the background worker
    worker_thread = Thread(target=process_queue, daemon=True)
    worker_thread.start()

    port = 3000
    logging.info(f"Server running on http://localhost:{port}")
    socketio.run(app, host="0.0.0.0", port=port)
