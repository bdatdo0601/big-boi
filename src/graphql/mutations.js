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
      postType
      updatedAt
      externalLink
      owner
      createdAt
      comments {
        items {
          id
          postID
          content
          owner
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
      postType
      updatedAt
      externalLink
      owner
      createdAt
      comments {
        items {
          id
          postID
          content
          owner
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
      postType
      updatedAt
      externalLink
      owner
      createdAt
      comments {
        items {
          id
          postID
          content
          owner
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
      owner
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
        externalLink
        owner
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
      owner
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
        externalLink
        owner
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
      owner
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
        externalLink
        owner
        createdAt
        comments {
          nextToken
        }
      }
    }
  }
`;
export const createEventMessage = /* GraphQL */ `
  mutation CreateEventMessage(
    $input: CreateEventMessageInput!
    $condition: ModelEventMessageConditionInput
  ) {
    createEventMessage(input: $input, condition: $condition) {
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
export const updateEventMessage = /* GraphQL */ `
  mutation UpdateEventMessage(
    $input: UpdateEventMessageInput!
    $condition: ModelEventMessageConditionInput
  ) {
    updateEventMessage(input: $input, condition: $condition) {
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
export const deleteEventMessage = /* GraphQL */ `
  mutation DeleteEventMessage(
    $input: DeleteEventMessageInput!
    $condition: ModelEventMessageConditionInput
  ) {
    deleteEventMessage(input: $input, condition: $condition) {
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
export const createPrivateEventMessage = /* GraphQL */ `
  mutation CreatePrivateEventMessage(
    $input: CreatePrivateEventMessageInput!
    $condition: ModelPrivateEventMessageConditionInput
  ) {
    createPrivateEventMessage(input: $input, condition: $condition) {
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
export const updatePrivateEventMessage = /* GraphQL */ `
  mutation UpdatePrivateEventMessage(
    $input: UpdatePrivateEventMessageInput!
    $condition: ModelPrivateEventMessageConditionInput
  ) {
    updatePrivateEventMessage(input: $input, condition: $condition) {
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
export const deletePrivateEventMessage = /* GraphQL */ `
  mutation DeletePrivateEventMessage(
    $input: DeletePrivateEventMessageInput!
    $condition: ModelPrivateEventMessageConditionInput
  ) {
    deletePrivateEventMessage(input: $input, condition: $condition) {
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
export const createReference = /* GraphQL */ `
  mutation CreateReference(
    $input: CreateReferenceInput!
    $condition: ModelReferenceConditionInput
  ) {
    createReference(input: $input, condition: $condition) {
      id
      title
      url
      description
      extraData
      type
      clickCount
      updatedAt
      tags
      createdAt
      owner
    }
  }
`;
export const updateReference = /* GraphQL */ `
  mutation UpdateReference(
    $input: UpdateReferenceInput!
    $condition: ModelReferenceConditionInput
  ) {
    updateReference(input: $input, condition: $condition) {
      id
      title
      url
      description
      extraData
      type
      clickCount
      updatedAt
      tags
      createdAt
      owner
    }
  }
`;
export const deleteReference = /* GraphQL */ `
  mutation DeleteReference(
    $input: DeleteReferenceInput!
    $condition: ModelReferenceConditionInput
  ) {
    deleteReference(input: $input, condition: $condition) {
      id
      title
      url
      description
      extraData
      type
      clickCount
      updatedAt
      tags
      createdAt
      owner
    }
  }
`;
export const createPrivateReference = /* GraphQL */ `
  mutation CreatePrivateReference(
    $input: CreatePrivateReferenceInput!
    $condition: ModelPrivateReferenceConditionInput
  ) {
    createPrivateReference(input: $input, condition: $condition) {
      id
      title
      url
      description
      extraData
      type
      clickCount
      updatedAt
      tags
      createdAt
      owner
    }
  }
`;
export const updatePrivateReference = /* GraphQL */ `
  mutation UpdatePrivateReference(
    $input: UpdatePrivateReferenceInput!
    $condition: ModelPrivateReferenceConditionInput
  ) {
    updatePrivateReference(input: $input, condition: $condition) {
      id
      title
      url
      description
      extraData
      type
      clickCount
      updatedAt
      tags
      createdAt
      owner
    }
  }
`;
export const deletePrivateReference = /* GraphQL */ `
  mutation DeletePrivateReference(
    $input: DeletePrivateReferenceInput!
    $condition: ModelPrivateReferenceConditionInput
  ) {
    deletePrivateReference(input: $input, condition: $condition) {
      id
      title
      url
      description
      extraData
      type
      clickCount
      updatedAt
      tags
      createdAt
      owner
    }
  }
`;
