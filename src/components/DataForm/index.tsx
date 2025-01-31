import JSONSchemaForm, { FormProps } from '@rjsf/core';

import {
  ArrayFieldTemplateProps,
  FieldErrorProps,
  FieldTemplateProps,
  IconButtonProps,
  ObjectFieldTemplateProps,
  RegistryWidgetsType,
  WidgetProps,
} from '@rjsf/utils';

import { cn } from '@/utils';
import { get, merge, pick } from 'lodash';
import { Add, ArrowDownward, ArrowUpward, Delete, Refresh } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const Input = (props: React.ComponentProps<any>) => (
  <input {...props} className="border border-gray-300 rounded-md py-1 px-2 w-full text-input" />
)

const base64ToFile = async (dataurl: string, filename: string): Promise<File> => {
  const res: Response = await fetch(dataurl);
  const blob: Blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};


const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const widgets: RegistryWidgetsType = {
  URIWidget: (props: WidgetProps) => {
    const { value, onChange, name, required, placeholder, label } = props;
    return (
      <Input
        type="url"
        placeholder={placeholder || label || name}
        value={value || ''}
        onChange={(e: any) => onChange(e.target.value)}
        name={name}
        required={required}
      />
    );
  },
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
    const { onChange, multiple, value, options } = props;
    const accept = options?.accept;
    const [tempFile, setTempFile] = useState<File | null>(null);

    useEffect(() => {
      if (value) {
        base64ToFile(value, 'tempFile').then((file) => {
          setTempFile(file);
        });
      }
    }, [value]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const fileList = Array.from(files);
        if (multiple) {
          onChange(fileList);
        } else {
          const file = fileList[0];
          const base64Data = await convertToBase64(file);
          onChange(base64Data);
        }
      }
    };

    return (
      <div>
        <Input
          type="file"
          className={cn('max-w-full')}
          {...(pick(props, ['onBlur', 'onFocus', 'disabled']) as any)}
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
        />
        {tempFile && <p>1 file registered ({tempFile.size} bytes)</p>}
      </div>
    );
  },

  TextareaWidget: (props: WidgetProps) => {
    const { value, onChange, name, required, placeholder } = props;
    return (
      <textarea
        className={'border border-gray-300 rounded-md p-2 w-full min-w-[250px] text-input'}
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
      <div className='border-l-2 border-primary pl-2 py-1'>
        <div className="flex justify-start pl-1">
          <h1 className="flex-grow text-lg text-center pl-2 font-bold">{title}</h1>
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
        <div className='flex flex-row flex-wrap gap-2'>
          {props.properties.map((element: any) => element.content)}
        </div>
      </div>
    );
  },
  FieldTemplate: (props: FieldTemplateProps) => {
    const { help, description, errors, children, label } = props;
    if (['object', 'array'].includes(props.schema.type as string)) return children;
    return (
      <div className="my-2 flex flex-col gap-1">
        <span className='text-xs'>{label}</span>
        <div className='flex-grow'>{children}</div>
        <span className="block">{description}</span>
        <span>{help}</span>
        {errors}
      </div>
    );
  },

  ArrayFieldTemplate: (props: ArrayFieldTemplateProps) => {
    return (
      <div className='py-1 pr-1 flex flex-col gap-2 border-y-2 border-foreground'>
        <span className='text-lg pl-2 font-bold'>{props.title}</span>
        <div className='flex flex-wrap gap-2 items-end'>
          {props.items.map((element) => (
            <div key={element.key} className='flex flex-col gap-1 py-2 border-b-2 border-primary border-dashed'>
              <span className='flex flex-row gap-2 justify-start items-end px-2'>
                <div className='border-r-2 border-dashed pr-2 border-primary'>
                  {element.children}
                </div>
                <div className='flex flex-col gap-1 pl-2'>
                  {element.hasMoveUp && (
                    <button title='Move Up' className="p-1 rounded-full border-2 bg-secondary text-input hover:cursor-pointer" onClick={element.onReorderClick(element.index, element.index - 1)}>
                      <ArrowUpward />
                    </button>
                  )}
                  {element.hasMoveDown && (
                    <button title='Move Down' className="p-1 rounded-full border-2 bg-secondary text-input hover:cursor-pointer" onClick={element.onReorderClick(element.index, element.index + 1)}>
                      <ArrowDownward />
                    </button>
                  )}
                  {element.hasRemove && (
                    <button title='Remove' className="p-1 rounded-full border-2 bg-destructive text-input hover:cursor-pointer" onClick={element.onDropIndexClick(element.index)}>
                      <Delete />
                    </button>
                  )}
                </div>
              </span>
            </div>
          ))}
        </div>
        {props.canAdd && (
          <div className='flex flex-row gap-2 justify-start items-center'>
            <span className='text-xs'>{props.title} Action(s)</span>
            <button title='Add' className="p-1 rounded-full border-2 bg-primary text-input hover:cursor-pointer" onClick={props.onAddClick}>
              <Add />
            </button>
          </div>
        )}
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
          <Add />
        </button>
      );
    },

    RemoveButton: (props: IconButtonProps) => {
      return (
        <button {...props} className="m-2 py-2 px-4 rounded-lg border-2 bg-destructive text-input hover:cursor-pointer">
          <Delete />
        </button>
      );
    },

    MoveDownButton: (props: IconButtonProps) => {
      return (
        <button {...props} className="m-2 py-2 px-4 rounded-lg border-2 bg-secondary hover:cursor-pointer">
          <ArrowDownward />
        </button>
      );
    },

    MoveUpButton: (props: IconButtonProps) => {
      return (
        <button {...props} className="m-2 py-2 px-4 rounded-lg border-2 bg-secondary hover:cursor-pointer">
          <ArrowUpward />
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