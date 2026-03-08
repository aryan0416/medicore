"use client";

import Link from "next/link";

interface Patient {
  id: string;
  uhid: string;
  firstName: string;
  lastName?: string;
  gender: string;
  phone?: string;
  bloodGroup?: string;
}

export function PatientsTable({ patients }: { patients: Patient[] }) {
  return (
    <div className="border rounded-md">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted">
          <tr className="text-left">
            <th className="p-3">UHID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Gender</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Blood Group</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.uhid}</td>

              <td className="p-3">
                {p.firstName} {p.lastName}
              </td>

              <td className="p-3">{p.gender}</td>

              <td className="p-3">{p.phone || "-"}</td>

              <td className="p-3">{p.bloodGroup || "-"}</td>

              <td className="p-3 text-right">
                <Link
                  href={`/dashboard/patients/${p.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
