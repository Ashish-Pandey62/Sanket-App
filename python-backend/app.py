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
import base64
from model.wakeWord2.main import wakeword_detection


# Configure logging
logging.basicConfig(level=logging.INFO)

# Helper function to generate unique temporary file paths
def get_temp_file_path():
    return f"./media/{uuid4().hex}.wav"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

chunk_queue = Queue()  # Queue for incoming audio chunks
user_enrollment = [] # Array for user enrollment buffer
wakeword_queue = Queue()
processing = False  # Flag to indicate if processing is active
processing_wakeword = False
processing_lock = Lock()  # Lock for concurrency

@app.route("/", methods=["GET"])
def home():
    return jsonify("You have reached the server!"), 200

@app.route("/delete", methods=["POST"])
def delete_user():
    try:
        data = request.json
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        gender = data.get('gender')
        file_path = f'/home/gyaneshwar/programming/hackathon/Sanket-App/python-backend/enrollment/{firstName}_{lastName}_{gender}.wav'
        logging.info(file_path)
        os.remove(file_path)
        return jsonify({"status":"success"}), 200

    except Exception as e:
        logging.error(f"Error retrieving enrolled users: {e}")
        return jsonify({"error": "Failed to retrieve enrolled users"}), 500

@app.route("/users", methods=["GET"])
def get_users():
    try:
        # Check if enrollment directory exists
        enrollment_dir = './enrollment'
        if not os.path.exists(enrollment_dir):
            return jsonify([]), 200

        # Get all .wav files in the directory
        enrolled_users = []
        for filename in os.listdir(enrollment_dir):
            if filename.endswith('.wav'):
                # Remove .wav extension and split the filename
                name_parts = filename[:-4].split('_')
                
                # Ensure we have 3 parts (firstName, lastName, gender)
                if len(name_parts) == 3:
                    enrolled_users.append({
                        'firstName': name_parts[0],
                        'lastName': name_parts[1],
                        'gender': name_parts[2]
                    })

        return jsonify(enrolled_users), 200

    except Exception as e:
        logging.error(f"Error retrieving enrolled users: {e}")
        return jsonify({"error": "Failed to retrieve enrolled users"}), 500

@app.route("/registeredUsers", methods=["GET"])
def get_registered_users():
    try:
        user_files = os.listdir("/home/gyaneshwar/programming/hackathon/Sanket-App/python-backend/enrollment")
        users = []
        for filename in user_files:
            name_without_extension = filename.replace('.wav', '')
            # Split by underscore
            parts = name_without_extension.split('_')
            users.append ({
                'firstName': parts[0],
                'lastName': parts[1],
                'gender': parts[2]
            })
        return jsonify({
            "users":users
        }), 200

    except Exception as e:
        logging.error(f"Error retrieving registered users: {e}")
        return jsonify({"error": "Failed to retrieve registered users"}), 500

@app.route("/sound", methods=["POST"])
def get_sound():
    try:
        # Use request.json for JSON payloads
        data = request.json
        
        # If using form data, use request.form instead
        # data = request.form

        firstName = data.get('firstName')
        lastName = data.get('lastName')
        gender = data.get('gender')
        
        # Correct variable name (was file_path, now file_name)
        file_name = f"./enrollment/{firstName}_{lastName}_{gender}.wav"
        
        if not os.path.exists(file_name):
            return jsonify({"error": "Audio file not found"}), 404

        # Read the file and encode to base64
        with open(file_name, 'rb') as audio_file:
            audio_data = audio_file.read()
            base64_audio = base64.b64encode(audio_data).decode('utf-8')

        # Return the base64 encoded audio
        return jsonify({
            "audioData": base64_audio
        }), 200

    except Exception as e:
        logging.error(f"Error retrieving user audio: {e}")
        return jsonify({"error": "Failed to retrieve audio file"}), 500

@socketio.on("storeChunk")
def handle_store_chunk(buffer):
    if buffer:
        chunk_queue.put(buffer)  # Add the chunk to the queue
        wakeword_queue.put(buffer) # Add the chunk to wakeword_queue
        logging.info(f"Received chunk. Queue size: {chunk_queue.qsize()}")

@socketio.on("storeThis")
def handle_store_this(buffer):
    if buffer:
        user_enrollment.append(buffer)
        logging.info(f"Received enrollment buffer. Array size: {len(user_enrollment)}")

@socketio.on("userLabel")
def handle_user_label(data): # data -> {firstName, lastName, gender}
    if data:
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        gender = data.get('gender')
        single_buffer = b"".join(user_enrollment)
        save_as_wav(single_buffer, f"./enrollment/{firstName}_{lastName}_{gender}.wav")
        socketio.emit("enrollmentSuccess")
        user_enrollment.clear()
        

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

# Background worker thread to process the wakeword queue
def process_wakeword_queue():
    global processing_wakeword
    while True:
        try:
            # Collect chunks from the queue into a buffer
            buffer = []
            for _ in range(25):  # Process in batches of 25 chunks
                wakeword_chunk = wakeword_queue.get(timeout=1)  # Wait for a chunk
                buffer.append(wakeword_chunk)
            
            # Process the collected buffer
            if buffer:
                single_buffer = b"".join(buffer)
                file_path = get_temp_file_path()
                save_as_wav(single_buffer, file_path)
                logging.info(f"Temporary file created: {file_path}")
                matched_key = wakeword_detection(file_path) # wakeword detection
                logging.info(matched_key)
                if matched_key!=None:
                    socketio.emit("wakeWord", {"word":matched_key})
                    
                # Delete the temporary file after processing
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logging.info(f"Deleted temporary file: {file_path}")

        except Empty:
            # No chunks available, wait briefly before checking again
            time.sleep(0.1)

def process_audio(single_buffer):
    try:
        logging.info("Starting audio processing...")
        file_path = get_temp_file_path()
        save_as_wav(single_buffer, file_path)
        logging.info(f"Temporary file created: {file_path}")

        sound_label, confidence = optm_tfhub.process_audio_file(file_path) # alert detection
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
    Thread(target=process_queue, daemon=True).start()
    Thread(target=process_wakeword_queue, daemon=True).start()

    port = 3000
    logging.info(f"Server running on http://localhost:{port}")
    socketio.run(app, host="0.0.0.0", port=port)
