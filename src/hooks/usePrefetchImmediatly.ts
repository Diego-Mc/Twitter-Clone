import { useAppDispatch } from './../features/store'
import { useEffect } from 'react'
import { PrefetchOptions } from '@reduxjs/toolkit/dist/query/core/module'
import { apiSlice } from './../features/api/api.slice'

type EndpointNames = keyof typeof apiSlice.endpoints

export function usePrefetchImmediately<T extends EndpointNames>(
  endpoint: T,
  arg: Parameters<typeof apiSlice.endpoints[T]['initiate']>[0],
  options: PrefetchOptions = {}
) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(apiSlice.util.prefetch(endpoint as any, arg as any, options))
  }, [])
}
