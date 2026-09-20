const priorities = ["Low", "Medium", "High"];
const statuses = ["Pending", "Completed"];

export function validateTask(body, partial = false) {
  const errors = {};

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      errors.title = "Title is required.";
    }
  }

  if (!partial || body.description !== undefined) {
    if (typeof body.description !== "string" || !body.description.trim()) {
      errors.description = "Description is required.";
    }
  }

  if (!partial || body.dueDate !== undefined) {
    if (!body.dueDate || Number.isNaN(new Date(body.dueDate).getTime())) {
      errors.dueDate = "A valid due date is required.";
    } else if (new Date(body.dueDate) < new Date(new Date().toDateString())) {
      errors.dueDate = "Due date cannot be in the past.";
    }
  }

  if (body.priority !== undefined && !priorities.includes(body.priority)) {
    errors.priority = "Priority must be Low, Medium or High.";
  }

  if (body.status !== undefined && !statuses.includes(body.status)) {
    errors.status = "Status must be Pending or Completed.";
  }

  return errors;
}
