import { apiSlice } from "./api.slice";
const USER_AUTH = "/api/auth";

export const userApiSclice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_AUTH}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_AUTH}/logout`,
        method: 'POST',
      })
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = userApiSclice;
