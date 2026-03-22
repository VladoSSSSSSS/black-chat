import {useEffect, useRef, useState} from "react";
//import ajax_x from "ajax_x";
import LeftSideTop from "./LeftSideTop";
import Search from "./Search";
import ChatList from "./ChatList";
import Navigate from "./Navigate";
import ProfileSettings from "./ProfileSettings";

export default function LeftSideBar({api, states}) {
    const [headerText, setHeaderText] = useState('Messages');
    //const [settings, setSettings] = useState(false);
    //const [rooms_selection, set_rooms_selection] = useState({});

    /* function selectParticipants(participants) {
        let data = {"0": participants}
        ajax_x("POST", "/newDialog", data, function(xhr) {console.dir(JSON.parse(xhr.response))});
    }

    function handlePanStart(event, info) {
        if (Math.abs(info.delta.x) > Math.abs(info.delta.y)) {
                console.log("x");
            controls.start(event);
        }
    } */

    return (
        <div id="leftSideBar">
            <LeftSideTop text={headerText} css={{id: "aboutUser"}} />
            <ChatList   api={{
                            setRoom: api.setRoom,
                            deleteRoom: api.deleteRoom,
                            close_prev: api.close_menu
                        }}

                        states={{
                            view: states.rooms_view,
                            rooms: states.rooms,
                            selection: states.selection,
                            statuses: states.statuses,
                            lastMessages: states.lastMessages,
                            icons: states.icons
                        }}/>

            <Search api={{
                        setRoom: api.setRoom,
                        createRoom: api.createRoom,
                        headerText: setHeaderText,
                        //rooms: api.change_rooms_visible,
                        //search: api.change_search_visible,
                        //select: api.select,
                        //headerText: setHeaderText,
                    }}

                    states={{
                        view: states.search_view,
                        friends: states.friends
                    }} />            
            <ProfileSettings visible={states.settings} data={states.currentUser} />
            <Navigate visible={true} 
                api={{
                    rooms: api.change_rooms_visible,
                    search: api.change_search_visible,
                    settings: api.change_settings_visible,
                    headerText: setHeaderText,
                    select: api.select
                }}
                triggers={states.triggers} />
        </div>
    );
}