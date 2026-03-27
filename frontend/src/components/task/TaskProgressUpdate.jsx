export default function TaskProgressUpdate({ progress, setProgress }) {
  return (
    <div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(e) => setProgress(e.target.value)}
      />
      <p>{progress}%</p>
    </div>
  );
}