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
      postType
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
      postType
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
      postType
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
        postType
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
        postType
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
        postType
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
  subscription OnCreateEventMessage($owner: String) {
    onCreateEventMessage(owner: $owner) {
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
      owner
    }
  }
`;
export const onUpdateEventMessage = /* GraphQL */ `
  subscription OnUpdateEventMessage($owner: String) {
    onUpdateEventMessage(owner: $owner) {
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
      owner
    }
  }
`;
export const onDeleteEventMessage = /* GraphQL */ `
  subscription OnDeleteEventMessage($owner: String) {
    onDeleteEventMessage(owner: $owner) {
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
      owner
    }
  }
`;
export const onCreatePrivateEventMessage = /* GraphQL */ `
  subscription OnCreatePrivateEventMessage($owner: String) {
    onCreatePrivateEventMessage(owner: $owner) {
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
      owner
    }
  }
`;
export const onUpdatePrivateEventMessage = /* GraphQL */ `
  subscription OnUpdatePrivateEventMessage($owner: String) {
    onUpdatePrivateEventMessage(owner: $owner) {
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
      owner
    }
  }
`;
export const onDeletePrivateEventMessage = /* GraphQL */ `
  subscription OnDeletePrivateEventMessage($owner: String) {
    onDeletePrivateEventMessage(owner: $owner) {
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
      owner
    }
  }
`;
