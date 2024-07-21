import { apiSlice } from "./api.slice";
const USER_AUTH = "/api/auth";
const USER = "/api/users";

export const userApiSclice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_AUTH}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_AUTH}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    getProfile: builder.mutation({
      query: () => ({
        url: `${USER}/profile`,
        method: 'GET',
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

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useGetProfileMutation } = userApiSclice;
