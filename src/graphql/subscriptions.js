/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onCreatePost(filter: $filter, owner: $owner) {
      id
      title
      description
      status
      tags
      data
      postType
      updatedAt
      externalLink
      comments {
        nextToken
        __typename
      }
      owner
      createdAt
      __typename
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onUpdatePost(filter: $filter, owner: $owner) {
      id
      title
      description
      status
      tags
      data
      postType
      updatedAt
      externalLink
      comments {
        nextToken
        __typename
      }
      owner
      createdAt
      __typename
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onDeletePost(filter: $filter, owner: $owner) {
      id
      title
      description
      status
      tags
      data
      postType
      updatedAt
      externalLink
      comments {
        nextToken
        __typename
      }
      owner
      createdAt
      __typename
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onCreateComment(filter: $filter, owner: $owner) {
      id
      postID
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
        __typename
      }
      content
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onUpdateComment(filter: $filter, owner: $owner) {
      id
      postID
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
        __typename
      }
      content
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onDeleteComment(filter: $filter, owner: $owner) {
      id
      postID
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
        __typename
      }
      content
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateEventMessage = /* GraphQL */ `
  subscription OnCreateEventMessage(
    $filter: ModelSubscriptionEventMessageFilterInput
    $owner: String
  ) {
    onCreateEventMessage(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onUpdateEventMessage = /* GraphQL */ `
  subscription OnUpdateEventMessage(
    $filter: ModelSubscriptionEventMessageFilterInput
    $owner: String
  ) {
    onUpdateEventMessage(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onDeleteEventMessage = /* GraphQL */ `
  subscription OnDeleteEventMessage(
    $filter: ModelSubscriptionEventMessageFilterInput
    $owner: String
  ) {
    onDeleteEventMessage(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onCreatePrivateEventMessage = /* GraphQL */ `
  subscription OnCreatePrivateEventMessage(
    $filter: ModelSubscriptionPrivateEventMessageFilterInput
    $owner: String
  ) {
    onCreatePrivateEventMessage(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onUpdatePrivateEventMessage = /* GraphQL */ `
  subscription OnUpdatePrivateEventMessage(
    $filter: ModelSubscriptionPrivateEventMessageFilterInput
    $owner: String
  ) {
    onUpdatePrivateEventMessage(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onDeletePrivateEventMessage = /* GraphQL */ `
  subscription OnDeletePrivateEventMessage(
    $filter: ModelSubscriptionPrivateEventMessageFilterInput
    $owner: String
  ) {
    onDeletePrivateEventMessage(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onCreateReference = /* GraphQL */ `
  subscription OnCreateReference(
    $filter: ModelSubscriptionReferenceFilterInput
    $owner: String
  ) {
    onCreateReference(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onUpdateReference = /* GraphQL */ `
  subscription OnUpdateReference(
    $filter: ModelSubscriptionReferenceFilterInput
    $owner: String
  ) {
    onUpdateReference(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onDeleteReference = /* GraphQL */ `
  subscription OnDeleteReference(
    $filter: ModelSubscriptionReferenceFilterInput
    $owner: String
  ) {
    onDeleteReference(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onCreatePrivateReference = /* GraphQL */ `
  subscription OnCreatePrivateReference(
    $filter: ModelSubscriptionPrivateReferenceFilterInput
    $owner: String
  ) {
    onCreatePrivateReference(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onUpdatePrivateReference = /* GraphQL */ `
  subscription OnUpdatePrivateReference(
    $filter: ModelSubscriptionPrivateReferenceFilterInput
    $owner: String
  ) {
    onUpdatePrivateReference(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
export const onDeletePrivateReference = /* GraphQL */ `
  subscription OnDeletePrivateReference(
    $filter: ModelSubscriptionPrivateReferenceFilterInput
    $owner: String
  ) {
    onDeletePrivateReference(filter: $filter, owner: $owner) {
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
      __typename
    }
  }
`;
