export default function TaskForm({ form, setForm }) {
  return (
    <div className="space-y-3">
      <input
        placeholder="Title"
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </div>
  );
}