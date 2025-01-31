/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const PostByUpdatedAt = /* GraphQL */ `
  query PostByUpdatedAt(
    $status: PostStatus!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    PostByUpdatedAt(
      status: $status
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postID
        content
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEventMessage = /* GraphQL */ `
  query GetEventMessage($id: ID!) {
    getEventMessage(id: $id) {
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
export const listEventMessages = /* GraphQL */ `
  query ListEventMessages(
    $filter: ModelEventMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEventMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const EventMessageByTimestamp = /* GraphQL */ `
  query EventMessageByTimestamp(
    $type: String!
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEventMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    EventMessageByTimestamp(
      type: $type
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getPrivateEventMessage = /* GraphQL */ `
  query GetPrivateEventMessage($id: ID!) {
    getPrivateEventMessage(id: $id) {
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
export const listPrivateEventMessages = /* GraphQL */ `
  query ListPrivateEventMessages(
    $filter: ModelPrivateEventMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateEventMessages(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const PrivateEventMessageByTimestamp = /* GraphQL */ `
  query PrivateEventMessageByTimestamp(
    $type: String!
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateEventMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    PrivateEventMessageByTimestamp(
      type: $type
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getReference = /* GraphQL */ `
  query GetReference($id: ID!) {
    getReference(id: $id) {
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
export const listReferences = /* GraphQL */ `
  query ListReferences(
    $filter: ModelReferenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ReferenceByUpdatedAt = /* GraphQL */ `
  query ReferenceByUpdatedAt(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelReferenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ReferenceByUpdatedAt(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const ReferenceByClickCount = /* GraphQL */ `
  query ReferenceByClickCount(
    $type: String!
    $clickCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelReferenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ReferenceByClickCount(
      type: $type
      clickCount: $clickCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getPrivateReference = /* GraphQL */ `
  query GetPrivateReference($id: ID!) {
    getPrivateReference(id: $id) {
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
export const listPrivateReferences = /* GraphQL */ `
  query ListPrivateReferences(
    $filter: ModelPrivateReferenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateReferences(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const PrivateReferenceByUpdatedAt = /* GraphQL */ `
  query PrivateReferenceByUpdatedAt(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateReferenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    PrivateReferenceByUpdatedAt(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const PrivateReferenceByClickCount = /* GraphQL */ `
  query PrivateReferenceByClickCount(
    $type: String!
    $clickCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateReferenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    PrivateReferenceByClickCount(
      type: $type
      clickCount: $clickCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
