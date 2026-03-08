"use client";

export function AdminUsersTableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">
                <div className="h-4 w-32 bg-muted rounded" />
              </td>

              <td className="p-3">
                <div className="h-4 w-40 bg-muted rounded" />
              </td>

              <td className="p-3">
                <div className="h-4 w-24 bg-muted rounded" />
              </td>

              <td className="p-3">
                <div className="h-4 w-20 bg-muted rounded" />
              </td>

              <td className="p-3 text-right">
                <div className="h-4 w-16 bg-muted rounded ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
