# Spec: tasks

- A task has a title (1-200 characters after trimming), a priority (low, normal, high), an optional due date (YYYY-MM-DD) and tags.
- Tags are lowercased, trimmed and unique per task.
- The list shows open tasks first, then by priority (high first), then by the earliest due date.
- An open task whose due date is before today (UTC) is overdue and shown in red.
- Tasks persist in the browser's localStorage. There is no server-side storage.
