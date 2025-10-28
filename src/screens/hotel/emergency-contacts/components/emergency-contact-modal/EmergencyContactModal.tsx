import { useEffect, useState } from "react";
import {
  ModalForm,
  ModalFormActions,
} from "../../../../../components/ui/modalform";
import { ContactInfoSection } from "./ContactInfoSection";
import type {
  EmergencyContactFormData,
  FormErrors,
  EmergencyContactModalProps,
} from "./types";

export function EmergencyContactModal({
  isOpen,
  onClose,
  mode,
  contact,
  onSubmit,
  onEdit,
  onDelete,
}: EmergencyContactModalProps) {
  const [formData, setFormData] = useState<EmergencyContactFormData>({
    contactName: "",
    phoneNumber: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);

  // Reset form when modal opens/closes or contact changes
  useEffect(() => {
    if (isOpen && contact) {
      setFormData({
        contactName: contact.contact_name || "",
        phoneNumber: contact.phone_number || "",
        isActive: contact.is_active,
      });
    } else if (isOpen && !contact) {
      setFormData({
        contactName: "",
        phoneNumber: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const handleFieldChange = (
    field: keyof EmergencyContactFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
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
        return "Add Emergency Contact";
      case "edit":
        return "Edit Emergency Contact";
      case "view":
        return "Emergency Contact Details";
      default:
        return "Emergency Contact";
    }
  };

  const getSubmitLabel = () => {
    return mode === "edit" ? "Save Changes" : "Add Contact";
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
      <ContactInfoSection
        formData={formData}
        errors={errors}
        mode={mode}
        onChange={handleFieldChange}
      />
    </ModalForm>
  );
}
