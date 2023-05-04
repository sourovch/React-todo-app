import { gql } from '@apollo/client';

export const CREATE_USER_QUERY = gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      email
      name
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          name
          image {
            url
          }
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

export const TOKEN_VALIDATE_QUERY = gql`
  query AuthenticatedItem {
    authenticatedItem {
      ... on User {
        name
        image {
          url
        }
        id
      }
    }
  }
`;

export const GET_FOLDERS_QUERY = gql`
  query get_folders {
    authenticatedItem {
      ... on User {
        id
        folders {
          id
          name
        }
      }
    }
  }
`;

export const FOLDER_TASK_QUERY = gql`
  query Query(
    $where: folderWhereInput!
    $orderBy: [TodoOrderByInput!]!
  ) {
    authenticatedItem {
      ... on User {
        id
        folders(where: $where) {
          id
          name
          todos(orderBy: $orderBy) {
            id
            due
            task
            isDone
            createdAt
          }
          todosCount
        }
      }
    }
  }
`;

export const ROOT_TASK_QUERY = gql`
  query Query($orderBy: [TodoOrderByInput!]!) {
    authenticatedItem {
      ... on User {
        id
        todosCount
        todos(orderBy: $orderBy) {
          id
          due
          task
          isDone
          createdAt
        }
      }
    }
  }
`;

export const CREATE_ROOT_TASK_MUTATION = gql`
  mutation createRootTask(
    $where: UserWhereUniqueInput!
    $data: UserUpdateInput!
  ) {
    updateUser(where: $where, data: $data) {
      id
    }
  }
`;

export const CREATE_FOLDER_TASK_MUTATION = gql`
  mutation Mutation(
    $where: folderWhereUniqueInput!
    $data: folderUpdateInput!
  ) {
    updatefolder(where: $where, data: $data) {
      id
    }
  }
`;

export const DELATE_TASK_MUTATION = gql`
  mutation Mutation($where: TodoWhereUniqueInput!) {
    deleteTodo(where: $where) {
      id
      task
    }
  }
`;

export const EDIT_TASK_MUTATION = gql`
  mutation Mutation(
    $data: TodoUpdateInput!
    $where: TodoWhereUniqueInput!
  ) {
    updateTodo(data: $data, where: $where) {
      id
    }
  }
`;

export const FOLDER_DELATE_MUTATION = gql`
  mutation Mutation($where: folderWhereUniqueInput!) {
    deletefolder(where: $where) {
      id
      name
    }
  }
`;

export const CREATE_FOLDER_MUTATION = gql`
  mutation Mutation(
    $where: UserWhereUniqueInput!
    $data: UserUpdateInput!
  ) {
    updateUser(where: $where, data: $data) {
      id
    }
  }
`;
