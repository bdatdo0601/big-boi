/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
      id
      title
      description
      status
      tags
      data
      updatedAt
      createdAt
      comments {
        items {
          id
          postID
          content
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
      id
      title
      description
      status
      tags
      data
      updatedAt
      createdAt
      comments {
        items {
          id
          postID
          content
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
      id
      title
      description
      status
      tags
      data
      updatedAt
      createdAt
      comments {
        items {
          id
          postID
          content
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      postID
      content
      createdAt
      updatedAt
      post {
        id
        title
        description
        status
        tags
        data
        updatedAt
        createdAt
        comments {
          nextToken
        }
      }
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      postID
      content
      createdAt
      updatedAt
      post {
        id
        title
        description
        status
        tags
        data
        updatedAt
        createdAt
        comments {
          nextToken
        }
      }
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      postID
      content
      createdAt
      updatedAt
      post {
        id
        title
        description
        status
        tags
        data
        updatedAt
        createdAt
        comments {
          nextToken
        }
      }
    }
  }
`;
export const onCreateEventMessage = /* GraphQL */ `
  subscription OnCreateEventMessage {
    onCreateEventMessage {
      id
      type
      sourceID
      source
      eventType
      content
      metadata
      publishInfo
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateEventMessage = /* GraphQL */ `
  subscription OnUpdateEventMessage {
    onUpdateEventMessage {
      id
      type
      sourceID
      source
      eventType
      content
      metadata
      publishInfo
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteEventMessage = /* GraphQL */ `
  subscription OnDeleteEventMessage {
    onDeleteEventMessage {
      id
      type
      sourceID
      source
      eventType
      content
      metadata
      publishInfo
      timestamp
      createdAt
      updatedAt
    }
  }
`;
