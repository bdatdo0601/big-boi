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
        }
      }
      nextToken
    }
  }
`;
export const getEventMessageData = /* GraphQL */ `
  query GetEventMessageData($id: ID!) {
    getEventMessageData(id: $id) {
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
export const listEventMessageDatas = /* GraphQL */ `
  query ListEventMessageDatas(
    $filter: ModelEventMessageDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEventMessageDatas(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const eventMessageByTimestamp = /* GraphQL */ `
  query EventMessageByTimestamp(
    $timestamp: AWSTimestamp
    $sortDirection: ModelSortDirection
    $filter: ModelEventMessageDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    EventMessageByTimestamp(
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
