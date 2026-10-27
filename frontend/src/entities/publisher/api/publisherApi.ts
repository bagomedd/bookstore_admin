import { baseApi } from "@shared/api/baseApi";
import type { Publisher } from "../model/publisher";

export interface PublisherQueryParams {
    limit?: number;
    offset?: number;
    publisherName?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const publisherApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        publishers: builder.query<Publisher[], PublisherQueryParams | void>({
            query: (params) => ({
                url: "/publishers",
                params: params || {},
            }),
            providesTags: ["Publishers"],
        }),
        createPublisher: builder.mutation<Publisher, Partial<Publisher>>({
            query: (body) => ({
                url: "/publishers",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Publishers", "Editions"],
        }),
        updatePublisher: builder.mutation<Publisher, { id: string; body: Partial<Publisher> }>({
            query: ({ id, body }) => ({
                url: `/publishers/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Publishers", "Editions"],
        }),
        deletePublisher: builder.mutation<boolean, string>({
            query: (id) => ({
                url: `/publishers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Publishers", "Editions"],
        }),
    }),
});

export const { usePublishersQuery, useLazyPublishersQuery, useCreatePublisherMutation, useUpdatePublisherMutation, useDeletePublisherMutation } =
    publisherApi;
