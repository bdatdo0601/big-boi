/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
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
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
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
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
export const updateEventMessageData = /* GraphQL */ `
  mutation UpdateEventMessageData(
    $input: UpdateEventMessageDataInput!
    $condition: ModelEventMessageDataConditionInput
  ) {
    updateEventMessageData(input: $input, condition: $condition) {
      id
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
export const deleteEventMessageData = /* GraphQL */ `
  mutation DeleteEventMessageData(
    $input: DeleteEventMessageDataInput!
    $condition: ModelEventMessageDataConditionInput
  ) {
    deleteEventMessageData(input: $input, condition: $condition) {
      id
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
export const createEventMessageData = /* GraphQL */ `
  mutation CreateEventMessageData(
    $input: CreateEventMessageDataInput!
    $condition: ModelEventMessageDataConditionInput
  ) {
    createEventMessageData(input: $input, condition: $condition) {
      id
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
