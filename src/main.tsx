import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './assets/styles/main.scss'
import { store } from './features/store'
import * as timeago from 'timeago.js'

const twitter = (number: number, index: number): [string, string] => {
  return [
    ['now', 'right now'],
    ['%ss', 'in %ss'],
    ['1m', 'in 1m'],
    ['%sm', 'in %sm'],
    ['1h', 'in 1h'],
    ['%sh', 'in %sh'],
    ['1d', 'in 1d'],
    ['%sd', 'in %sd'],
    ['1w', 'in 1w'],
    ['%sw', 'in %sw'],
    ['1mo', 'in 1mo'],
    ['%smo', 'in %smo'],
    ['1yr', 'in 1yr'],
    ['%syr', 'in %syr'],
  ][index] as [string, string]
}

timeago.register('twitter', twitter)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
