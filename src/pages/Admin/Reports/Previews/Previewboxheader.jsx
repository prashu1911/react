import { ImageElement } from 'components'
import React from 'react'

function Previewboxheader({ userData, reportName, comment, image }) {
  return (
    <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative', // ✅ This is critical
      height: '40px',
      width: '100%',
      marginBottom: 10,
      overflow:'hidden'
    }}
  >
    {/* Left: Logo */}
    <div style={{ flex: '0 0 auto' }}>
      {image && (
        <ImageElement
          previewSource={
            userData?.logo?.replace('com/storage','com/v1/storage') || '../../assets/admin-images/logo.svg'
          }
          className="logoUpdate2"
        />
      )}
    </div>
  
    {/* Center: Title */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        margin: 0,
      }}
    >
      <h3 className="reportCard_title mb-0">{reportName}</h3>
    </div>
  
    {/* Right: Spacer */}
    <div style={{ flex: '0 0 auto', width: image ? '30px' : '0px' }} />
  </div>
  
  )
}

export default Previewboxheader
