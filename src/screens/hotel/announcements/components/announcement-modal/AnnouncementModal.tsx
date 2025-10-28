import { useEffect, useState } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../components/ui/modalform";
import { BasicInfoSection } from "./BasicInfoSection";
import { DescriptionSection } from "./DescriptionSection";
import type {
  AnnouncementFormData,
  FormErrors,
  AnnouncementModalProps,
} from "./types";

export function AnnouncementModal({
  isOpen,
  onClose,
  mode,
  announcement,
  onSubmit,
  onEdit,
  onDelete,
}: AnnouncementModalProps) {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    description: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);

  // Reset form when modal opens/closes or announcement changes
  useEffect(() => {
    if (isOpen && announcement) {
      setFormData({
        title: announcement.title || "",
        description: announcement.description || "",
        isActive: announcement.is_active,
      });
    } else if (isOpen && !announcement) {
      setFormData({
        title: "",
        description: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [announcement, isOpen]);

  const handleFieldChange = (
    field: keyof AnnouncementFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (mode === "view") return;

    if (!validateForm()) return;

    setIsPending(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add Announcement";
      case "edit":
        return "Edit Announcement";
      case "view":
        return "Announcement Details";
      default:
        return "Announcement";
    }
  };

  const getSubmitLabel = () => {
    return mode === "edit" ? "Save Changes" : "Add Announcement";
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="md"
      footer={
        <ModalFormActions
          mode={mode}
          onCancel={onClose}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={getSubmitLabel()}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
    >
      <BasicInfoSection
        formData={formData}
        errors={errors}
        mode={mode}
        onChange={handleFieldChange}
      />

      <DescriptionSection
        formData={formData}
        errors={errors}
        mode={mode}
        onChange={handleFieldChange}
      />
    </ModalForm>
  );
}
