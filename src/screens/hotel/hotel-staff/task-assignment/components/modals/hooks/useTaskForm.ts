import { useState, useEffect } from "react";
import type { Database } from "../../../../../../../types/database";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

export interface TaskFormData {
  title: string;
  description: string;
  type: string;
  priority: string;
  staffId: string;
  status: string;
  dueDate: string;
  dueTime: string;
}

export interface TaskFormErrors {
  title?: string;
  priority?: string;
  [key: string]: string | undefined;
}

export function useTaskForm(editData: TaskRow | null) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    type: "",
    priority: "Medium",
    staffId: "",
    status: "PENDING",
    dueDate: "",
    dueTime: "",
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        description: editData.description || "",
        type: editData.type || "",
        priority: editData.priority,
        staffId: editData.staff_id || "",
        status: editData.status,
        dueDate: editData.due_date || "",
        dueTime: editData.due_time || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "",
        priority: "Medium",
        staffId: "",
        status: "PENDING",
        dueDate: "",
        dueTime: "",
      });
    }
  }, [editData]);

  const validateForm = (): boolean => {
    const newErrors: TaskFormErrors = {};
    let isValid = true;

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
      isValid = false;
    }

    // Validate priority
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      priority: "Medium",
      staffId: "",
      status: "PENDING",
      dueDate: "",
      dueTime: "",
    });
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    validateForm,
    resetForm,
  };
}
