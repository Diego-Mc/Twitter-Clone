import React, { useRef, useState } from 'react'
import { ReactComponent as LogoIcon } from '../assets/icons/logo.svg'
import { ReactComponent as CameraIcon } from '../assets/icons/camera.svg'
import { FormInput } from './FormInput'
import { uploadImg } from '../services/upload.service'
import {
  useGetUserQuery,
  useUpdateDescriptionMutation,
  useUploadCoverPicMutation,
  useUploadProfilePicMutation,
} from '../features/api/api.slice'
import { UserProps } from '../types/models'
import { userService } from '../services/user.service'

interface uploadPicStageProps {
  uploadAreaRef: React.MutableRefObject<HTMLDivElement | null>
  onDragEnter: (ev: any) => void
  onDragLeave: (ev: any) => void
  onDrop: (ev: any) => Promise<void>
  imgUploadRef: React.MutableRefObject<HTMLInputElement | null>
  user?: UserProps
}

const ProfilePicStage: React.FC<uploadPicStageProps> = ({
  uploadAreaRef,
  onDragEnter,
  onDragLeave,
  onDrop,
  imgUploadRef,
  user,
}) => {
  return (
    <>
      <h2 className="title">Pick a profile picture</h2>
      <p className="info">Have a favorite selfie? Upload it now.</p>
      <section
        className="img-upload-section"
        onDragEnter={onDragEnter}
        onDragOver={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        ref={uploadAreaRef}>
        {user ? (
          <img src={user.imgUrl} className="profile-img" />
        ) : (
          <img src="/default-user-img.png" className="profile-img" />
        )}
        <div
          className="icon-wrap"
          onClick={() => imgUploadRef?.current?.click()}>
          <CameraIcon />
        </div>
      </section>
    </>
  )
}

const CoverPicStage: React.FC<uploadPicStageProps> = ({
  uploadAreaRef,
  onDragEnter,
  onDragLeave,
  onDrop,
  imgUploadRef,
  user,
}) => {
  return (
    <>
      <h2 className="title">Pick a header</h2>
      <p className="info">
        People who visit your profile will see it. Show your style.
      </p>
      <section
        className="cover-upload-section"
        onDragEnter={onDragEnter}
        onDragOver={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        ref={uploadAreaRef}>
        <div className="cover">
          {user?.coverUrl ? (
            <img src={user.coverUrl} className="profile-img" />
          ) : null}
        </div>
        <div
          className="icon-wrap"
          onClick={() => imgUploadRef?.current?.click()}>
          <CameraIcon />
        </div>
        <div className="user-wrapper">
          {user?.imgUrl ? (
            <>
              <img src={user.imgUrl} className="profile-img" />
              <h3 className="full-name">{user.fullName}</h3>
              <small className="username">@{user.username}</small>
            </>
          ) : (
            <>
              <img src="/default-user-img.png" className="profile-img" />
              <h3 className="full-name">Full Name</h3>
              <small className="username">@username</small>
            </>
          )}
        </div>
      </section>
    </>
  )
}

interface descriptionStageProps {
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
}

const DescriptionStage: React.FC<descriptionStageProps> = ({
  description,
  setDescription,
}) => {
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(ev.target.value)
  }

  return (
    <>
      <h2 className="title">Describe yourself</h2>
      <p className="info">
        What makes you special? Don't think too hard, just have fun with it.
      </p>
      <FormInput
        label="Your bio"
        id="description"
        className="bio-input"
        onChange={handleChange}
        value={description}
      />
    </>
  )
}

const FinalStage: React.FC = ({}) => {
  return <h2 className="title">Your profile is updated</h2>
}

interface SetupProfilePopupProps {
  onComposeClose: () => void
}

export const SetupProfilePopup: React.FC<SetupProfilePopupProps> = ({
  onComposeClose,
}) => {
  const uploadAreaRef = useRef<HTMLDivElement | null>(null)
  const imgUploadRef = useRef<HTMLInputElement | null>(null)
  const [screenCounter, setScreenCounter] = useState(0)
  const [uploadProfilePic] = useUploadProfilePicMutation()
  const [uploadCoverPic] = useUploadCoverPicMutation()
  const [updateDescription] = useUpdateDescriptionMutation()
  const { data: user } = useGetUserQuery(userService.getLoggedInUser()?._id)
  const [description, setDescription] = useState(user?.description || '')

  const setImgUrl = ({ url }: { url: string }) => {
    if (screenCounter === 0) uploadProfilePic(url)
    if (screenCounter === 1) uploadCoverPic(url)
  }

  const handleUpload = async (ev: any) => {
    //TODO: check size and type
    setScreenCounter((prev) => prev + 1)
    const imgUrl = await uploadImg(ev.target.files[0])
    setImgUrl(imgUrl)
  }

  const handleDragEnter = (ev: any) => {
    ev.preventDefault()
    uploadAreaRef.current?.classList.add('dragover')
  }

  const handleDragLeave = (ev: any) => {
    ev.preventDefault()
    uploadAreaRef.current?.classList.remove('dragover')
  }

  const handleDrop = async (ev: any) => {
    ev.preventDefault()
    uploadAreaRef.current?.classList.remove('dragover')
    console.log(JSON.stringify(ev.dataTransfer.files[0].name))
    //TODO: check size and type
    setScreenCounter((prev) => prev + 1)
    const imgUrl = await uploadImg(ev.dataTransfer.files[0])
    setImgUrl(imgUrl)
  }

  const handleDescriptionSubmit = () => {
    console.log(description, 'dfsff')

    updateDescription(description)
    setScreenCounter((prev) => prev + 1)
  }

  return (
    <div className="popup" onClick={(e) => onComposeClose()}>
      <section
        className={`setup-profile-popup ${screenCounter === 3 ? 'final' : ''}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="logo-section">
          <LogoIcon className="logo" />
        </div>

        {screenCounter === 0 ? (
          <ProfilePicStage
            imgUploadRef={imgUploadRef}
            uploadAreaRef={uploadAreaRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            user={user}
          />
        ) : screenCounter === 1 ? (
          <CoverPicStage
            imgUploadRef={imgUploadRef}
            uploadAreaRef={uploadAreaRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            user={user}
          />
        ) : screenCounter === 2 ? (
          <DescriptionStage
            description={description}
            setDescription={setDescription}
          />
        ) : (
          <FinalStage />
        )}

        <form
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            opacity: 0,
          }}>
          <input
            onChange={handleUpload}
            type="file"
            ref={imgUploadRef}
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              opacity: 0,
            }}
          />
        </form>

        {screenCounter === 2 && description !== '' ? (
          <button className="skip-btn submit" onClick={handleDescriptionSubmit}>
            Next
          </button>
        ) : screenCounter === 3 ? (
          <button className="skip-btn submit" onClick={onComposeClose}>
            See profile
          </button>
        ) : (
          <button
            className="skip-btn"
            onClick={() => setScreenCounter((prev) => prev + 1)}>
            Skip for now
          </button>
        )}
      </section>
    </div>
  )
}
