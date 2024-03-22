import React from 'react'
import "./Modal.css";

function Modal({ closeModal, getLocation }) {
    return(
        <div className="modal-background">
            <div className="modal-box">
                <center><h1>Welcome!</h1></center>
                <p>Let's get started by allowing access to your location. This will be needed to find your matches.</p>
                <button onClick={() => {
                    getLocation();
                    closeModal(false);
                }} id="allow-button">Allow Location</button>
            </div>
        </div>
    )
}

export default Modal