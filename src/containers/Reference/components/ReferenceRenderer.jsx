import React, { useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Chip,
  IconButton,
  Link,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { get } from "lodash";
import { useSnackbar } from "notistack";
import {
  ContentCopyOutlined,
  DeleteOutlined,
  DragIndicatorOutlined,
  EditOutlined,
  ShareOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { useDrag } from "react-dnd";
import { useLazyAWSAPI } from "../../../utils/awsAPI";
import {
  deletePrivateReference,
  deleteReference,
  updatePrivateReference,
  updateReference,
} from "../../../graphql/mutations";
import ReferenceContext from "../context";
import ReferenceInputWidget from "./ReferenceInputWidget";
import { DragDropTypes } from "../../../utils/constants";
import { ChipButton } from "@/components/ChipButton";

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

const copyTextToClipboard = async (text) => {
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

const ReferenceRenderer = ({ reference, showTags, draggable }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: DragDropTypes.LINK,
    item: reference,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute: changeReference, loading: updatingReference } =
    useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } =
    useLazyAWSAPI(updatePrivateReference);
  const { execute: removeReference, loading: deletingReference } =
    useLazyAWSAPI(deleteReference);
  const { execute: removePrivateReference, loading: deletingPrivateReference } =
    useLazyAWSAPI(deletePrivateReference);
  const { requestRefetch, currentUser } = useContext(ReferenceContext);

  const toggleModal = useCallback(() => {
    setIsModalOpen((existingState) => !existingState);
  }, []);

  const loading = useMemo(
    () =>
      updatingReference ||
      updatingPrivateReference ||
      deletingReference ||
      deletingPrivateReference,
    [
      updatingReference,
      updatingPrivateReference,
      deletingReference,
      deletingPrivateReference,
    ]
  );

  const onLinkClick = useCallback(async () => {
    try {
      const variables = {
        input: {
          id: get(reference, "id"),
          clickCount: get(reference, "clickCount", 0) + 1,
        },
      };
      get(reference, "isPrivate", true)
        ? await changePrivateReference(variables)
        : await changeReference(variables);
    } catch (err) {
      console.error("Unable to count clicks: ", err);
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
    get(reference, "isPrivate", true)
      ? await removePrivateReference(variables)
      : await removeReference(variables);
    await requestRefetch();
  }, [reference, removeReference, removePrivateReference, requestRefetch]);

  return (
    <div
      ref={dragPreview}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: get(reference, "isPrivate")
          ? "var(--secondary)"
          : "var(--accent)",
      }}
      className="flex border-double py-2 px-2 rounded-2xl items-center text-left shadow-xl"
    >
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-popover scroll-y-auto max-h-[90vh] overflow-y-auto p-4 rounded-lg">
          <Typography variant="h5">Update Reference</Typography>
          <ReferenceInputWidget existingReference={reference} />
        </div>
      </Modal>
      {currentUser && draggable && (
        <span ref={drag}>
          <DragIndicatorOutlined
            className={isDragging ? "text-primary" : "text-input"}
            style={{ cursor: "move" }}
          />
        </span>
      )}

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
        <ContentCopyOutlined sx={{ color: "var(--input)" }} />
      </IconButton>
      <Tooltip
        placement="top-end"
        followCursor
        title={
          currentUser ? `Visited ${get(reference, "clickCount")} time(s)` : ""
        }
      >
        <span
          className="flex justify-between align-middle w-full ml-1 items-center"
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col gap-2">
            <button
              className="mr-1 pt-1 text-input text-left hover:cursor-pointer"
              href="#"
              onClick={onLinkClick}
            >
              <span className="text-md text-input underline">
                {get(reference, "title")}
              </span>
            </button>
            <span className="flex flex-wrap gap-1">
              {showTags &&
                get(reference, "tags", []).filter(item => item).map((item) => (
                  <ChipButton
                    className="rounded-xl py-1 px-2 mr-1 text-xs bg-muted text-muted-foreground italic text-wrap"
                    key={item}
                    label={item}
                  />
                ))}
            </span>
          </div>
          <span>
            {navigator.canShare && navigator.canShare() && (
              <IconButton
                disabled={loading}
                onClick={async () => {
                  await navigator.share({
                    title: get(reference, "title"),
                    url: get(reference, "url"),
                    text: `${get(reference, "title")} [${get(
                      reference,
                      "tags",
                      []
                    ).join(", ")}]`,
                  });
                }}
              >
                <ShareOutlined sx={{ color: "var(--input)" }} />
              </IconButton>
            )}
            {currentUser && (
              <IconButton disabled={loading} onClick={toggleModal}>
                <EditOutlined sx={{ color: "var(--input)" }} />
              </IconButton>
            )}
            {currentUser && (
              <IconButton
                color="error"
                disabled={loading}
                onClick={onLinkDelete}
              >
                <DeleteOutlined />
              </IconButton>
            )}
          </span>
        </span>
      </Tooltip>
    </div>
  );
};

ReferenceRenderer.propTypes = {
  reference: PropTypes.object.isRequired,
  showTags: PropTypes.bool,
  draggable: PropTypes.bool,
};

ReferenceRenderer.defaultProps = {
  showTags: false,
  draggable: false,
};

export default ReferenceRenderer;
