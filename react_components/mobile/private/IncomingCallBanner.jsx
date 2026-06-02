"use strict"
import {useState} from "react";

export default function IncomingCallBanner({makeCall, endCall, call_offer, micControl, camControl, acceptButton, callControlStyle}) {
    const [mic_swState, setMic_swState] = useState(false);
    const [cam_swState, setCam_swState] = useState(false);



    function makeCall_wrap() {
        makeCall(call_offer.video, call_offer.room);
    }

    return (
        <div id="incomingCallBanner" className={callControlStyle}>
            <div id="decline" onClick={endCall}>
                <svg width="60%" height="60%" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#aa0000" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/></svg>
            </div>

            {!acceptButton ? <div id="mic_sw" onPointerDown={() => {
                                setMic_swState(!mic_swState);
                                micControl();
                            }}>
                <svg width="60%" height="60%" viewBox="0 0 1024 1024" className="icon" xmlns="http://www.w3.org/2000/svg"><path fill={mic_swState ? "#FFA500" : "#707070"} d="M412.16 592.128l-45.44 45.44A191.232 191.232 0 01320 512V256a192 192 0 11384 0v44.352l-64 64V256a128 128 0 10-256 0v256c0 30.336 10.56 58.24 28.16 80.128zm51.968 38.592A128 128 0 00640 512v-57.152l64-64V512a192 192 0 01-287.68 166.528l47.808-47.808zM314.88 779.968l46.144-46.08A222.976 222.976 0 00480 768h64a224 224 0 00224-224v-32a32 32 0 1164 0v32a288 288 0 01-288 288v64h64a32 32 0 110 64H416a32 32 0 110-64h64v-64c-61.44 0-118.4-19.2-165.12-52.032zM266.752 737.6A286.976 286.976 0 01192 544v-32a32 32 0 0164 0v32c0 56.832 21.184 108.8 56.064 148.288L266.752 737.6z"/><path fill={mic_swState ? "#FFA500" : "#707070"} d="M150.72 859.072a32 32 0 01-45.44-45.056l704-708.544a32 32 0 0145.44 45.056l-704 708.544z"/></svg>
            </div> : null}

            {call_offer.video && !acceptButton ? <div id="cam_sw" onPointerDown={() => {
                                                    setCam_swState(!cam_swState);
                                                    camControl();
                                                }}>
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L20.7071 4.70711Z" fill={cam_swState ? "#FFA500" : "#707070"}/>
                    <path d="M13 5C13.8933 5 14.7181 5.29281 15.3839 5.78768L13.9383 7.2333C13.6585 7.08438 13.3391 7 13 7H6C4.89543 7 4 7.89543 4 9V15C4 15.5959 4.26065 16.131 4.67416 16.4974L3.25865 17.9129C2.48379 17.1834 2 16.1482 2 15V9C2 6.79086 3.79086 5 6 5H13Z" fill={cam_swState ? "#FFA500" : "#707070"}/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M13 17H9.82843L7.82843 19H13C15.0938 19 16.8118 17.3913 16.9855 15.3425L20.306 16.8424C21.1003 17.2012 22 16.6203 22 15.7488V8.27144C22 7.34868 21.0019 6.77121 20.202 7.23108L18.7799 8.04856L15 11.8284V15C15 16.1046 14.1046 17 13 17ZM17 13.1544L20 14.5096V9.65407L17 11.3786V13.1544Z" fill={cam_swState ? "#FFA500" : "#707070"}/>
                </svg>
            </div> : null}

            {acceptButton ? <div id="accept" onPointerDown={makeCall_wrap}>
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0376 5.31617L10.6866 6.4791C11.2723 7.52858 11.0372 8.90532 10.1147 9.8278C10.1147 9.8278 10.1147 9.8278 10.1147 9.8278C10.1146 9.82792 8.99588 10.9468 11.0245 12.9755C13.0525 15.0035 14.1714 13.8861 14.1722 13.8853C14.1722 13.8853 14.1722 13.8853 14.1722 13.8853C15.0947 12.9628 16.4714 12.7277 17.5209 13.3134L18.6838 13.9624C20.2686 14.8468 20.4557 17.0692 19.0628 18.4622C18.2258 19.2992 17.2004 19.9505 16.0669 19.9934C14.1588 20.0658 10.9183 19.5829 7.6677 16.3323C4.41713 13.0817 3.93421 9.84122 4.00655 7.93309C4.04952 6.7996 4.7008 5.77423 5.53781 4.93723C6.93076 3.54428 9.15317 3.73144 10.0376 5.31617Z" stroke="#00aa00" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div> : null}
        </div>
    );
}