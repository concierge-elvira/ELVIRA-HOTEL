import { useState, useEffect } from "react";
import { Modal, Button, Textarea, Input } from "../../../../../components/ui";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    aboutUsText: string;
    buttonText: string;
    buttonUrl: string;
  }) => Promise<void>;
  initialData?: {
    aboutUsText: string;
    buttonText: string;
    buttonUrl: string;
  };
}

export function AboutUsModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AboutUsModalProps) {
  const [formData, setFormData] = useState({
    aboutUsText: "",
    buttonText: "",
    buttonUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        aboutUsText: initialData.aboutUsText || "",
        buttonText: initialData.buttonText || "",
        buttonUrl: initialData.buttonUrl || "",
      });
    }
  }, [initialData, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save About Us settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="About Us Section"
      size="lg"
    >
      <div className="space-y-4">
        {/* About Us Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Us Text
          </label>
          <Textarea
            value={formData.aboutUsText}
            onChange={(e) =>
              setFormData({ ...formData, aboutUsText: e.target.value })
            }
            placeholder="Tell guests about your hotel's location, amenities, and what makes it special..."
            rows={6}
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500 mt-1">
            This text will be displayed in the About Us section of your hotel.
          </p>
        </div>

        {/* About Us Button Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Us Button Text
          </label>
          <Input
            value={formData.buttonText}
            onChange={(e) =>
              setFormData({ ...formData, buttonText: e.target.value })
            }
            placeholder="Learn More"
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500 mt-1">
            The text that will appear on the About Us button.
          </p>
        </div>

        {/* About Us Button URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Us Button URL
          </label>
          <Input
            type="url"
            value={formData.buttonUrl}
            onChange={(e) =>
              setFormData({ ...formData, buttonUrl: e.target.value })
            }
            placeholder="https://www.yourhotel.com"
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500 mt-1">
            The URL where the About Us button will redirect to.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
