import React, {
  useState,
  useEffect,
} from "react";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { isEqual } from "lodash";
import { DataForm } from "@/components/DataForm";
import validator from "@rjsf/validator-ajv8";
import { ResumeSchema } from "@/components/Vitae/provider";
import DEFAULT_RESUME from "@/assets/default-resume.json";
import RESUME_JSON_SCHEMA from "./resume-schema.json";

export type ResumeSchemaFormProps = {
  existingResume: ResumeSchema;
  onUpdateResume: (newData: ResumeSchema) => void | Promise<void>
}

const ResumeJsonSchema = RESUME_JSON_SCHEMA;

const ResumeJsonUiSchema: UiSchema = {
  basic: {
    summary: {
      "ui:widget": "textarea"
    },
  },
  work: {
    items: {
      summary: {
        "ui:widget": "textarea"
      },
      icon: {
        "ui:options": {
          accept: '.png, .jpg, .jpeg, .svg'
        }
      },
      highlights: {
        items: { "ui:widget": "textarea" }
      }
    }
  },
  volunteer: {
    items: {
      summary: {
        "ui:widget": "textarea"
      },
      icon: {
        "ui:options": {
          accept: '.png, .jpg, .jpeg, .svg'
        }
      },
      highlights: {
        items: { "ui:widget": "textarea" }
      }
    }
  }
}

const ResumeSchemaForm: React.FC<ResumeSchemaFormProps> = ({ existingResume, onUpdateResume }) => {
  const [formData, setFormData] = useState<ResumeSchema>(DEFAULT_RESUME);

  useEffect(() => {
    if (existingResume) {
      setFormData(existingResume);
    }
  }, [existingResume]);

  return (
    <DataForm schema={ResumeJsonSchema as RJSFSchema} uiSchema={ResumeJsonUiSchema} validator={validator} formData={formData} onChange={({ formData: newData }) => {
      setFormData(newData);
      if (!isEqual(newData, existingResume)) {
        onUpdateResume(newData)
      }
    }} customSubmit />
  );
};

export default ResumeSchemaForm;
