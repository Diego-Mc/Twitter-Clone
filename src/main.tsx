import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './assets/styles/main.scss'
import { store } from './features/store'
import * as timeago from 'timeago.js'

const twitterLong = (number: number, index: number): [string, string] => {
  return [
    ['just now', 'right now'],
    ['%ss ago', 'in %ss'],
    ['1m ago', 'in 1m'],
    ['%sm ago', 'in %sm'],
    ['1h ago', 'in 1h'],
    ['%sh ago', 'in %sh'],
    ['1d ago', 'in 1d'],
    ['%sd ago', 'in %sd'],
    ['1w ago', 'in 1w'],
    ['%sw ago', 'in %sw'],
    ['1mo ago', 'in 1mo'],
    ['%smo ago', 'in %smo'],
    ['1yr ago', 'in 1yr'],
    ['%syr ago', 'in %syr'],
  ][index] as [string, string]
}

timeago.register('twitter-long', twitterLong)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
