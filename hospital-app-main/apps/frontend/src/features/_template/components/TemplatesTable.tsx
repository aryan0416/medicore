"use client";

interface Template {
  id: string;
  name: string;
}

export function TemplatesTable({ items }: { items: Template[] }) {
  return (
    <div className="border rounded-md">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted">
          <tr className="text-left">
            <th className="p-3">Name</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">{item.name}</td>

              <td className="p-3 text-right">View</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
