import React, { useContext, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { debounce, flatMap, get, lowerCase, sortBy } from "lodash";
import { Autocomplete, IconButton, Paper, TextField } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import FlexSearch from "flexsearch/dist/flexsearch.bundle.min";
import { listPrivateReferences, listReferences } from "../../../graphql/queries";
import { useAWSAPIGetAll } from "../../../utils/awsAPI";
import { convertToReferenceRenderedData } from "../utils";
import ReferenceDisplayWidget from "../components/ReferenceDisplayWidget";
import ReferenceContext from "../context";
import { StyledAutocomplete } from "../../../components/StyledAutoComplete";

const documentSearchStore = new FlexSearch.Document({
  document: {
    id: "id",
    index: ["title", "url", "tags"],
  },
  tokenize: "full"
});

const Searchable = () => {
  const [searchResult, setSearchResult] = useState({});
  const [autoCompleteText, setAutoCompleteText] = useState("");
  const query = useMemo(() => ({ limit: 10000 }), []);
  const { data: rawPublicData, loading: publicDataLoading, execute: refetchReference } = useAWSAPIGetAll(
    listReferences,
    query,
    "API_KEY"
  );
  const { data: rawPrivateData, loading: privateDataLoading, execute: refetchPrivateReference } = useAWSAPIGetAll(
    listPrivateReferences,
    query
  );
  const { registerRefetch, deregisterRefetch } = useContext(
    ReferenceContext
  );

  const resetAutoCompleteText = useCallback(() => {
    setAutoCompleteText("");
  }, []);

  useEffect(() => {
    registerRefetch("Searchable", async () =>
      Promise.all(
        [refetchReference, refetchPrivateReference, resetAutoCompleteText].map(async fn => {
          fn();
        })
      )
    );
    return () => {
      deregisterRefetch("Searchable");
    };
  }, [registerRefetch, refetchReference, refetchPrivateReference, deregisterRefetch, resetAutoCompleteText]);

  const isLoading = useMemo(() => publicDataLoading || privateDataLoading, [publicDataLoading, privateDataLoading]);
  const combinedData = useMemo(
    () =>
      sortBy(
        [
          ...flatMap(rawPublicData, singleQuery =>
            get(singleQuery, "data.listReferences.items", []).map(item => ({ ...item, isPrivate: false }))
          ),
          ...flatMap(rawPrivateData, singleQuery =>
            get(singleQuery, "data.listPrivateReferences.items", []).map(item => ({
              ...item,
              isPrivate: true,
            }))
          ),
        ],
        "clickCount"
      ),
    [rawPrivateData, rawPublicData]
  );

  useEffect(() => {
    for (const item of combinedData) {
      documentSearchStore.add(item);
    }
  }, [combinedData]);

  const onSearch = useRef(
    debounce((newText, combinedData) => {
      const data = documentSearchStore.search(newText);

      const searchedData = combinedData.filter(item => flatMap(data, "result").includes(item.id));

      setSearchResult({ treeData: convertToReferenceRenderedData(searchedData), listData: searchedData });
    }, 200)
  );
  return (
    <div className="p-4 m-2 text-left bg-muted rounded-lg text-input">
      <div className="flex my-4 mr-2 w-full">
        <input
          className="w-full p-4 border-2 border-input rounded-xl text-input"
          type="text"
          placeholder="Search References"
          value={autoCompleteText}
          onChange={e => {
            setAutoCompleteText(e.target.value);
            onSearch.current(e.target.value, combinedData);
          }}
        />
      </div>

      {autoCompleteText && (
        <ReferenceDisplayWidget
          widgetKey="searchable"
          data={get(searchResult, "treeData", {})}
          listData={get(searchResult,"listData", [])}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default Searchable;
