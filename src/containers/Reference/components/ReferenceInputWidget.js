import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
import API from "@aws-amplify/api";
import { Autocomplete, Box, Button, FormControlLabel, IconButton, Paper, Switch, TextField } from "@mui/material";
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
  const { execute: postReference, loading: creatingReference } = useLazyAWSAPI(createReference);
  const { execute: postPrivateReference, loading: creatingPrivateReference } = useLazyAWSAPI(createPrivateReference);
  const { execute: changeReference, loading: updatingReference } = useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } = useLazyAWSAPI(updatePrivateReference);
  const { suggestedReferenceTags, updateLocalReferenceTags, syncReferenceTags, requestRefetch } = useContext(
    ReferenceContext
  );
  const { register, handleSubmit, reset, setValue, watch, getValues, control } = useForm();
  const {
    field: { onChange: onSwitchChange, onBlur: onSwitchBlue, value: switchValue, ref: switchRef },
  } = useController({
    name: "isPrivate",
    control,
    defaultValue: true,
  });
  const [referenceTagInputs, setReferenceTagInputs] = useState(get(existingReference, "tags", []).map(() => uuid()));
  const [isURLMetadataFetching, setIsURLMetadataFetching] = useState(false);

  const loading = useMemo(
    () =>
      creatingReference ||
      creatingPrivateReference ||
      updatingReference ||
      updatingPrivateReference ||
      isURLMetadataFetching,
    [creatingReference, creatingPrivateReference, updatingReference, updatingPrivateReference, isURLMetadataFetching]
  );

  const watchURL = watch("url");

  const onURLChange = useRef(
    debounce(async newURL => {
      setIsURLMetadataFetching(true);
      if (isNull(existingReference)) {
        const response = await API.post("bigboiexternalapi", "/url-metadata", { body: { url: newURL } });
        const isPrivate = get(response, "isPrivate", true);
        setValue("isPrivate", isPrivate);
        if (!isPrivate && !get(getValues(), "title")) {
          setValue("title", get(response, "title"));
        }
      }
      setIsURLMetadataFetching(false);
    }, 200)
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
    async data => {
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
          tags: uniq(referenceTagInputs.map(input => get(data, `tags.${input}`)).filter(item => item)),
        },
      };
      updateLocalReferenceTags(existingReferenceTags => [...existingReferenceTags, ...get(variables, "input.tags")]);
      const isPrivate = get(data, "isPrivate", true);
      if (existingReference) {
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

  const [onSubmit] = useDataUpdateWrapper(onReferenceMutate, onPostSubmit, DataUpdateOptions);

  return (
    <Paper className="p-6 text-left" elevation={3}>
      <Box component="form" noValidate autoComplete="off">
        <div className="flex justify-end">
          <div>
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
            <Button color="secondary" className="mx-2" onClick={onReset} disabled={!isNull(existingReference)}>
              Reset
            </Button>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              className="mx-2"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              Submit
            </Button>
          </div>
        </div>
        <TextField
          id="reference-link"
          label="Link"
          variant="outlined"
          className="lg:w-1/2 xl:w-1/2 sm:w-full xs:w-full w-full my-2 pr-2"
          placeholder="Links reference"
          disabled={loading}
          {...register("url")}
        />
        <TextField
          id="reference-title"
          label="Title"
          variant="outlined"
          className="lg:w-1/2 xl:w-1/2 sm:w-full xs:w-full w-full my-2"
          {...register("title")}
        />
        <div className="grid grid-cols-3 gap-4 w-full">
          {referenceTagInputs.map((input, index) => (
            <div key={input} className="flex my-2 mr-2 w-full">
              <Autocomplete
                id={`reference-tag-${input}`}
                className="w-full"
                freeSolo
                autoSelect
                options={suggestedReferenceTags}
                disabled={loading}
                renderOption={(props, option) => (
                  <li {...props}>
                    <IconButton
                      className="text-red-600 mr-2"
                      onClick={() => {
                        updateLocalReferenceTags(existingReferenceTags =>
                          existingReferenceTags.filter(item => item !== option)
                        );
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                    {option}
                  </li>
                )}
                defaultValue={get(existingReference, `tags.${index}`, undefined)}
                renderInput={params => (
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
                  setReferenceTagInputs(existingValue => existingValue.filter(item => item !== input));
                  syncReferenceTags();
                }}
              >
                <DeleteOutline />
              </IconButton>
            </div>
          ))}
          <Button
            className="my-2 w-64"
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={() => setReferenceTagInputs(existingValue => [...existingValue, uuid()])}
          >
            Add Tags
          </Button>
        </div>
      </Box>
    </Paper>
  );
};

ReferenceInputWidget.propTypes = {
  existingReference: PropTypes.object,
};

ReferenceInputWidget.defaultProps = {
  existingReference: null,
};

export default ReferenceInputWidget;
