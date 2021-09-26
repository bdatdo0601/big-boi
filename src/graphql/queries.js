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
      updatedAt
      createdAt
      owner
      comments {
        items {
          id
          postID
          content
          createdAt
          updatedAt
          owner
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
        updatedAt
        createdAt
        owner
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
        updatedAt
        createdAt
        owner
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
        owner
        comments {
          nextToken
        }
      }
      owner
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
          owner
        }
        owner
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
