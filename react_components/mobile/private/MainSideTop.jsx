import {useRef, useEffect, useState} from "react";
import Head from "./Head";
import RemoteVideo from "./RemoteVideo";
import IncomingCallBanner from "./IncomingCallBanner";
import CallInfo from "./CallInfo";

export default function MainSideTop({
	room,
	text,
	button,
	reference,
	buttonHandler,
	callButton,
	audioCallButton,
	incomingCallBanner,
	call_offer,
	makeCall,
	showRemoteCamera,
    remoteVideo,
    endCall,
	micControl,
	camControl,
	acceptButton,
	callControlStyle,
	audioCallColor,
	videoCallColor,
	setAudioCallColor,
	setVideoCallColor,
	callInfo,
	rooms
}) {
	const mainTopBar = useRef(null);

	useEffect(() => {
        reference.current = mainTopBar.current;
    }, []);

	function makeCall_wrapper_all() {
		if (call_offer.calling) {
			endCall();
		} else {
			call_offer.calling = true;
			call_offer.room = room;
    		call_offer.video = true;
			makeCall(true, room);
			setVideoCallColor(true);
		}
	}

	function makeCall_wrapper_audio() {
		if (call_offer.calling) {
			endCall();
		} else {
			call_offer.calling = true;
			call_offer.room = room;
			makeCall(false, room);
			setAudioCallColor(true);
		}
	}

    return (
        <div id="mainHeadline" ref={mainTopBar} >
			{button ? <div id="button_back" onPointerDown={buttonHandler}>
				<svg fill="#505050" width="80%" height="80%" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M222.927 580.115l301.354 328.512c24.354 28.708 20.825 71.724-7.883 96.078s-71.724 20.825-96.078-7.883L19.576 559.963a67.846 67.846 0 01-13.784-20.022 68.03 68.03 0 01-5.977-29.488l.001-.063a68.343 68.343 0 017.265-29.134 68.28 68.28 0 011.384-2.6 67.59 67.59 0 0110.102-13.687L429.966 21.113c25.592-27.611 68.721-29.247 96.331-3.656s29.247 68.721 3.656 96.331L224.088 443.784h730.46c37.647 0 68.166 30.519 68.166 68.166s-30.519 68.166-68.166 68.166H222.927z"/></svg>
			</div> : null}
            <Head text = {text} />
			{callButton ? 
				<div id="button_call" onPointerDown={makeCall_wrapper_all}>
					<svg width="80%" height="80%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z" stroke={videoCallColor ? "#ff0000" : "#606060"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</div> : null}

			{audioCallButton ? 
				<div id="button_call_audio" onPointerDown={makeCall_wrapper_audio}>
					<svg width="80%" height="80%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M10.0376 5.31617L10.6866 6.4791C11.2723 7.52858 11.0372 8.90532 10.1147 9.8278C10.1147 9.8278 10.1147 9.8278 10.1147 9.8278C10.1146 9.82792 8.99588 10.9468 11.0245 12.9755C13.0525 15.0035 14.1714 13.8861 14.1722 13.8853C14.1722 13.8853 14.1722 13.8853 14.1722 13.8853C15.0947 12.9628 16.4714 12.7277 17.5209 13.3134L18.6838 13.9624C20.2686 14.8468 20.4557 17.0692 19.0628 18.4622C18.2258 19.2992 17.2004 19.9505 16.0669 19.9934C14.1588 20.0658 10.9183 19.5829 7.6677 16.3323C4.41713 13.0817 3.93421 9.84122 4.00655 7.93309C4.04952 6.7996 4.7008 5.77423 5.53781 4.93723C6.93076 3.54428 9.15317 3.73144 10.0376 5.31617Z" stroke={audioCallColor ? "#ff0000" : "#606060"} strokeWidth="1.5" strokeLinecap="round"/>
					</svg>
				</div> : null}

			{incomingCallBanner ? 
				<IncomingCallBanner makeCall={makeCall}
									endCall={endCall}
									call_offer={call_offer}
									micControl={micControl}
									camControl={camControl}
									acceptButton={acceptButton}
									callControlStyle={callControlStyle}>
				</IncomingCallBanner> : null}

            <svg id="MainSideBarTopGradient" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="lgrad" x1="100%" y1="50%" x2="0%" y2="50%" gradientTransform="rotate(90)" >
						<stop offset="0%" stopOpacity="0" />
						<stop offset="50%" stopOpacity="1" />
					</linearGradient>
				</defs>
				<rect width="100%" height="100%" fill="url(#lgrad)" />
			</svg>
			{callInfo ? <CallInfo text={rooms[call_offer.room].name} src={rooms[call_offer.room].pic_small}></CallInfo> : null}
			<RemoteVideo view={showRemoteCamera} source={remoteVideo}></RemoteVideo>
        </div>
    );
};