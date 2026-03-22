import {useEffect, useRef, useState} from "react";
//import { useSpring, animated } from '@react-spring/web';
import Actions from "./Actions";

export default function RoomPreview({api, states}) {
    const [acts, setActs] = useState(false);

    function handlerDown(e) {
        e.stopPropagation();
        if (api.close_prev.current) {
            api.close_prev.current(false);
        }
        api.close_prev.current = setActs;
        setActs(!acts);
    }

    let id = String(states.id);
    let url = "url(#" + id + ")";

    if (states.data["deleted_at"]) {
        return(
        <div data-nickname={states.data["login"]} data-id={states.id} className={states.selected ? "globallySelected" : "globally"}>
            <div className="avatarContainer">
                {states.icon ? <img className="picks_deleted" src={states.icon}></img> : <div className="picks"><div className="letter_center">{states.data["name"] ? states.data["name"].slice(0, 1) : "$"}</div></div>}
            </div>

            <div className="deleted_account">Deleted account</div>

            <div className="more" onPointerDown={handlerDown}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#808080" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" strokeWidth="1.5"/>
                    <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" strokeWidth="1.5"/>
                    <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" strokeWidth="1.5"/>
                </svg>
            </div>

            {acts ? <Actions deleteRoom={api.deleteRoom} roomId={states.id} setClose={setActs} /> : null}

            <div className="rightSideGrad">
                <svg height="1.5cm" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id={id} x1="100%" y1="50%" x2="0%" y2="50%" >
                            <stop offset="30%" stopColor={states.selected ? "#202020" : "#151515"} stopOpacity="1" />
                            <stop offset="100%" stopColor={states.selected ? "#202020" : "#151515"} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill={url} />
                </svg>
            </div>
            <hr className="hrSeparator" />
        </div>
        );
    }

    return(
        <div data-nickname={states.data["login"]} data-id={states.id} className={states.selected ? "globallySelected" : "globally"}>
            <div className="avatarContainer">
                {states.icon ? <img className="picks" src={states.icon}></img> : <div className="picks"><div className="letter_center">{states.data["name"] ? states.data["name"].slice(0, 1) : "$"}</div></div>}
                {states.status ? <div className="onlineStatus"><div></div></div> : null}
            </div>
            <div className="inner">{states.data["name"]}</div>

            <div className="more" onPointerDown={handlerDown}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#808080" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" strokeWidth="1.5"/>
                    <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" strokeWidth="1.5"/>
                    <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" strokeWidth="1.5"/>
                </svg>
            </div>

            {acts ? <Actions deleteRoom={api.deleteRoom} roomId={states.id} setClose={setActs} /> : null}

            <div className="lastMessage">{states.message}</div>
            {/* <div className="mewMsgCount"><div>1</div></div> */}
            <div className="rightSideGrad">
                <svg height="1.5cm" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id={id} x1="100%" y1="50%" x2="0%" y2="50%" >
                            <stop offset="30%" stopColor={states.selected ? "#202020" : "#151515"} stopOpacity="1" />
                            <stop offset="100%" stopColor={states.selected ? "#202020" : "#151515"} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill={url} />
                </svg>
            </div>
            <hr className="hrSeparator" />
        </div>
    );
}