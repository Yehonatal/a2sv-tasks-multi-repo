import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Job, JobPosting, JobPostById } from "@/lib/type";

// Define response types for bookmarks
interface BookmarksResponse {
    data: any[];
    success: boolean;
    message: string;
}

interface BookmarkActionResponse {
    success: boolean;
    message: string;
}

export const opportunitiesApi = createApi({
    reducerPath: "opportunitiesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://akil-backend.onrender.com",
        prepareHeaders: (headers) => {
            // Always add the authorization header for the demo app
            headers.set("Authorization", "Bearer demo-token");
            return headers;
        },
    }),
    tagTypes: ["Opportunity", "Bookmark"],
    endpoints: (builder) => ({
        getAllOpportunities: builder.query<JobPosting, void>({
            query: () => "/opportunities/search",
            transformResponse: (response: any) => {
                return response;
            },
            providesTags: ["Opportunity"],
        }),
        getOpportunityById: builder.query<JobPostById, string>({
            query: (id: string) => `/opportunities/${id}`,
            transformResponse: (response: any) => {
                return response;
            },
            providesTags: (_result, _error, id) => [
                { type: "Opportunity", id },
            ],
        }),
        // Get all bookmarks
        getBookmarks: builder.query<BookmarksResponse, void>({
            query: () => ({
                url: "/bookmarks",
                headers: {
                    Authorization: "Bearer demo-token",
                    "Content-Type": "application/json",
                },
            }),
            providesTags: ["Bookmark"],
        }),
        // Create a bookmark
        createBookmark: builder.mutation<BookmarkActionResponse, string>({
            query: (eventId) => ({
                url: `/bookmarks/${eventId}`,
                method: "POST",
                body: {},
                headers: {
                    Authorization: "Bearer demo-token",
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["Bookmark", "Opportunity"],
        }),
        // Delete a bookmark
        deleteBookmark: builder.mutation<BookmarkActionResponse, string>({
            query: (eventId) => ({
                url: `/bookmarks/${eventId}`,
                method: "DELETE",
                headers: {
                    Authorization: "Bearer demo-token",
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["Bookmark", "Opportunity"],
        }),
    }),
});

export const {
    useGetAllOpportunitiesQuery,
    useGetOpportunityByIdQuery,
    useGetBookmarksQuery,
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
} = opportunitiesApi;

export const useGetAllOpportunitiesQueryWithRefetch = () => {
    const result = useGetAllOpportunitiesQuery();
    return {
        ...result,
        refetch: result.refetch,
    };
};
