import { useRef, useState } from "react";
import "./App.css";

function App() {
	const [isRecording, setIsRecording] = useState(false);
	const [audioUrl, setAudioUrl] = useState(null);
	const [mediaRecorder, setMediaRecorder] = useState(null);
	const audioChunksRef = useRef([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream);
			setMediaRecorder(recorder);

			recorder.ondataavailable = (event) => {
				audioChunksRef.current.push(event.data);
			};

			recorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, {
					type: "audio/wav",
				});
				const audioUrl = URL.createObjectURL(audioBlob);
				setAudioUrl(audioUrl);
				audioChunksRef.current = [];
			};

			recorder.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Error accessing microphone:", err);
		}
	};

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
			setIsRecording(false);
		}
	};
	return (
		<div>
			<h1>Audio Recorder</h1>
			{isRecording ? (
				<button onClick={stopRecording}>Stop Recording</button>
			) : (
				<button onClick={startRecording}>Start Recording</button>
			)}

			{audioUrl && (
				<div>
					<h2>Recording complete:</h2>
					<audio controls src={audioUrl}></audio>
					<a href={audioUrl} download="recording.wav">
						Download Recording
					</a>
				</div>
			)}
		</div>
	);
}

export default App;
