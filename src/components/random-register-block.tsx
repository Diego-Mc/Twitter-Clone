import React from 'react'
import Chance from 'chance'
import { useRegisterMutation } from '../features/api/api.slice'
import { utilService } from '../services/util.service'
import { uploadImg } from '../services/upload.service'
const chance = new Chance()

interface RandomRegisterBlockProps {}

export const RandomRegister: React.FC<RandomRegisterBlockProps> = ({}) => {
  const [register] = useRegisterMutation()

  const handleRandomRegister = async () => {
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
    register(userCred)
  }

  return (
    <section className="login-block">
      <h3 className="title">Here to test the app?</h3>
      <small>
        Click on the button below to instantly log in as a new random user for
        testing purposes!
      </small>
      <div className="login-options">
        <button className="auth-btn login-btn" onClick={handleRandomRegister}>
          Register test user
        </button>
      </div>
    </section>
  )
}
