import {useEffect, useRef, useState} from "react";
import ActionsUsers from "./ActionsUsers";

export default function RoomPreview({user, createRoom, setRoom, friends, headerText}) {
    const [acts, setActs] = useState(false);

    function handlerDown(e) {
        e.stopPropagation();
        setActs(!acts);
    }

    return (
        <div data-nickname={user["login"]} data-id={user["id"]} className="profile">
            <div className="avatarContainer">
                {user["pic_small"] ? <img className="picks" src={user["pic_small"]}></img> : <div className="picks"><div className="letter_center">{user["name"] ? user["name"].slice(0, 1) : "$"}</div></div>}
            </div>
            <div className="profileInner">{user["name"]}</div>

            <div className="more" onPointerDown={handlerDown}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#808080" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" strokeWidth="1.5"/>
                    <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" strokeWidth="1.5"/>
                    <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" strokeWidth="1.5"/>
                </svg>
            </div>
            {acts ? <ActionsUsers createRoom={createRoom} setRoom={setRoom} friends={friends} user={user} view={acts} setView={setActs} headerText={headerText} /> : null}

            <hr className="hrSeparator" />
        </div>
    );
}