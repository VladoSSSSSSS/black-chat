import {useEffect, useRef, useState} from "react";
import RoomPreview from "./RoomPreview";
import List_component from "./List_component";
//import Actions from "D:/Documents/Web_Project/Site/laravel-app/example-app/public/js/components/Actions";

export default function ChatList({api, states}) {
    //const [isLoad, setIsLoad] = useState(false);
    //const [data, setData] = useState(null);
    //const [states, setStates] = useState({});
    //const selectedElement = useRef(null);

    /* useEffect(() => {
        if (visible && !data) {
            user.ajax("GET", route, "", responseHandler);
        }
    }, [visible]); */

    /* function responseHandler(xhr) {
        if (xhr.response) {
            let responseData = JSON.parse(xhr.response);
            let newStates = {};
            for (let room of Object.keys(responseData)) {
                newStates[room] = false;
            }
            //console.dir(responseData);
            setIsLoad(true);
            setStates(newStates);
            setData(responseData);
        }
    } */

    function clickHandler(e) {
        //console.log(e.target.closest("[data-id]").dataset.id)
        let trueTarget = e.target.closest("[data-id]");
        if (trueTarget) api.setRoom(trueTarget.dataset.id);
    }

    function pdHandler() {
        api.rooms("none");
        api.search("ok");
        api.headerText("Search");
        api.select("peoples");
    }

    
        switch (states.view) {
            case "none":
            return null;

            case "loading":
            return (
                <div className="globally inner">Please wait...</div>
            );

            case "ok":
            if (Object.keys(states.rooms).length) {
                const list = [];
                for (const room of Object.keys(states.rooms)) {
                    list.push(
                        <RoomPreview key={room} 
                                    api={{
                                        deleteRoom: api.deleteRoom,
                                        close_prev: api.close_prev
                                    }}

                                    states={{
                                        id: room,
                                        data: states.rooms[room],
                                        selected: states.selection[room],
                                        status: states.statuses[room],
                                        icon: states.icons[room],
                                        message: states.lastMessages[room]
                                    }}/>
                    );
                }
                //list.push(<Actions />);
        
                return (
                    <div id="allChats" onPointerDown={clickHandler}>
                        <List_component data={list}></List_component>
                    </div>
                );
            } else {
                return (
                    <div id="offer">
                        <div id="offer_svg">
                            <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                <g id="SVGRepo_iconCarrier"> <circle cx="24" cy="12" r="8" stroke="#505050" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/> <path d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44" stroke="#505050" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/> <path d="M20 36L28 44" stroke="#505050" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/> <path d="M28 36L20 44" stroke="#505050" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/> </g>
                            </svg>
                        </div>
                        <div id="offer_text">У вас нет чатов. Найдите друзей сейчас!</div>
                        <div id="offer_button" onPointerDown={pdHandler}><div>Поиск</div></div>
                    </div>
                );
            }
        }
}