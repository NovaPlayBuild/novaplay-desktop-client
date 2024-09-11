import { NovaPlayRelease } from 'common/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function useGetNovaPlayListings() {
  const queryClient = useQueryClient()
  const queryKey = `getNovaPlayListings`
  const query = useQuery<Record<string, NovaPlayRelease> | null>({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await window.api.getNovaPlayListings()
      if (!response) return null
      return response
    },
    refetchOnWindowFocus: false
  })

  return {
    data: query,
    isLoading: query.isLoading || query.isFetching,
    invalidateQuery: async () =>
      queryClient.invalidateQueries({ queryKey: [queryKey] })
  }
}
