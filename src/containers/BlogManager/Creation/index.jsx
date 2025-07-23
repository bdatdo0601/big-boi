import { Button, Chip, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import MarkdownIt from 'markdown-it';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import { v4 as uuid } from 'uuid';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import './visual_md.css';
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import { get, isEmpty, merge, trim } from 'lodash';
import { useNavigate, useParams } from 'react-router';

import './index.css';
import EventType from '../../../assets/event-type.json';
import { createPost, updatePost } from '../../../graphql/mutations';
import { getPost } from '../../../graphql/queries';
import { useAWSAPI, useLazyAWSAPI } from '../../../utils/awsAPI';
import { getFile, uploadFile } from '../../../utils/awsStorage';
import { POST_STATE } from '../../../utils/constants';
import { useDataUpdateWrapper } from '../../../utils/hooks';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

const DataUpdateOptions = {
  snackBar: {
    successMessage: 'Blog Post Updated',
    errorMessage: 'Unable to Update Blog Post',
  },
  logging: {
    eventType: EventType.Personal.BlogPost.Update,
  },
};

export default function BlogCreation() {
  const navigate = useNavigate();
  const { postID } = useParams();

  const defaultDataInputs = useMemo(() => ({ id: postID }), [postID]);
  const { execute: postPost, loading: postingPost } = useLazyAWSAPI(createPost);
  const { execute: mutatePost, loading: updatingPost } = useLazyAWSAPI(updatePost);
  const { data: rawDefaultData, loading } = useAWSAPI(getPost, defaultDataInputs);
  const defaultData = useMemo(() => {
    const fetchedData = get(rawDefaultData, 'data.getPost', {});
    const postData = JSON.parse(get(fetchedData, 'data', '{}'));
    return merge({ ...fetchedData, data: postData }, { id: postID });
  }, [rawDefaultData, postID]);
  const [data, setData] = useState(rawDefaultData);

  useEffect(() => {
    setData(defaultData);
  }, [defaultData]);

  const updateBlogPostData = useCallback(async () => {
    const variables = {
      input: {
        id: get(data, 'id'),
        title: get(data, 'title'),
        data: JSON.stringify(get(data, 'data', {})),
        tags: get(data, 'tags'),
        description: get(data, 'description'),
        status: POST_STATE.DRAFT,
      },
    };
    isEmpty(get(rawDefaultData, 'data.getPost', {})) ? await postPost(variables) : await mutatePost(variables);
    return variables.input;
  }, [data, mutatePost, postPost, rawDefaultData]);
  const onPostUpdateBlogData = useCallback(async () => {
    navigate('/blogmanager', { replace: true });
  }, [navigate]);

  const [onSubmit] = useDataUpdateWrapper(updateBlogPostData, onPostUpdateBlogData, DataUpdateOptions);

  if (loading) {
    return (
      <div className="w-full *:text-center mx-auto">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container-div container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-4">Blog Creation</h1>
      <div className="bg-muted shadow-md rounded-lg p-4 mb-4 flex flex-col">
        <button
          className={`mb-4 bg-primary text-input py-2 px-4 rounded-md flex items-center justify-center ${
            postingPost || updatingPost ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'
          }`}
          disabled={postingPost || updatingPost}
          onClick={onSubmit}
        >
          <CheckBoxOutlined className="mr-2" />
          Submit
        </button>
        <input
          type="text"
          placeholder="Post Title"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          defaultValue={get(data, 'title', '')}
          onChange={e => {
            const newTitle = e.target.value;
            setData(currentData => ({ ...currentData, title: newTitle }));
          }}
        />
        <textarea
          placeholder="Post Description"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          defaultValue={get(data, 'description', '')}
          onChange={e => {
            const newDescription = e.target.value;
            setData(currentData => ({
              ...currentData,
              description: newDescription,
            }));
          }}
        />
        <input
          type="text"
          placeholder="Post Tags (Separated by comma)"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          defaultValue={get(data, 'tags', []).join(', ')}
          onChange={e => {
            const newTags = e.target.value;
            setData(currentData => ({
              ...currentData,
              tags: newTags
                .split(',')
                .map(item => trim(item))
                .filter(item => item),
            }));
          }}
        />
        <div className="flex flex-wrap mb-4">
          {get(data, 'tags', []).map((item, index) => (
            <span key={`${item} ${index}`} className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2">
              {item}
            </span>
          ))}
        </div>
      </div>
      <MdEditor
        style={{ height: '70vh' }}
        config={{
          markdownClass: 'post-markdown-content',
          imageAccept: '.jpg, .png, .gif',
          allowPasteImage: true,
        }}
        value={get(data, 'data.text', '')}
        renderHTML={text => mdParser.render(text)}
        onImageUpload={async file => {
          const prefix = `${postID}-Images/`.replace(/\s+/g, '_');
          const key = `${uuid()}-${get(file, 'name', 'Image')}`.replace(/\s+/g, '_');
          const { key: uploadedKey } = await uploadFile(file, key, prefix);
          return await getPhotoURL(uploadedKey);
        }}
        onChange={({ text }) => {
          setData(currentData => ({ ...currentData, data: { text } }));
        }}
      />
      {postingPost || updatingPost ? (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : null}
    </div>
  );
}
