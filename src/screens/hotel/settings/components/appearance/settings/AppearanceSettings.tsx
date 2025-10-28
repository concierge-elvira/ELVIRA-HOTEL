/**
 * Appearance Settings Component
 *
 * Main settings panel for customizing guest dashboard appearance
 */

import React, { useState } from "react";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { TypographySettings } from "./sections/TypographySettings";
import { ColorSettings } from "./sections/ColorSettings";
import { IconSettings } from "./sections/IconSettings";
import { StayCardSettings } from "./sections/StayCardSettings";
import { AboutUsSettings } from "./sections/AboutUsSettings";
import { ShapeSettings } from "./sections/ShapeSettings";
import { useAppearance } from "../contexts/AppearanceContext";
import { ConfirmationModal } from "../../../../../../components/ui/modals/ConfirmationModal";
import { Button } from "../../../../../../components/ui/buttons/Button";
import type { AppearanceConfig } from "../types";

// Export action buttons for use in tab bar
export const AppearanceActions: React.FC = () => {
  const { saveConfig, resetConfig, saving } = useAppearance();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const handleSave = async () => {
    setShowSaveConfirm(false);
    await saveConfig();
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    resetConfig();
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowResetConfirm(true)}
          disabled={saving}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowSaveConfirm(true)}
          loading={saving}
          leftIcon={!saving ? <Save className="w-4 h-4" /> : undefined}
        >
          Save Changes
        </Button>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset to Default Settings"
        message="Are you sure you want to reset all appearance settings to their default values? This action will not be saved until you click 'Save Changes'."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSave}
        title="Save Appearance Settings"
        message="Are you sure you want to save these appearance settings? They will be applied to your hotel's guest dashboard."
        confirmText="Save Changes"
        cancelText="Cancel"
        variant="primary"
        loading={saving}
      />
    </>
  );
};

export const AppearanceSettings: React.FC = () => {
  const { config, updateConfig, loading } = useAppearance();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Typography */}
      <TypographySettings
        config={config.typography}
        onChange={(typography: AppearanceConfig["typography"]) =>
          updateConfig({ typography })
        }
      />

      {/* Colors */}
      <ColorSettings
        config={config.colors}
        onChange={(colors: AppearanceConfig["colors"]) =>
          updateConfig({ colors })
        }
      />

      {/* Stay Display Card */}
      <StayCardSettings
        config={config.stayCard}
        onChange={(stayCard: AppearanceConfig["stayCard"]) =>
          updateConfig({ stayCard })
        }
      />

      {/* About Us Section */}
      <AboutUsSettings
        config={config.aboutUs}
        onChange={(aboutUs: AppearanceConfig["aboutUs"]) =>
          updateConfig({ aboutUs })
        }
      />

      {/* Icons */}
      <IconSettings
        config={config.icons}
        onChange={(icons: AppearanceConfig["icons"]) => updateConfig({ icons })}
      />

      {/* Shapes & Borders */}
      <ShapeSettings
        config={config.shapes}
        onChange={(shapes: AppearanceConfig["shapes"]) =>
          updateConfig({ shapes })
        }
      />
    </div>
  );
};
