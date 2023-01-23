import { matchRoutes, useLocation } from 'react-router-dom'

const routes = [
  { path: '/', name: 'home' },
  { path: '/explore', name: 'explore' },
  { path: '/profile/*', name: 'profile' },
  { path: '/bookmarks', name: 'bookmarks' },
  { path: '/post/:id', name: 'post' },
  { path: '/search', name: 'search' },
]

export const useGetRouteName = () => {
  const location = useLocation()
  const x = matchRoutes(routes, location)
  return x?.[0].route.name
}
