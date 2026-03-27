export default function NotificationList({ data }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      {data.map((n) => (
        <p key={n.id} className="border-b py-2">
          {n.message}
        </p>
      ))}
    </div>
  );
}