import React from 'react'

interface UserPreviewProps {}

export const UserPreview: React.FC<UserPreviewProps> = ({}) => {
  return (
    <article className="user-preview">
      <div className="img-container">
        <img src="default-user-img.png" alt="" className="user-img" />
      </div>
      <div className="preview-content">
        <div className="user-info-container">
          <div className="info">
            <h5 className="full-name link">Diego Mc</h5>
            <p className="username">@DiegoMc99</p>
          </div>
          <button className="follow-btn black pill">Follow</button>
        </div>
        <div className="description">
          <span className="text">
            good cats being workers | unionized | mascot @JobertTheCat. see also
            @translatedcats, @thereisnocat_, @tc_notcats. ko-fi tips
            appreciated!
          </span>
        </div>
      </div>
    </article>
  )
}
