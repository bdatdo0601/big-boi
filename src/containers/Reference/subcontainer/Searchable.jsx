import React, { useContext, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { debounce, get, lowerCase, sortBy } from "lodash";
import { Autocomplete, IconButton, Paper, TextField } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { searchPrivateReferences, searchReferences } from "../../../graphql/queries";
import { useAWSAPI } from "../../../utils/awsAPI";
import { convertToReferenceRenderedData } from "../utils";
import ReferenceDisplayWidget from "../components/ReferenceDisplayWidget";
import ReferenceContext from "../context";

const Searchable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteText, setAutoCompleteText] = useState("");
  const query = useMemo(
    () => ({
      filter: {
        or: [
          { title: { wildcard: `${searchQuery || ""}*` } },
          { url: { wildcard: `${searchQuery || ""}*` } },
          { tags: { wildcard: `${searchQuery || ""}*` } },
          // eslint-disable-next-line
          { tags: { regexp: `.*\.${searchQuery}.*` } },
          { title: { match: searchQuery } },
          { url: { match: searchQuery } },
          { tags: { match: searchQuery } },
        ],
      },
      limit: 100,
    }),
    [searchQuery]
  );
  const { data: rawPublicData, loading: publicDataLoading, execute: refetchReference } = useAWSAPI(
    searchReferences,
    query,
    "API_KEY"
  );
  const { data: rawPrivateData, loading: privateDataLoading, execute: refetchPrivateReference } = useAWSAPI(
    searchPrivateReferences,
    query
  );
  const { updateLocalReferenceTags, syncReferenceTags, registerRefetch, deregisterRefetch } = useContext(
    ReferenceContext
  );

  const resetSearchQuery = useCallback(() => {
    setAutoCompleteText("");
    setSearchQuery("");
  }, []);

  useEffect(() => {
    registerRefetch("Searchable", async () =>
      Promise.all(
        [refetchReference, refetchPrivateReference, resetSearchQuery].map(async fn => {
          fn();
        })
      )
    );
    return () => {
      deregisterRefetch("Searchable");
    };
  }, [registerRefetch, refetchReference, refetchPrivateReference, deregisterRefetch, resetSearchQuery]);

  const isLoading = useMemo(() => publicDataLoading || privateDataLoading, [publicDataLoading, privateDataLoading]);
  const combinedData = useMemo(
    () =>
      sortBy(
        [
          ...get(rawPublicData, "data.searchReferences.items", []).map(item => ({ ...item, isPrivate: false })),
          ...get(rawPrivateData, "data.searchPrivateReferences.items", []).map(item => ({
            ...item,
            isPrivate: true,
          })),
        ],
        "clickCount"
      ),
    [rawPrivateData, rawPublicData]
  );

  const treeData = useMemo(() => convertToReferenceRenderedData(combinedData), [combinedData]);
  const onSearch = useRef(
    debounce(newText => {
      setSearchQuery(lowerCase(newText));
    }, 200)
  );
  return (
    <Paper className="p-4 m-2 text-left">
      <div className="flex my-4 mr-2 w-full">
        <Autocomplete
          id="reference-search"
          className="w-full"
          freeSolo
          autoSelect
          value={autoCompleteText}
          onInputChange={(e, newValue) => {
            setAutoCompleteText(newValue);
            onSearch.current(newValue);
          }}
          options={[]}
          renderOption={(props, option) => (
            <li {...props}>
              <IconButton
                className="text-red-600 mr-2"
                onClick={() => {
                  updateLocalReferenceTags(existingReferenceTags =>
                    existingReferenceTags.filter(item => item !== option)
                  );
                  syncReferenceTags();
                }}
              >
                <DeleteOutline />
              </IconButton>
              {option}
            </li>
          )}
          renderInput={params => (
            <TextField
              id="reference-search-text-field"
              label="Search Reference Here"
              variant="outlined"
              placeholder="Search References"
              {...params}
            />
          )}
        />
      </div>

      {searchQuery && (
        <ReferenceDisplayWidget widgetKey="searchable" data={treeData} listData={combinedData} loading={isLoading} />
      )}
    </Paper>
  );
};

export default Searchable;
