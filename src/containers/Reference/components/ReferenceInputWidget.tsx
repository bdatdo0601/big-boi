import { put } from '@aws-amplify/api';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { cloneDeep, debounce, get, isEmpty, set, uniq } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ChipButton } from '@/components/ChipButton';
import { DataForm } from '@/components/DataForm';
import EventType from '../../../assets/event-type.json';
import {
  createPrivateReference,
  createReference,
  updatePrivateReference,
  updateReference,
} from '../../../graphql/mutations';
import { useLazyAWSAPI } from '../../../utils/awsAPI';
import { useDataUpdateWrapper } from '../../../utils/hooks';
import ReferenceContext from '../context';

interface DefaultValuesType {
  title: string;
  url: string;
  tags: string;
  isPrivate: boolean;
}

const DefaultValues: DefaultValuesType = {
  title: '',
  url: '',
  tags: '',
  isPrivate: true,
};

const DataUpdateOptions = {
  snackBar: {
    successMessage: 'Reference Mutated',
    errorMessage: 'Unable to Mutate Reference',
  },
  logging: {
    eventType: EventType.Personal.Reference.Update,
  },
};

const ReferenceSchema: RJSFSchema = {
  type: 'object',
  properties: {
    title: { title: 'Name', type: 'string' },
    url: {
      title: 'Link',
      type: 'string',
      format: 'uri',
    },
    tags: {
      title: 'Tags (separated by commas)',
      type: 'string',
    },
    isPrivate: { type: 'boolean', title: ' Private Link' },
  },
  required: ['title', 'url', 'tags', 'isPrivate'],
};

type ReferenceSchemaType = {
  title: string;
  url: string;
  tags: string;
  isPrivate: boolean;
};

interface ReferenceInputWidgetProps {
  existingReference: Record<string, any> | null;
  createNew: boolean;
  onReferenceUpserted?: () => void;
}

const ReferenceInputWidget: React.FC<ReferenceInputWidgetProps> = ({
  existingReference,
  createNew,
  onReferenceUpserted,
}) => {
  const { execute: postReference, loading: creatingReference } = useLazyAWSAPI(createReference);
  const { execute: postPrivateReference, loading: creatingPrivateReference } = useLazyAWSAPI(createPrivateReference);
  const { execute: changeReference, loading: updatingReference } = useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } = useLazyAWSAPI(updatePrivateReference);
  const { suggestedReferenceTags, updateLocalReferenceTags, syncReferenceTags, requestRefetch } =
    useContext(ReferenceContext);
  const [formData, setFormData] = useState<ReferenceSchemaType | undefined>(
    existingReference
      ? {
          title: existingReference.title,
          url: existingReference.url,
          tags: existingReference.tags.join(', '),
          isPrivate: existingReference.isPrivate,
        }
      : undefined
  );
  const [isURLMetadataFetching, setIsURLMetadataFetching] = useState<boolean>(false);
  const loading = useMemo(
    () =>
      creatingReference ||
      creatingPrivateReference ||
      updatingReference ||
      updatingPrivateReference ||
      isURLMetadataFetching,
    [creatingReference, creatingPrivateReference, updatingReference, updatingPrivateReference, isURLMetadataFetching]
  );

  const onURLChange = useRef(
    debounce(async (newURL: string) => {
      setIsURLMetadataFetching(true);
      const rawResponse = await put({
        apiName: 'bigboiexternalapi',
        path: '/url-metadata',
        options: {
          body: { url: newURL },
        },
      });
      const response = JSON.parse(await (await rawResponse.response).body.text());
      setFormData((currentValue: ReferenceSchemaType | undefined) => {
        setIsURLMetadataFetching(false);
        if (currentValue && !get(currentValue, 'title')) {
          const newValue = cloneDeep(currentValue);
          const isPrivate = get(response, 'isPrivate', true);
          set(newValue, 'isPrivate', isPrivate);
          set(newValue, 'title', get(response, 'title', get(response, 'og:title')));
          return newValue;
        }
        return currentValue;
      });
    }, 200)
  );

  const onReferenceMutate = useCallback(
    async (data: ReferenceSchemaType) => {
      if (!data.title || !data.url) {
        throw new Error('Incomplete Data');
      }
      const variables = {
        input: {
          id: get(existingReference, 'id', uuid()),
          clickCount: get(existingReference, 'clickCount', 0),
          title: get(data, 'title'),
          url: get(data, 'url'),
          type: 'REFERENCES',
          tags: uniq(
            get(data, 'tags', '')
              .split(',')
              .map(item => item.trim())
          ),
        },
      };
      updateLocalReferenceTags((existingReferenceTags: any) => [
        ...existingReferenceTags,
        ...get(variables, 'input.tags'),
      ]);
      const isPrivate = get(data, 'isPrivate', true);
      if (existingReference && !createNew) {
        isPrivate ? await changePrivateReference(variables) : await changeReference(variables);
      } else {
        isPrivate ? await postPrivateReference(variables) : await postReference(variables);
      }
      return { ...variables.input, isPrivate };
    },
    [
      existingReference,
      changePrivateReference,
      changeReference,
      postPrivateReference,
      postReference,
      updateLocalReferenceTags,
      createNew,
    ]
  );
  const onReset = useCallback(() => {
    setFormData(undefined);
  }, []);

  const onPostSubmit = useCallback(async () => {
    await syncReferenceTags();
    await requestRefetch();
    if (onReferenceUpserted) {
      await onReferenceUpserted();
    }
    onReset();
  }, [syncReferenceTags, onReset, requestRefetch, onReferenceUpserted]);

  const [onSubmit] = useDataUpdateWrapper(onReferenceMutate as any, onPostSubmit, DataUpdateOptions as any);

  useEffect(() => {
    if (existingReference) {
      setFormData({
        title: get(existingReference, 'title'),
        url: get(existingReference, 'url'),
        tags: get(existingReference, 'tags', []).join(','),
        isPrivate: get(existingReference, 'isPrivate', true),
      });
    }
  }, [existingReference]);

  return (
    <div className="bg-muted text-primary p-4 overflow-auto">
      <div className="flex justify-end">
        <div className="flex flex-row gap-4 my-2">
          {isURLMetadataFetching && <span>Fetching URL Information...</span>}
          <button
            className="text-destructive mx-2 hover:cursor-pointer"
            onClick={e => {
              e.preventDefault();
              onReset();
            }}
            disabled={!isEmpty(existingReference)}
          >
            Reset
          </button>
          <button
            type="submit"
            className="text-input mx-2 bg-foreground py-2 px-4 rounded-lg hover:bg-accent-foreground hover:cursor-pointer"
            onClick={e => {
              e.preventDefault();
              onSubmit(formData);
            }}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
      <DataForm
        schema={ReferenceSchema}
        validator={validator}
        formData={formData}
        onChange={({ formData: newData }) => {
          setFormData(currentFormData => {
            if (get(currentFormData, 'url') !== get(newData, 'url')) {
              onURLChange.current(get(newData, 'url'));
            }
            return newData;
          });
        }}
        customSubmit
      />
      <div className="flex flex-wrap gap-1 mt-2">
        {suggestedReferenceTags
          .filter((tag: string) => tag && !get(formData, 'tags', '').includes(tag))
          .map((tag: string) => (
            <ChipButton
              key={tag}
              label={tag}
              onClick={() => {
                setFormData(currentFormData => ({
                  ...DefaultValues,
                  ...currentFormData,
                  tags: [get(currentFormData, 'tags', ''), tag].filter(item => item).join(', '),
                }));
              }}
              bgColor="secondary"
            />
          ))}
      </div>
    </div>
  );
};

export default ReferenceInputWidget;
