import { ModalFormSection } from "../../../../../../../components/ui/modalform";

interface StaffGDPRSectionProps {
  mode: "create" | "edit" | "view";
  gdprConsent: boolean;
  onFieldChange?: (field: string, value: boolean) => void;
  disabled?: boolean;
}

export function StaffGDPRSection({
  mode,
  gdprConsent,
  onFieldChange,
  disabled = false,
}: StaffGDPRSectionProps) {
  const isViewMode = mode === "view";

  return (
    <ModalFormSection title="Data Protection">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="gdprConsent"
            checked={gdprConsent}
            onChange={(e) => onFieldChange?.("gdprConsent", e.target.checked)}
            disabled={disabled || isViewMode}
            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label
            htmlFor="gdprConsent"
            className="text-sm text-gray-700 flex-1 cursor-pointer select-none"
          >
            <span className="font-medium block mb-1">
              GDPR Consent Required
            </span>
            <span className="text-gray-600">
              I confirm that I have the legal authority to process and store
              this staff member's personal data in accordance with GDPR
              regulations. The data will be retained for 7 years from the date
              of entry or as required by law.
            </span>
          </label>
        </div>
        {!isViewMode && !gdprConsent && (
          <p className="text-sm text-red-600 mt-2 ml-7">
            You must accept responsibility for data processing to continue.
          </p>
        )}
      </div>
    </ModalFormSection>
  );
}
