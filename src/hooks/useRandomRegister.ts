import { utilService } from './../services/util.service'
import { Chance } from 'chance'
import { uploadImg } from '../services/upload.service'

const chance = new Chance()

export const useRandomRegister = () => {
  return [trigger]
}

export const trigger = async () => {
  const gender = chance.pickone(['male' as const, 'female' as const])
  const rand = utilService.getRandomInt(0, 78)

  const coverUrl = await fetch(`https://random.imagecdn.app/600/200`, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
    .then((x) => x.blob())
    .then((x) => uploadImg(x))
    .then((x) => x.url)

  const userCred = {
    username: chance.twitter().slice(1),
    email: chance.email({ domain: 'test.com' }),
    password: chance.word({ length: 8 }),
    fullName: chance.name({ gender }),
    imgUrl: `https://xsgames.co/randomusers/assets/avatars/${gender}/${rand}.jpg`,
    coverUrl,
  }
  return userCred
}
