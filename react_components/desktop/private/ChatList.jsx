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

    
        switch (states.view) {
            case "none":
            return null;

            case "loading":
            return (
                <div className="globally inner">Please wait...</div>
            );

            case "ok":
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
        }
}