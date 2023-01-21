export const useGetParams = (searchParams: URLSearchParams) => {
  const params: { [key: string]: string } = {}

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  return [params]
}
