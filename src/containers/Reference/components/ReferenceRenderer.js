import React, { useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Chip, IconButton, Link, Modal, Paper, Tooltip, Typography } from "@mui/material";
import { get } from "lodash";
import { useSnackbar } from "notistack";
import {
  ContentCopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ShareOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { useLazyAWSAPI } from "../../../utils/awsAPI";
import {
  deletePrivateReference,
  deleteReference,
  updatePrivateReference,
  updateReference,
} from "../../../graphql/mutations";
import ReferenceContext from "../context";
import ReferenceInputWidget from "./ReferenceInputWidget";

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

const copyTextToClipboard = async text => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Async: Could not copy text: ", err);
  }
};

const ReferenceRenderer = ({ reference, showTags }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute: changeReference, loading: updatingReference } = useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } = useLazyAWSAPI(updatePrivateReference);
  const { execute: removeReference, loading: deletingReference } = useLazyAWSAPI(deleteReference);
  const { execute: removePrivateReference, loading: deletingPrivateReference } = useLazyAWSAPI(deletePrivateReference);
  const { requestRefetch, currentUser } = useContext(ReferenceContext);

  const toggleModal = useCallback(() => {
    setIsModalOpen(existingState => !existingState);
  }, []);

  const loading = useMemo(
    () => updatingReference || updatingPrivateReference || deletingReference || deletingPrivateReference,
    [updatingReference, updatingPrivateReference, deletingReference, deletingPrivateReference]
  );

  const onLinkClick = useCallback(async () => {
    try {
      const variables = {
        input: {
          id: get(reference, "id"),
          clickCount: get(reference, "clickCount", 0) + 1,
        },
      };
      get(reference, "isPrivate", true) ? await changePrivateReference(variables) : await changeReference(variables);
    } catch (err) {
      // eslint-disable-next-line
      console.warn("Unable to count clicks: ", err);
    } finally {
      window.open(get(reference, "url"), "_blank");
      await requestRefetch();
    }
  }, [reference, changeReference, changePrivateReference, requestRefetch]);

  const onLinkDelete = useCallback(async () => {
    const variables = {
      input: {
        id: get(reference, "id"),
      },
    };
    get(reference, "isPrivate", true) ? await removePrivateReference(variables) : await removeReference(variables);
    await requestRefetch();
  }, [reference, removeReference, removePrivateReference, requestRefetch]);

  return (
    <Tooltip
      placement="top-end"
      followCursor
      title={currentUser ? `Visited ${get(reference, "clickCount")} time(s)` : ""}
    >
      <span className="flex justify-between align-middle w-full">
        <Modal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper className="p-12">
            <Typography variant="h5">Update Reference</Typography>
            <ReferenceInputWidget existingReference={reference} />
          </Paper>
        </Modal>
        <span>
          {get(reference, "isPrivate") && <VisibilityOffOutlined className="mr-2 text-gray-600" />}
          <Link className="m-0 mr-2" href="#" onClick={onLinkClick}>
            {get(reference, "title")}
          </Link>
          {showTags &&
            get(reference, "tags", []).map(item => <Chip className="mr-2" key={item} size="small" label={item} />)}
        </span>

        <span>
          <IconButton
            disabled={loading}
            onClick={async () => {
              await copyTextToClipboard(get(reference, "url"));
              enqueueSnackbar(`"${get(reference, "title")}" URL Copied`, {
                variant: "info",
                anchorOrigin: { vertical: "top", horizontal: "left" },
              });
            }}
          >
            <ContentCopyOutlined />
          </IconButton>
          {navigator.canShare && navigator.canShare() && (
            <IconButton
              disabled={loading}
              onClick={async () => {
                await navigator.share({
                  title: get(reference, "title"),
                  url: get(reference, "url"),
                  text: `${get(reference, "title")} [${get(reference, "tags", []).join(", ")}]`,
                });
              }}
            >
              <ShareOutlined />
            </IconButton>
          )}
          {currentUser && (
            <IconButton disabled={loading} onClick={toggleModal}>
              <EditOutlined />
            </IconButton>
          )}
          {currentUser && (
            <IconButton color="error" disabled={loading} onClick={onLinkDelete}>
              <DeleteOutlined />
            </IconButton>
          )}
        </span>
      </span>
    </Tooltip>
  );
};

ReferenceRenderer.propTypes = {
  reference: PropTypes.object.isRequired,
  showTags: PropTypes.bool,
};

ReferenceRenderer.defaultProps = {
  showTags: false,
};

export default ReferenceRenderer;
