"use strict"

export default function CallInfo({text, src}) {
    return (
        <div id="callInfo">
            <div id="callInfo_text">{text}</div>
                <div id="picture_block">
                    <div className="avatarContainer">
                        {src ? <img className="picks_deleted" src={src}></img> : <div className="picks"><div className="letter_center">{text ? text.slice(0, 1) : "$"}</div></div>}
                    </div>
                </div>
        </div>
    );
}