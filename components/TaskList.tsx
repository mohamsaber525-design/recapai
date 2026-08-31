"use client";

import { useState } from "react";

type Task = {
  id: string;
  description: string;
  assignee: string | null;
  done: boolean;
};

export default function TaskList({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = async (taskId: string, currentDone: boolean) => {
    // Mise à jour immédiate à l'écran (optimiste)
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !currentDone } : t))
    );

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !currentDone }),
    });

    // Si la sauvegarde échoue, on annule le changement visuel
    if (!res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, done: currentDone } : t))
      );
    }
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="mt-6 rounded-xl border border-[#E4E9F5] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#1E2761]" />
        <h2 className="font-[family-name:var(--font-display)] font-semibold text-[#1E2761]">
          Tâches à faire
        </h2>
        <span className="ml-auto rounded-full bg-[#F7F8FC] px-2.5 py-0.5 text-xs font-medium text-[#5A6A9A]">
          {doneCount} / {tasks.length}
        </span>
      </div>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-start gap-3 rounded-lg border border-[#E4E9F5] p-3 transition-colors ${
              task.done ? "bg-[#F7F8FC]" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id, task.done)}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-[#E4E9F5] accent-[#0F8B8D]"
            />
            <span
              className={`text-sm ${
                task.done ? "text-[#9aa3bd] line-through" : "text-[#1E2761]"
              }`}
            >
              {task.description}
              {task.assignee && (
                <span className="ml-2 rounded-full bg-[#CADCFC]/50 px-2 py-0.5 text-xs font-medium text-[#0F8B8D]">
                  {task.assignee}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}