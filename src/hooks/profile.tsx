import { useLocation, useNavigate } from 'react-router-dom'

export const useProfileTab = () => {
  const loc = useLocation()
  const navigate = useNavigate()
  const locSplit = loc.pathname.split('/')
  const register: React.FC<string> = (pathname, tabName) => {
    const isPath = (pathName: string) => {
      return locSplit.at(-1) === pathName
    }

    return (
      <>
        <input type="radio" id={pathname} checked={isPath(pathname)} readOnly />
        <label
          className="tab"
          htmlFor={pathname}
          onClick={() => navigate(pathname, { replace: true })}>
          <span className="text">{tabName}</span>
        </label>
      </>
    )
  }

  return [register]
}
