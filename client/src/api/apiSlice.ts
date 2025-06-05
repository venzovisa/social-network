import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "../common/constants";
import { getToken } from "../common/getToken";
import { Comment, Post, User } from "../types/types";

const token = getToken();

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post", "PostComments", "Comment", "Feed", "User"],
  endpoints: (builder) => ({
    getUserDetails: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: () => [{ type: "User", id: "UserId" }],
    }),
    updateUser: builder.mutation<Promise<User & { status: number }>, FormData>({
      query: (data) => ({
        url: `/users`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    // Posts
    getPosts: builder.query<Post[], number>({
      query: (id) => `/users/${id}/posts`,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Post", id } as const)),
              { type: "Post", id: "PostId" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Post", id: "PostId" }],
    }),
    getPostComments: builder.query<Comment[], number>({
      query: (id) => `/posts/${id}`,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(
                ({ id }) => ({ type: "PostComments", id } as const)
              ),
              { type: "PostComments", id: "PostCommentsId" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "PostComments", id: "PostCommentsId" }],
      transformResponse: (response: Post) => {
        return response.comments;
      },
    }),
    postsReactions: builder.mutation<
      Promise<Comment & { status: number }>,
      { id: number; reaction: number }
    >({
      query: ({ id, reaction }) => ({
        url: `/posts/${id}/react`,
        method: "PUT",
        body: reaction,
      }),
      invalidatesTags: ["Post", "Comment"],
    }),
    commentReactions: builder.mutation<
      Promise<Comment & { status: number }>,
      { id: number; reaction: number }
    >({
      query: ({ id, reaction }) => ({
        url: `/comments/${id}/react`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reaction }),
      }),
      invalidatesTags: ["PostComments", "Feed"],
    }),
    createPost: builder.mutation<Promise<Post & { status: number }>, FormData>({
      query: (data) => ({
        url: `/posts`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post", "Feed"],
    }),
    updatePost: builder.mutation<
      Promise<Post & { status: number }>,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Post", "Feed"],
    }),
    deletePost: builder.mutation<Promise<Post & { status: number }>, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Post", id },
        { type: "Feed", id }, // invalidate this post from feed
        { type: "Feed", id: "LIST" }, // optional: refresh feed list
        { type: "Feed", id: "POPULAR" }, // optional: refresh popular feed
      ],
    }),
    updateComment: builder.mutation<
      Promise<Comment & { status: number }>,
      FormData & { id: number }
    >({
      query: ({ id, ...data }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Post", "Comment"],
    }),
    deleteComment: builder.mutation<
      Promise<Comment & { status: number }>,
      number
    >({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post", "Comment"],
    }),
    getUserComments: builder.query<Comment[], number>({
      query: (id) => `/users/${id}/comments`,
      providesTags: ["Post", "Comment"],
    }),
    getFeedPopular: builder.query<Post[], null>({
      query: () => `/feed/popular`,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Feed", id } as const)),
              { type: "Feed", id: "POPULAR" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'POPULAR' }` is invalidated
            [{ type: "Feed", id: "POPULAR" }],
    }),
    getFeed: builder.query<Post[], null>({
      query: () => `/feed`,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Feed", id } as const)),
              { type: "Feed", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Feed", id: "LIST" }],
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetPostsQuery,
  useUpdatePostMutation,
  useUpdateCommentMutation,
  useGetUserCommentsQuery,
  useGetFeedPopularQuery,
  useGetFeedQuery,
  usePostsReactionsMutation,
  useDeletePostMutation,
  useCreatePostMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteCommentMutation,
  useGetPostCommentsQuery,
  useCommentReactionsMutation,
} = apiSlice;
