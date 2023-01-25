export const utilService = {
  getMatches,
  getHashtags,
  getRandomInt,
}

function getMatches(string: string, regex: RegExp, index = 1) {
  var matches = []
  var match
  while ((match = regex.exec(string))) {
    matches.push(match[index])
  }
  return matches
}

function getHashtags(str: string) {
  const hashtagReg = /#([A-Za-z][A-Za-z0-9_]*)/g
  return getMatches(str, hashtagReg, 0)
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
