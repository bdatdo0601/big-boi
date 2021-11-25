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
        comments {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const postByUpdatedAt = /* GraphQL */ `
  query PostByUpdatedAt(
    $status: PostStatus
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
        comments {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
        }
      }
      nextToken
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
      }
      nextToken
    }
  }
`;
export const eventMessageByTimestamp = /* GraphQL */ `
  query EventMessageByTimestamp(
    $type: String
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
      }
      nextToken
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
      }
      nextToken
    }
  }
`;
export const privateEventMessageByTimestamp = /* GraphQL */ `
  query PrivateEventMessageByTimestamp(
    $type: String
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
      }
      nextToken
    }
  }
`;
