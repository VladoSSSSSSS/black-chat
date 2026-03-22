"use strict"

import {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import Session from "custom-ws-client";
import ajax_x from "ajax_x";
import LeftSideBar from "./LeftSideBar";
import MainSideBar from "./MainSideBar";

function App() {

                        /* States and refs */

    //for Messages
    const [message, setMessage] = useState(false);
    const [messages_view_type, set_messages_view_type] = useState("no_room");

    //for ChatsList
    const rooms_data_storage = useRef({});
    const id_changer = useRef({});
    const r_selection = useRef({});
    const r_current_room = useRef(null);
    const [icons, setIcons] = useState({});
    const [statuses, setStatuses] = useState({});
    const [lastMessages, setLastMessages] = useState({});
    const [rooms_selection, set_rooms_selection] = useState({});
    const [container_view_type, set_container_view_type] = useState("loading");
    const [selectedRoom, set_selectedRoom] = useState(null);

    //for Search
    const [search_view_type, set_search_view_type] = useState("none");

    //for Settings
    const [settings_view_type, set_settings_view_type] = useState("none");

    //for Navigate
    const [triggers, setTriggers] = useState([
        ["dialogs", true],
        ["peoples", false],
        ["settings", false]
    ]);

    //other states and refs
    const [loaded, setLoaded] = useState(false);
    const userData = useRef(null);
    const [general_view, set_general_view] = useState("loading");
    const conn = useRef(null);
    const close_sum_menu = useRef(null);
    const msg_codes = {
        "MSG_TYPE_MESSAGE": 0,
        "MSG_TYPE_WEBRTC_OFFER": 1,
        "MSG_TYPE_WEBRTC_ANSWER": 2,
        "MSG_TYPE_WEBRTC_ICE_CANDIDATE": 3,
        "MSG_TYPE_WEBRTC_CLOSE": 4,
        "MSG_TYPE_TYPING": 5,
        "MSG_TYPE_DELETE_MSG": 6,
    };


                        /* AJAX-requests */

    useEffect(() => {
        if (!loaded) {
            ajax_x("GET", "/init", "", initial_data_handler);
        } else {
            if (!conn.current) {
                conn.current = new Session('wss://black-chat.ru/ws/',
                    onOpen,
                    function() {
                        console.warn('WebSocket connection closed');
                    },
                    onMessage,
                    onStatus,
                    init,
                    onNewroom,
                    onRoom_del,
                    {'skipSubprotocolCheck': true}
                );
            }
        }
    }, [loaded]);

    function get_new_room_id(user) {
        //console.log("room created with users: " + userData.current.id + " , " + roomData.users);
        let data_for_request = {
            "type": 1,
            "users": JSON.stringify([user['id']]),
            "created_at": Date.now(),
        }
        ajax_x("POST", "/newDialog", data_for_request, new_room_handler, user);
        set_messages_view_type("waiting_data");
        set_container_view_type("ok");
        set_search_view_type("none");
        select("dialogs");
    }

    function deleteRoom(room) {
        ajax_x("DELETE", "/deleteRoom", room, () => {});
        let recipient_id = rooms_data_storage.current[room]["id"];
        let sender_id = userData.current["id"];
        conn.current.del_room(room, sender_id, recipient_id);
        render_room_del(room);
    }


                    /* Web-socket communication */


    function init(arr) {
        let temp = {};
        for (let [id, status] of Object.entries(arr)) {
            rooms_data_storage.current[id_changer.current[id]]["online"] = status;
            temp[id_changer.current[id]] = status;
        }
        setStatuses(temp);
    }

    function onStatus(id, status) {
        rooms_data_storage.current[id_changer.current[id]]["online"] = status;
        let temp = {};
        for (let [k, v] of Object.entries(rooms_data_storage.current)) {
            temp[k] = v["online"];
        }
        setStatuses(temp);
    }

    function onMessage(room, data) {
        rooms_data_storage.current[room]["message"] = data["text"];
        let new_last_messages = {};
        for (let [room, r_data] of Object.entries(rooms_data_storage.current)) {
            new_last_messages[room] = r_data["message"];
        }
        setLastMessages(new_last_messages);
        setMessage(data);
        console.log('New article published to category "' + room + '" : ');
    }

    function onOpen(ssid, protocol, server) {
        console.log("Connected to web-socket server");
        console.log("SSID: " + String(ssid));
        console.log("Protocol: " + protocol);
        console.log("Server: " + server);

        let user_ids = [];
        let rooms_ids = [];
        for (let [room_id, user_data] of Object.entries(rooms_data_storage.current)) {
            if (user_data["deleted_at"] == null) {
                user_ids.push(user_data["id"]);
                rooms_ids.push(room_id);
            }
        }
        conn.current.initialize(userData.current.id, user_ids, rooms_ids);
    }

    function onNewroom(room_id, user_data) {
        render_new_room(room_id, user_data, true);
    }

    function onRoom_del(room) {
        render_room_del(room);
    }

    async function makeCall() {
        const localStream = await getUserMedia({video: true, audio: true});
        const peerConnection = new RTCPeerConnection();
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        conn.publish(r_current_room.current, {"type": msg_codes.MSG_TYPE_WEBRTC_OFFER, "offer": offer});
    }


                        /* Handlers(callbacks) */


    function initial_data_handler(xhr) {
        if (xhr.response) {
            let responseData = JSON.parse(xhr.response);
            userData.current = {...responseData["client"]};
            if (responseData["users"]) {
                id_changer.current = {...responseData["template"]};

                let init_selections = {};
                let init_statuses = {};
                let init_last_messages = {};
                let init_icons = {};

                //let temp = {};
                for (let obj of responseData["last_msg"]) {
                    init_last_messages[obj["room"]] = obj["text"];
                    //if (msg["room"] in rooms_data_storage.current) {
                    //    rooms_data_storage.current[msg["room"]]["message"] = msg;
                    //    init_last_messages[msg["room"]] = msg["text"];
                    //}
                }

                for (let user of responseData["users"]) {
                    let room_id = id_changer.current[user["id"]];

                    //rooms_data_storage.current[room_id] = user;
                    init_selections[room_id] = false;
                    init_statuses[room_id] = false;
                    init_icons[room_id] = user["pic_small"];

                    if (room_id in init_last_messages) {
                        user["message"] = init_last_messages[room_id];
                    } else {
                        user["message"] = "";
                        init_last_messages[room_id] = "";
                    }
                    rooms_data_storage.current[room_id] = user;
                }

                //console.dir(responseData);
                setStatuses(init_statuses);
                setLastMessages(init_last_messages);
                set_rooms_selection(init_selections);
                setIcons(init_icons);
            }
            set_general_view("ok");
            set_container_view_type("ok");
            setLoaded(true);
        }
    }

    function new_room_handler(xhr, user) {
        let new_room_id = JSON.parse(xhr.response)[0];

        conn.current.new_room(
            new_room_id,
            {
                'id': userData.current['id'],
                'login': userData.current['login'],
                'name': userData.current['name'],
                'pic_small': userData.current['pic_small'],
                'pic_orig': userData.current['pic_orig'],
            },
            {
                'id': user['id'],
                //'login': user['login'],
            },
        );
        render_new_room(new_room_id, user, false);
        //set_container_view_type("ok");
        r_current_room.current = new_room_id;
        set_selectedRoom(r_current_room.current);
        set_messages_view_type("ok");
    }


                        /* Interface changers */


    function render_new_room(room_id, user_data, status) {
        let all_rooms = rooms_data_storage.current;
        id_changer.current[user_data['id']] = room_id;
        all_rooms[room_id] = user_data;
        all_rooms[room_id]["online"] = status;
        all_rooms[room_id]["message"] = "";
        //let new_selections = {};
        let new_statuses = {};
        let new_last_messages = {};
        let new_icons = {};
        for (let [room, data] of Object.entries(all_rooms)) {
            new_statuses[room] = data["online"];
            new_last_messages[room] = data["message"];
            new_icons[room] = data["pic_small"];
        }

        setStatuses(new_statuses);
        setLastMessages(new_last_messages);
        setIcons(new_icons);
        //set_selectedRoom(room_id);
        //set_messages_view_type("ok");
    }

    function render_room_del(room) {
        let all_rooms = rooms_data_storage.current;
        delete id_changer.current[all_rooms[room]["id"]];
        delete all_rooms[room];

        let new_statuses = {};
        let new_last_messages = {};
        let new_icons = {};

        for (let [room, data] of Object.entries(all_rooms)) {
            new_statuses[room] = data["online"];
            new_last_messages[room] = data["message"];
            new_icons[room] = data["pic_small"];
        }
        
        delete r_selection.current[room];

        if (r_current_room.current == room) {
            r_current_room.current = null;
            set_selectedRoom(r_current_room.current);
            set_messages_view_type("no_room");
        }
        set_rooms_selection({...r_selection.current});
        setStatuses(new_statuses);
        setLastMessages(new_last_messages);
        setIcons(new_icons);
    }

    function select(id) {
        let newState = [...triggers];
        for (let arr of newState) {
            if (arr[0] == id) {
                arr[1] = true;
            } else {
                arr[1] = false;
            }
        }
        setTriggers(newState);
    }

    function selectRoom(room) {
        if (r_current_room.current !== room) {
            r_selection.current[room] = true;
            if (r_current_room.current !== null) r_selection.current[r_current_room.current] = false;
            //if (r_current_room.current !== null && r_current_room.current !== room) r_selection.current[r_current_room.current] = false;
            r_current_room.current = room;
            set_search_view_type(false);
            setTriggers([
                ["dialogs", true],
                ["peoples", false],
                ["settings", false]
            ]);
            set_container_view_type("ok");
            set_rooms_selection({...r_selection.current});
            set_selectedRoom(r_current_room.current);
            //console.log(room)
            //console.log("setMsgOut works");
            if (messages_view_type != "ok") {
                set_messages_view_type("ok");
            }
        } else {
            set_search_view_type(false);
            setTriggers([
                ["dialogs", true],
                ["peoples", false],
                ["settings", false]
            ]);
            set_container_view_type("ok");
            if (messages_view_type != "ok") {
                set_messages_view_type("ok");
            }
        }
    }

    function change_last_message(message) {
        rooms_data_storage.current[selectedRoom]["message"] = message;
        let new_last_messages = {};
        for (let [room, r_data] of Object.entries(rooms_data_storage.current)) {
            new_last_messages[room] = r_data["message"];
        }
        setLastMessages(new_last_messages);
    }


                        /* Render */


    switch (general_view) {
        case "loading":
        return (
            <div className="globally inner">Please wait...</div>
        );

        case "ok":
        return (
            <div id="mainContainer">
                <LeftSideBar api={{
                                setRoom: selectRoom,
                                deleteRoom: deleteRoom,
                                selectRoom: set_rooms_selection,
                                createRoom: get_new_room_id,
                                change_rooms_visible: set_container_view_type,
                                change_search_visible: set_search_view_type,
                                change_settings_visible: set_settings_view_type,
                                select: select,
                                close_menu: close_sum_menu
                                }}
                            states={{
                                rooms: rooms_data_storage.current,
                                rooms_view: container_view_type,
                                search_view: search_view_type,
                                settings: settings_view_type,
                                selection: rooms_selection,
                                triggers: triggers,
                                currentUser: userData.current,
                                statuses: statuses,
                                icons:icons,
                                lastMessages: lastMessages,
                                friends: id_changer.current
                                }} />
                <MainSideBar api={{
                                conn: conn.current,
                                change_last_msg: change_last_message
                                }}
                            states={{
                                messages_view: messages_view_type,
                                currentUser: userData.current,
                                currentRoom: [selectedRoom, rooms_data_storage.current[selectedRoom]],
                                message: message,
                                msg_codes: msg_codes
                                }}/>
            </div>
        );
    }
}





















const root = createRoot(
    document.querySelector("#root")
);
root.render(<App />);