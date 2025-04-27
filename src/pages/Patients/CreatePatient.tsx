import { ChangeEvent, useState } from "react";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RadioButtons from "../../components/form/form-elements/RadioButtons";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import CheckboxComponents from "../../components/form/form-elements/CheckboxComponents";
import FormInput from "../../components/form/form-elements/FormInput";
import Button from "../../components/ui/button/Button";
import DateOfBirthInput from "../../components/form/form-elements/DateOfBirthInput";
import MobileNumberInput from "../../components/form/form-elements/MobileNumberInput";
import Select from "../../components/form/Select";

export default function PatientRegistrationForm() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  console.log("Base URL:", baseUrl);
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "MALE",
    mobile_number: "",
    email: "",
    address: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    relationship_to_emergency_contact: "",
    primary_physician_name: "",
    primary_physician_contact: "",
    health_insurance_provider: "",
    insurance_policy_number: "",
    insurance_card_upload: "",
    id_proof_upload: "",
    preferred_language: "",
    ethnicity: "",
    communication_preference: "",
    consent_for_data_usage: false,
    consent_for_processing: false,
    consent_for_third_party_sharing: false,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Communication Preference:", formData.communication_preference);
    if (
      !["EMAIL", "PHONE", "SMS"].includes(formData.communication_preference)
    ) {
      console.error("Invalid communication preference");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      console.log("Base URL:", baseUrl);
      const response = await axios.post(
        `${baseUrl}/patients/patient-registrations/`,
        {
          ...formData,
          date_of_birth: new Date(formData.date_of_birth).toISOString(),
        }
      );
      console.log("Patient registered successfully:", response.data);
    } catch (error) {
      console.error("Error registering patient:", error);
    }
  };

  return (
    <div className="p-6">
      <PageMeta
        title="Patient Registration | CareMan"
        description="Register a new patient in the system"
      />
      <PageBreadcrumb pageTitle="Patient Registration" />

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-strokedark dark:bg-boxdark">
        <form
          className="grid grid-cols-1 gap-6 xl:grid-cols-2"
          onSubmit={handleSubmit}
        >
          {/* Patient Information */}
          <div className="col-span-1 xl:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Patient Information
            </h2>
          </div>

          <FormInput
            label="Full Name"
            id="full_name"
            placeholder="Enter full name"
            value={formData.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
          />
          <DateOfBirthInput
            label="Date of Birth"
            id="date_of_birth"
            value={formData.date_of_birth}
            onChange={(date: Date) =>
              handleChange("date_of_birth", date.toISOString())
            }
          />
          <RadioButtons
            label="Gender"
            name="gender"
            options={[
              { label: "Male", value: "MALE" },
              { label: "Female", value: "FEMALE" },
              { label: "Other", value: "OTHER" },
            ]}
            defaultValue={formData.gender}
            onChange={(value) => handleChange("gender", value)}
          />
          <MobileNumberInput
            label="Mobile Number"
            id="mobile_number"
            value={formData.mobile_number}
            onChange={(value) => handleChange("mobile_number", value)}
          />
          <TextAreaInput
            label="Address"
            id="address"
            value={formData.address}
            placeholder="Enter address"
            onChange={(value) => handleChange("address", value)}
            rows={4}
          />

          <FormInput
            label="Email"
            id="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <FormInput
            label="City"
            id="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
          <FormInput
            label="State / Province"
            id="state_province"
            placeholder="Enter state or province"
            value={formData.state_province}
            onChange={(e) => handleChange("state_province", e.target.value)}
          />
          <FormInput
            label="Postal Code"
            id="postal_code"
            placeholder="Enter postal code"
            value={formData.postal_code}
            onChange={(e) => handleChange("postal_code", e.target.value)}
          />
          <FormInput
            label="Country"
            id="country"
            placeholder="Enter country"
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
          />

          {/* Emergency Contact */}
          <div className="col-span-1 xl:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
              Emergency Contact
            </h2>
          </div>

          <FormInput
            label="Emergency Contact Name"
            id="emergency_contact_name"
            placeholder="Enter emergency contact name"
            value={formData.emergency_contact_name}
            onChange={(e) =>
              handleChange("emergency_contact_name", e.target.value)
            }
          />
          <FormInput
            label="Emergency Contact Number"
            id="emergency_contact_number"
            placeholder="Enter emergency contact number"
            value={formData.emergency_contact_number}
            onChange={(e) =>
              handleChange("emergency_contact_number", e.target.value)
            }
          />
          <FormInput
            label="Relationship to Emergency Contact"
            id="relationship_to_emergency_contact"
            placeholder="Enter relationship"
            value={formData.relationship_to_emergency_contact}
            onChange={(e) =>
              handleChange("relationship_to_emergency_contact", e.target.value)
            }
          />

          {/* Primary Physician */}
          <div className="col-span-1 xl:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
              Primary Physician
            </h2>
          </div>

          <FormInput
            label="Primary Physician Name"
            id="primary_physician_name"
            placeholder="Enter physician name"
            value={formData.primary_physician_name}
            onChange={(e) =>
              handleChange("primary_physician_name", e.target.value)
            }
          />
          <FormInput
            label="Primary Physician Contact"
            id="primary_physician_contact"
            placeholder="Enter physician contact"
            value={formData.primary_physician_contact}
            onChange={(e) =>
              handleChange("primary_physician_contact", e.target.value)
            }
          />

          {/* Insurance Information */}
          <div className="col-span-1 xl:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
              Insurance Information
            </h2>
          </div>

          <FormInput
            label="Health Insurance Provider"
            id="health_insurance_provider"
            placeholder="Enter insurance provider"
            value={formData.health_insurance_provider}
            onChange={(e) =>
              handleChange("health_insurance_provider", e.target.value)
            }
          />
          <FormInput
            label="Insurance Policy Number"
            id="insurance_policy_number"
            placeholder="Enter policy number"
            value={formData.insurance_policy_number}
            onChange={(e) =>
              handleChange("insurance_policy_number", e.target.value)
            }
          />

          <DropzoneComponent
            label="Upload Insurance Card"
            onUpload={(url) => handleChange("insurance_card_upload", url)}
          />
          <DropzoneComponent
            label="Upload ID Proof"
            onUpload={(url) => handleChange("id_proof_upload", url)}
          />

          {/* Preferences */}
          <div className="col-span-1 xl:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
              Preferences
            </h2>
          </div>

          <FormInput
            label="Preferred Language"
            id="preferred_language"
            placeholder="Enter preferred language"
            value={formData.preferred_language}
            onChange={(e) => handleChange("preferred_language", e.target.value)}
          />
          {/* Communication Preference Select */}
          <div>
            <label htmlFor="communication_preference">
              Communication Preference
            </label>
            <Select
              id="communication_preference"
              value={formData.communication_preference}
              options={[
                { value: "EMAIL", label: "Email" },
                { value: "PHONE", label: "Phone" },
                { value: "SMS", label: "SMS" },
              ]}
              onChange={(value) =>
                handleChange("communication_preference", value)
              }
              className="mb-4 mt-1"
            />
          </div>
          <FormInput
            label="Ethnicity"
            id="ethnicity"
            placeholder="Enter ethnicity"
            value={formData.ethnicity}
            onChange={(e) => handleChange("ethnicity", e.target.value)}
          />

          {/* Consent */}
          <div className="col-span-1 xl:col-span-2 mt-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <CheckboxComponents
                  label="Consent for Data Usage"
                  id="consent_for_data_usage"
                  checked={formData.consent_for_data_usage}
                  onChange={(e) =>
                    handleChange("consent_for_data_usage", e.target.checked)
                  }
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">
                  I agree to the collection and usage of my personal data for
                  providing medical services.
                </p>
              </div>

              <div className="space-y-1">
                <CheckboxComponents
                  label="Consent for Processing"
                  id="consent_for_processing"
                  checked={formData.consent_for_processing}
                  onChange={(e) =>
                    handleChange("consent_for_processing", e.target.checked)
                  }
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">
                  I authorize the processing of my data in compliance with
                  healthcare regulations and privacy policies.
                </p>
              </div>

              <div className="space-y-1">
                <CheckboxComponents
                  label="Consent for Third-Party Sharing"
                  id="consent_for_third_party_sharing"
                  checked={formData.consent_for_third_party_sharing}
                  onChange={(e) =>
                    handleChange(
                      "consent_for_third_party_sharing",
                      e.target.checked
                    )
                  }
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">
                  I consent to the sharing of my data with authorized third
                  parties for medical purposes only.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <Button
              type="submit"
              size="md"
              variant="primary"
              className="w-full max-w-xs"
            >
              Register Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
