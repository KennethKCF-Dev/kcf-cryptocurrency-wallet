import React from 'react'
import './ClipboardButton.css';

function ClipboardButton(
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
) {
  return (
    <button className={`btn ${buttonStyle} ${buttonSize}`}
        onClick={onClick}
        type={type}
    >
        {children}
    </button>
  )
}

export default ClipboardButton