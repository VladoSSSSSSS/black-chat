import {useEffect, useRef, useState} from "react";

export default function RemoteVideo({view, source}) {
    const video = useRef(null);

    useEffect(() => {
        if (video.current) {
            if (view) {
                video.current.srcObject = source;
            } else {
                video.current.srcObject = null;
            }
        }
    }, [view]);

    if (view) {
        return (
            <div id="videoplayback">
                <video ref={video} id="RemoteVideo" playsInline autoPlay></video>
            </div>
        );
    }
    return null;
}