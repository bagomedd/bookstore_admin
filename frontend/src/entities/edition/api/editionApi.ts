import { baseApi } from "@shared/api/baseApi";
import type { Edition } from "../model/edition";

export interface EditionQueryParams {
    limit?: number;
    offset?: number;
    author?: string;
    title?: string;
    publisherName?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const editionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        editions: builder.query<Edition[], EditionQueryParams | void>({
            query: (params) => ({
                url: "/editions",
                params: params || {},
            }),
            providesTags: ["Editions"],
        }),
        createEdition: builder.mutation<Edition, Partial<Edition>>({
            query: (body) => ({
                url: "/editions",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Editions", "Publishers"],
        }),
        updateEdition: builder.mutation<Edition, { id: string; body: Partial<Edition> }>({
            query: ({ id, body }) => ({
                url: `/editions/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Editions", "Publishers"],
        }),
        deleteEdition: builder.mutation<boolean, string>({
            query: (id) => ({
                url: `/editions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Editions", "Publishers"],
        }),
    }),
});

export const { useEditionsQuery, useLazyEditionsQuery, useCreateEditionMutation, useUpdateEditionMutation, useDeleteEditionMutation } = editionApi;
