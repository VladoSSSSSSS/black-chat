//import {useEffect, useRef, useState} from "react";
import Messages from "./Messages";

export default function MainSideBar({api, states}) {
    return (
        <Messages
            view={states.messages_view}
            conn={api.conn}
            currentUser={states.currentUser}
            currentRoom={states.currentRoom}
            message={states.message}
            change_last_msg={api.change_last_msg}
            msg_codes={states.msg_codes}
        />
    );
}