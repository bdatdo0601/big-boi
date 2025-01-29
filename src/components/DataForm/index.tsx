import JSONSchemaForm, { FormProps } from '@rjsf/core';

import {
  FieldErrorProps,
  FieldTemplateProps,
  IconButtonProps,
  ObjectFieldTemplateProps,
  RegistryWidgetsType,
  WidgetProps,
} from '@rjsf/utils';

import { cn } from '@/utils';
import { get, isEmpty, merge, pick } from 'lodash';
import { Refresh } from '@mui/icons-material';

const Input = (props: React.ComponentProps<any>) => (
  <input {...props} className="border border-gray-300 rounded-md p-2 w-full text-input" />
)

const widgets: RegistryWidgetsType = {
  TextWidget: (props: WidgetProps) => {
    const { value, onChange, name, required, placeholder, label } = props;
    return (
      <Input
        placeholder={placeholder || label || name}
        value={value || ''}
        onChange={(e: any) => onChange(e.target.value)}
        name={name}
        required={required}
      />
    );
  },

  DateWidget: (props: WidgetProps) => {
    const { value, onChange, name, required, placeholder } = props;
    return (
      <Input
        type="date"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e: any) => onChange(e.target.value)}
        name={name}
        required={required}
      />
    );
  },

  EmailWidget: (props: WidgetProps) => {
    const { value, onChange, name, label, required, placeholder } = props;
    return (
      <Input
        type="email"
        placeholder={placeholder || label || name}
        value={value || ''}
        onChange={(e: any) => onChange(e.target.value)}
        name={name}
        required={required}
      />
    );
  },

  PasswordWidget: (props: WidgetProps) => {
    const { value, onChange, name, required, placeholder } = props;
    return (
      <Input
        type="password"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e: any) => onChange(e.target.value)}
        name={name}
        required={required}
      />
    );
  },

  FileWidget: (props: WidgetProps) => {
    const { onChange, multiple, value } = props;
    const accept = get(props, 'options.accept');
    return (
      <Input
        type="file"
        className={cn('max-w-full')}
        {...(pick(props, ['onBlur', 'onFocus', 'disabled', 'multiple']) as any)}
        value={value.filter((item: any) => !isEmpty(item))}
        onValueChange={(files: File[]) => {
          onChange(files.map((file) => file));
        }}
        multiple={multiple}
        accept={accept}
        maxSize={50 * 1024 * 1024}
        maxFileCount={100}
      />
    );
  },

  TextareaWidget: (props: WidgetProps) => {
    const { value, onChange, name, required, placeholder } = props;

    return (
      <textarea
        className={cn('max-w-full')}
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        name={name}
        required={required}
      />
    );
  },
};

const templates = {
  ObjectFieldTemplate: (props: ObjectFieldTemplateProps) => {
    const {
      title,
      formContext: { isSubmitPending },
      uiSchema,
    } = props;
    return (
      <div>
        <div className="flex justify-between">
          <h1 className="flex-grow text-3xl text-center"> {title}</h1>
          {props.idSchema.$id === 'root' &&
            get(uiSchema, 'ui:submitButtonOptions.norender', false) && (
              <button disabled={isSubmitPending} type={get(uiSchema, 'ui:submitButtonOptions.type')} className="bg-success text-white px-4 py-2 rounded-md flex items-center">
                {isSubmitPending && (
                  <Refresh className="mr-2 h-4 w-4 animate-spin" />
                )}
                {get(uiSchema, 'ui:submitButtonOptions.submitText', 'Submit')}
              </button>
            )}
        </div>
        {props.properties.map((element: any) => element.content)}
      </div>
    );
  },
  FieldTemplate: (props: FieldTemplateProps) => {
    const { help, description, errors, children } = props;
    if (['object'].includes(props.schema.type as string)) return children;
    return (
      <div className="my-2 w-full">
        <div className='flex-grow'>{children}</div>
        <span className="block">{description}</span>
        <span>{help}</span>
        {errors}
      </div>
    );
  },

  FieldErrorTemplate: (props: FieldErrorProps) => {
    const { errors } = props;
    if (!errors) return null;
    return (
      <span className="text-red-400 text-sm italic block">* {errors}</span>
    );
  },

  ErrorListTemplate: () => {
    return null;
  },

  ButtonTemplates: {
    SubmitButton: () => {
      return null;
    },

    AddButton: (props: IconButtonProps) => {
      return (
        <button {...props} className="m-2 py-2 px-4 rounded-lg border-2 bg-primary text-input hover:cursor-pointer">
          Add Item
        </button>
      );
    },

    RemoveButton: (props: IconButtonProps) => {
      return (
        <button {...props} className="mr-2 py-1 px-4 rounded-lg border-2 bg-destructive text-input hover:cursor-pointer">
          Remove
        </button>
      );
    },

    MoveDownButton: (props: IconButtonProps) => {
      return (
        <button {...props} className="m-2 py-2 px-4 rounded-lg border-2 bg-secondary hover:cursor-pointer">
          Move Down
        </button>
      );
    },

    MoveUpButton: (props: IconButtonProps) => {
      return (
        <button {...props} className="m-2 py-2 px-4 rounded-lg border-2 bg-secondary hover:cursor-pointer">
          Move Up
        </button>
      );
    },
  },
};

export const DataForm = (
  props: FormProps & { submitText?: string; customSubmit?: boolean, templateOverride?: Partial<typeof templates>, loading?: boolean },
) => {
  return (
    <JSONSchemaForm
      widgets={widgets}
      templates={merge(templates, props.templateOverride)}
      liveValidate
      {...props}
      formContext={{
        isSubmitPending: props.formContext?.isSubmitPending || false,
      }}
      uiSchema={{
        'ui:submitButtonOptions': {
          norender: !props.customSubmit,
          submitText: props.submitText || 'Submit'
        },
        ...props.uiSchema,
      }}
    />
  );
};