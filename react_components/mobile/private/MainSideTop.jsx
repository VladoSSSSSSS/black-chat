import {useRef, useEffect} from "react";
import Head from "./Head";
import RemoteVideo from "./RemoteVideo";

export default function MainSideTop({
	text,
	button,
	reference,
	buttonHandler,
	callButton,
	makeCall,
	showRemoteCamera,
    remoteVideo,
    endCall,
}) {
	const mainTopBar = useRef(null);
	useEffect(() => {
        reference.current = mainTopBar.current;
    }, []);
    return (
        <div id="mainHeadline" ref={mainTopBar} >
			{button ? <div id="button_back" onPointerDown={buttonHandler}>
				<svg fill="#505050" width="80%" height="80%" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M222.927 580.115l301.354 328.512c24.354 28.708 20.825 71.724-7.883 96.078s-71.724 20.825-96.078-7.883L19.576 559.963a67.846 67.846 0 01-13.784-20.022 68.03 68.03 0 01-5.977-29.488l.001-.063a68.343 68.343 0 017.265-29.134 68.28 68.28 0 011.384-2.6 67.59 67.59 0 0110.102-13.687L429.966 21.113c25.592-27.611 68.721-29.247 96.331-3.656s29.247 68.721 3.656 96.331L224.088 443.784h730.46c37.647 0 68.166 30.519 68.166 68.166s-30.519 68.166-68.166 68.166H222.927z"/></svg>
			</div> : null}
            <Head text = {text} />
			{callButton ? 
				<div id="button_call" onPointerDown={makeCall}>
					<svg width="60%" height="60%" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000ff">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"/>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
						<g id="SVGRepo_iconCarrier">
							<path d="M170.666667 256h469.333333c46.933333 0 85.333333 38.4 85.333333 85.333333v341.333334c0 46.933333-38.4 85.333333-85.333333 85.333333H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333333V341.333333c0-46.933333 38.4-85.333333 85.333334-85.333333z" fill="#606060"/>
							<path d="M938.666667 746.666667l-213.333334-128V405.333333l213.333334-128z" fill="#606060"/>
						</g>
					</svg>
				</div> : null}
            <svg id="MainSideBarTopGradient" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="lgrad" x1="100%" y1="50%" x2="0%" y2="50%" gradientTransform="rotate(90)" >
						<stop offset="0%" stopOpacity="0" />
						<stop offset="50%" stopOpacity="1" />
					</linearGradient>
				</defs>
				<rect width="100%" height="100%" fill="url(#lgrad)" />
			</svg>
			<RemoteVideo view={showRemoteCamera} source={remoteVideo} endCall={endCall}></RemoteVideo>
        </div>
    );
};