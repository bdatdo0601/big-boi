import React, { useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Chip, IconButton, Link, Modal, Paper, Tooltip, Typography } from "@mui/material";
import { get } from "lodash";
import { DeleteOutlined, EditOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { useLazyAWSAPI } from "../../../utils/awsAPI";
import {
  deletePrivateReference,
  deleteReference,
  updatePrivateReference,
  updateReference,
} from "../../../graphql/mutations";
import ReferenceContext from "../context";
import ReferenceInputWidget from "./ReferenceInputWidget";

const ReferenceRenderer = ({ reference, showTags }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute: changeReference, loading: updatingReference } = useLazyAWSAPI(updateReference);
  const { execute: changePrivateReference, loading: updatingPrivateReference } = useLazyAWSAPI(updatePrivateReference);
  const { execute: removeReference, loading: deletingReference } = useLazyAWSAPI(deleteReference);
  const { execute: removePrivateReference, loading: deletingPrivateReference } = useLazyAWSAPI(deletePrivateReference);
  const { requestRefetch } = useContext(ReferenceContext);

  const toggleModal = useCallback(() => {
    setIsModalOpen(existingState => !existingState);
  }, []);

  const loading = useMemo(
    () => updatingReference || updatingPrivateReference || deletingReference || deletingPrivateReference,
    [updatingReference, updatingPrivateReference, deletingReference, deletingPrivateReference]
  );

  const onLinkClick = useCallback(async () => {
    const variables = {
      input: {
        id: get(reference, "id"),
        clickCount: get(reference, "clickCount", 0) + 1,
      },
    };
    get(reference, "isPrivate", true) ? await changePrivateReference(variables) : await changeReference(variables);
    window.open(get(reference, "url"), "_blank");
    await requestRefetch();
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
        <Tooltip placement="top" title={`Visited ${get(reference, "clickCount")} time(s)`}>
          <Link className="m-0 mr-2" href="#" onClick={onLinkClick}>
            {get(reference, "title")}
          </Link>
        </Tooltip>
        {showTags &&
          get(reference, "tags", []).map(item => <Chip className="mr-2" key={item} size="small" label={item} />)}
      </span>

      <span>
        {get(reference, "isPrivate") && <VisibilityOffOutlined className="mr-2 text-gray-600" />}
        <IconButton disabled={loading} onClick={toggleModal}>
          <EditOutlined />
        </IconButton>
        <IconButton color="error" disabled={loading} onClick={onLinkDelete}>
          <DeleteOutlined />
        </IconButton>
      </span>
    </span>
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
