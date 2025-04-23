import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Job, JobPosting, JobPostById } from '@/lib/type';

export const opportunitiesApi = createApi({
  reducerPath: 'opportunitiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://akil-backend.onrender.com' }),
  endpoints: (builder) => ({
    getAllOpportunities: builder.query<JobPosting, void>({
      query: () => '/opportunities/search',
      transformResponse: (response: any) => {
        console.log('API Response:', response);
        return response;
      },
    }),
    getOpportunityById: builder.query<JobPostById, string>({
      query: (id: string) => `/opportunities/${id}`,
      transformResponse: (response: any) => {
        console.log('Job Detail Response:', response);
        return response;
      },
    }),
  }),
});

export const { 
  useGetAllOpportunitiesQuery, 
  useGetOpportunityByIdQuery,
} = opportunitiesApi;

export const useGetAllOpportunitiesQueryWithRefetch = () => {
  const result = useGetAllOpportunitiesQuery();
  return {
    ...result,
    refetch: result.refetch,
  };
};
