"use client";

import { Trash2 } from "lucide-react";

export default function DeleteJobButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm("Delete this job permanently? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
      title="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
