import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import API from "@aws-amplify/api";
import {
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import { useForm, useController } from "react-hook-form";
import { AddOutlined, DeleteOutline } from "@mui/icons-material";
import { get, isNull, uniq, debounce } from "lodash";
import { v4 as uuid } from "uuid";
import ReferenceContext from "../context";
import {
  createPrivateReference,
  createReference,
  updateReference,
  updatePrivateReference,
} from "../../../graphql/mutations";
import { useDataUpdateWrapper } from "../../../utils/hooks";
import EventType from "../../../assets/event-type.json";
import { useLazyAWSAPI } from "../../../utils/awsAPI";
import { StyledTextField } from "../../../components/StyledTextField";
import { StyledAutocomplete } from "../../../components/StyledAutoComplete";

const DefaultValues = {
  title: "",
  url: "",
  tags: {},
  isPrivate: true,
};

const DataUpdateOptions = {
  snackBar: {
    successMessage: "Reference Mutated",
    errorMessage: "Unable to Mutate Reference",
  },
  logging: {
    eventType: EventType.Personal.Reference.Update,
  },
};

const ReferenceInputWidget = ({ existingReference }) => {
  const { execute: postReference, loading: creatingReference } =
    useLazyAWSAPI(createReference);
  const { execute: postPrivateReference, loading: creatingPrivateReference } =
    useLazyAWSAPI(createPrivateReference);
  const { execute: changeReference, loading: updatingReference } =
    useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } =
    useLazyAWSAPI(updatePrivateReference);
  const {
    suggestedReferenceTags,
    updateLocalReferenceTags,
    syncReferenceTags,
    requestRefetch,
  } = useContext(ReferenceContext);
  const { register, handleSubmit, reset, setValue, watch, getValues, control } =
    useForm();
  const {
    field: {
      onChange: onSwitchChange,
      onBlur: onSwitchBlue,
      value: switchValue,
      ref: switchRef,
    },
  } = useController({
    name: "isPrivate",
    control,
    defaultValue: true,
  });
  const [referenceTagInputs, setReferenceTagInputs] = useState(
    get(existingReference, "tags", []).map(() => uuid())
  );
  const [isURLMetadataFetching, setIsURLMetadataFetching] = useState(false);

  const loading = useMemo(
    () =>
      creatingReference ||
      creatingPrivateReference ||
      updatingReference ||
      updatingPrivateReference ||
      isURLMetadataFetching,
    [
      creatingReference,
      creatingPrivateReference,
      updatingReference,
      updatingPrivateReference,
      isURLMetadataFetching,
    ]
  );

  const watchURL = watch("url");

  const onURLChange = useRef(
    debounce(async (newURL) => {
      setIsURLMetadataFetching(true);
      if (isNull(existingReference)) {
        const response = await API.post("bigboiexternalapi", "/url-metadata", {
          body: { url: newURL },
        });
        if (!get(getValues(), "title")) {
          const isPrivate = get(response, "isPrivate", true);
          setValue("isPrivate", isPrivate);
          setValue("title", get(response, "title"));
        }
      }
      setIsURLMetadataFetching(false);
    }, 200)
  );

  const onTitleChange = useRef(
    debounce(() => {
      if (!existingReference) {
        setValue("isPrivate", true);
      }
    }, 100)
  );

  useEffect(() => {
    if (watchURL) {
      onURLChange.current(watchURL);
    }
  }, [watchURL]);

  useEffect(() => {
    if (existingReference) {
      setValue("title", get(existingReference, "title"));
      setValue("url", get(existingReference, "url"));
      setValue("isPrivate", get(existingReference, "isPrivate"));
      referenceTagInputs.forEach((input, index) => {
        setValue(`tags.${input}`, get(existingReference, `tags.${index}`));
      });
    }
    // eslint-disable-next-line
  }, []);

  const onReferenceMutate = useCallback(
    async (data) => {
      if (!data.title || !data.url) {
        throw new Error("Incomplete Data");
      }
      const variables = {
        input: {
          id: get(existingReference, "id", uuid()),
          clickCount: get(existingReference, "clickCount", 0),
          title: get(data, "title"),
          url: get(data, "url"),
          type: "REFERENCES",
          tags: uniq(
            referenceTagInputs
              .map((input) => get(data, `tags.${input}`))
              .filter((item) => item)
          ),
        },
      };
      updateLocalReferenceTags((existingReferenceTags) => [
        ...existingReferenceTags,
        ...get(variables, "input.tags"),
      ]);
      const isPrivate = get(data, "isPrivate", true);
      if (existingReference) {
        isPrivate
          ? await changePrivateReference(variables)
          : await changeReference(variables);
      } else {
        isPrivate
          ? await postPrivateReference(variables)
          : await postReference(variables);
      }
      return { ...variables.input, isPrivate };
    },
    [
      existingReference,
      changePrivateReference,
      changeReference,
      postPrivateReference,
      postReference,
      referenceTagInputs,
      updateLocalReferenceTags,
    ]
  );
  const onReset = useCallback(() => {
    reset(DefaultValues);
    setReferenceTagInputs([]);
  }, [reset]);
  const onPostSubmit = useCallback(async () => {
    await syncReferenceTags();
    await requestRefetch();
    onReset();
  }, [syncReferenceTags, onReset, requestRefetch]);

  const [onSubmit] = useDataUpdateWrapper(
    onReferenceMutate,
    onPostSubmit,
    DataUpdateOptions
  );

  return (
    <form className="bg-accent text-primary p-4">
      <div className="flex justify-end">
        <div className="flex flex-row gap-4 my-2">
          <FormControlLabel
            control={
              <Switch
                ref={switchRef}
                checked={switchValue}
                onChange={(event, value) => {
                  event.preventDefault();
                  onSwitchChange(value);
                }}
                onBlur={onSwitchBlue}
                value={switchValue}
              />
            }
            label="Private"
            disabled={!isNull(existingReference)}
          />
          <button
            className="text-destructive mx-2"
            onClick={onReset}
            disabled={!isNull(existingReference)}
          >
            Reset
          </button>
          <button
            className="text-input mx-2 bg-foreground py-2 px-4 rounded-lg hover:bg-accent-foreground hover:cursor-pointer"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-4 my-2.5">
        <StyledTextField
          id="reference-link"
          label="Link"
          variant="outlined"
          className="lg:w-1/2 xl:w-1/2 sm:w-full xs:w-full w-full my-2 pr-2"
          placeholder="Links reference"
          disabled={loading}
          {...register("url")}
        />
        <StyledTextField
          id="reference-title"
          label="Title"
          variant="outlined"
          className="lg:w-1/2 xl:w-1/2 sm:w-full xs:w-full w-full my-2"
          {...register("title", { onChange: onTitleChange.current })}
        />
      </div>
      <div
        className="gap-4 w-full"
        style={{ maxHeight: "50vh", overflow: "scroll" }}
      >
        {referenceTagInputs.map((input, index) => (
          <div key={input} className="flex my-2 mr-2 w-full">
            <StyledAutocomplete
              id={`reference-tag-${input}`}
              className="w-full"
              freeSolo
              autoSelect
              options={suggestedReferenceTags}
              disabled={loading}
              renderOption={(props, option) => (
                <li {...props}>
                  <IconButton
                    className="mr-2"
                    onClick={() => {
                      updateLocalReferenceTags((existingReferenceTags) =>
                        existingReferenceTags.filter((item) => item !== option)
                      );
                    }}
                  >
                    <DeleteOutline sx={{ color: "var(--background)" }} />
                  </IconButton>
                  {option}
                </li>
              )}
              defaultValue={get(existingReference, `tags.${index}`, undefined)}
              renderInput={(params) => (
                <TextField
                  id={`reference-tag-textfield-${input}`}
                  label={`Tag ${index + 1}`}
                  variant="outlined"
                  placeholder="tag with dot notation"
                  {...params}
                  {...register(`tags.${input}`)}
                />
              )}
            />
            <IconButton
              className="text-red-600 mr-2"
              onClick={() => {
                setReferenceTagInputs((existingValue) =>
                  existingValue.filter((item) => item !== input)
                );
                syncReferenceTags();
              }}
            >
              <DeleteOutline sx={{ color: "var(--input)" }} />
            </IconButton>
          </div>
        ))}
        <Button
          className="my-2 w-64"
          variant="outlined"
          startIcon={<AddOutlined />}
          onClick={() =>
            setReferenceTagInputs((existingValue) => [...existingValue, uuid()])
          }
        >
          Add Tags
        </Button>
      </div>
    </form>
  );
};

ReferenceInputWidget.propTypes = {
  existingReference: PropTypes.object,
};

ReferenceInputWidget.defaultProps = {
  existingReference: null,
};

export default ReferenceInputWidget;
