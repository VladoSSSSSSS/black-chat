import {useEffect, useRef, useState} from "react";
import ajax_x from "ajax_x";
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import CreateTwit from "./CreateTwit";
import TwitManage from "./TwitManage";
import SendButton from "./SendButton";

export default function Messages({
    view,
    conn,
    currentUser,
    currentRoom,
    message,
    change_last_msg,
    mainSideTop_ref,
    msg_codes,
}) {
    //console.log("view: " + view);
    const [isLoad, setIsLoad] = useState(false);
    const [outState, setOutState] = useState('');
    const [msg, setMsg] = useState("");
    const [twitManage, setTwitManage] = useState(false);
    const [inputButton, setInputButton] = useState(false);

    const msg_content = useRef({});
    const storage = useRef({});
    const metrics = useRef({});
    const wrapper = useRef(null);
    const field = useRef(null);
    const gotTop = useRef(false);
    const gotBottom = useRef(false);
    const scrollparent = useRef(null);
    const scrollkid = useRef(null);
    //const mainSideTop_ref = useRef(null);
    const sendArea_ref = useRef(null);
    const selected_message_index = useRef(null);

    function onInertia() {
        let innerRect = wrapper.current.getBoundingClientRect();
        let outerRect = field.current.getBoundingClientRect();
        if (innerRect.y - outerRect.y >= 20) {
            //console.log(currentRoom[0]);
            listApi.start({
                y: getSizes().wrapperTop,
                config: {
                    mass: 0.5,
                    friction: 5,
                    tension: 12,
                }
            });
        } else if (outerRect.bottom - innerRect.bottom >= 20) {
            //console.log(currentRoom);
            listApi.start({
                y: 0,
                config: {
                    mass: 0.5,
                    friction: 5,
                    tension: 12,
                }
            });
        }
    }

    const [listProps, listApi] = useSpring(() => ({
        y: 0,  
    }));

    const listGestures = useGesture(
        {
            onDrag: ({movement: [, my], cancel, direction: [, dirY], down, velocity: [, vy]}) => {
                if(metrics.current[currentRoom[0]].heightDiff <= 0) return;
                let innerRect = wrapper.current.getBoundingClientRect();
                let outerRect = field.current.getBoundingClientRect();
                if (innerRect.y - outerRect.y >= 45 && dirY > 0) {
                    gotTop.current = true;
                    cancel();
                } else if (outerRect.bottom - innerRect.bottom >= 45 && dirY < 0) {
                    gotBottom.current = true;
                    cancel();
                } else {
                    //console.log(vy);
                    let targetPosition = metrics.current[currentRoom[0]].lastPosition + my;
                    listApi.start({y: targetPosition, immediate: down});
                }
            },

            onDragEnd: ({xy: [, oy], direction: [dirX, dirY], movement: [mx, my], velocity: [vx, vy]}) => {
                if(metrics.current[currentRoom[0]].heightDiff <= 0) return;
                if (gotTop.current) {
                    gotTop.current = false;
                    listApi.start({
                        y: metrics.current[currentRoom[0]].wrapperTop,
                        config: {
                            mass: 0.5,
                            friction: 5,
                            tension: 12,
                        }
                    });
                } else if (gotBottom.current) {
                    gotBottom.current = false;
                    listApi.start({
                        y: 0,
                        config: {
                            mass: 0.5,
                            friction: 5,
                            tension: 12,
                        }
                    });
                } else {
                    //console.log(currentRoom[0]);
                    
                    metrics.current[currentRoom[0]].lastPosition = wrapper.current.getBoundingClientRect().bottom + sendArea_ref.current.offsetHeight - field.current.getBoundingClientRect().bottom;
                    metrics.current[currentRoom[0]].lastScrollPosition = -(metrics.current[currentRoom[0]].lastPosition * metrics.current[currentRoom[0]].scrollDiff);
                    listApi.start({
                        config: {
                            decay: 0.999,
                            velocity: vy * dirY,
                        },
                        onChange: onInertia
                    });
                }
            },
            
            onPointerDown: ({event}) => {
                //console.log(currentRoom[0]);
                
                metrics.current[currentRoom[0]].lastPosition = wrapper.current.getBoundingClientRect().bottom + sendArea_ref.current.offsetHeight - field.current.getBoundingClientRect().bottom;
                metrics.current[currentRoom[0]].lastScrollPosition = -(metrics.current[currentRoom[0]].lastPosition * metrics.current[currentRoom[0]].scrollDiff);
            },
        },

        {
            drag: { axis: "y" }
        }
    );

    useEffect(()=>{
        //console.log('messages change');
        if (message && message.roomId in storage.current) {
            pushMsg(message);
        }
    }, [message]);

    /* useEffect(() => {
        //console.log('messages change');
        if (view == "ok") {
            user.ajax("POST", "/getMessages", {room: currentRoom[0]}, responseHandler);
        }
    }, [view]); */

    useEffect(()=>{
        //console.log("current room: " + String(currentRoom));
        /* if (Array.isArray(currentRoom)) {
            delete storage.current[currentRoom[0]];
            console.log("room deleted");
        } */
        if (currentRoom[0] != null) {
            if (currentRoom[0] in storage.current) {
                prepareOutput(currentRoom[0]);
            } else {
                //isLoad_ref.current = false;
                setIsLoad(false);
                ajax_x("POST", "/getMessages", {room: currentRoom[0]}, responseHandler);
            }
        }
    }, [currentRoom[0]]);

    useEffect(()=>{
        //console.log('messages change');
        if (view == "ok" && outState) {
            if (!metrics.current[currentRoom[0]]) {
                metrics.current[currentRoom[0]] = {};
                metrics.current[currentRoom[0]].lastPosition = 0;
            }
            listApi.start({y: metrics.current[currentRoom[0]].lastPosition, immediate: true});
            //console.log(metrics.current[currentRoom].lastPosition);
            updateSizes();
        }
    }, [outState]);

    function prepareOutput(room) {
        let counter = 0;
        let outMassive = [];
        for (let message of storage.current[room]) {
            outMassive.push(
                <CreateTwit 
                    key={message.hash}
                    listPosition={counter}
                    dataHash={message.hash}
                    meta={message.putdate.slice(11, 16)}
                    twit={message.text}
                    type={message.creator == currentUser.id ? "mine" : "alien"}
                    message_api={msgCtrl}
                />
            );
            ++counter;
        }
        if (currentRoom[0] in msg_content.current) {
            setMsg(msg_content.current[currentRoom[0]]);
        } else {
            setMsg("");
        }
        setOutState(outMassive);
    }

    function updateSizes() {
        console.log('Sizes updated');
        let heightDiff = wrapper.current.offsetHeight - (field.current.offsetHeight - mainSideTop_ref.current.offsetHeight - sendArea_ref.current.offsetHeight);
        metrics.current[currentRoom[0]].wrapperTop = (heightDiff <= 0) ? 0 : heightDiff;
        metrics.current[currentRoom[0]].lastPosition = wrapper.current.getBoundingClientRect().bottom + sendArea_ref.current.offsetHeight - field.current.getBoundingClientRect().bottom;
        //console.log(`startPoint updated: ${metrics.current[currentRoom].startPoint}`);
        //console.log(`WrapperTop updated: ${metrics.current[currentRoom[0]].wrapperTop}`);
    }

    function getSizes() {
        let heightDiff = wrapper.current.offsetHeight - (field.current.offsetHeight - mainSideTop_ref.current.offsetHeight - sendArea_ref.current.offsetHeight);
        return {
            "wrapperTop": (heightDiff <= 0) ? 0 : heightDiff,
            "scrollDiff": (scrollparent.current.offsetHeight - scrollkid.current.offsetHeight) / heightDiff
        }
    }

    function responseHandler(xhr) {
        //console.log('messages change');
        if (xhr.response) {
            //setData([...storage.current]);
            addBranch(currentRoom[0], xhr.response);
            prepareOutput(currentRoom[0]);
            //isLoad_ref.current = true;
            setIsLoad(true);
            //setCheck(true);
        }
    }

    function addBranch(room, response) {
        //console.log('messages change');
        storage.current[room] = JSON.parse(response);
    }

    
    function handleChange(e) {
        if (e.target.value) {
            if (!inputButton) {
                setInputButton(true);
            };
        } else {
            setInputButton(false);
        }
        msg_content.current[currentRoom[0]] = e.target.value;
        setMsg(e.target.value);
    }

    function dateNow() {
        let date = new Date();
        let year = String(date.getFullYear());
        let month = String(date.getMonth() + 1);
        if (month.length == 1) {month = "0" + month;}
        let day = String(date.getDate());
        if (day.length == 1) {day = "0" + day;}
        let hours = String(date.getHours());
        let minutes = String(date.getMinutes());
        let dateString = year + "-" + month + "-" + day + " " + hours + ":" + minutes;
        return dateString;
    }


    function pushMsg(message) {
        //console.log('messages change');
        storage.current[message.roomId].push({
            hash: message.hash,
            putdate: dateNow(),
            text: message.text,
            creator: message.creator,
        });
        if (message.roomId == currentRoom[0]) prepareOutput(currentRoom[0]);
    }

    function removeMsg(msg_index, msg_hash) {
        if (storage.current[currentRoom[0]][msg_index].hash == msg_hash) {
            storage.current[currentRoom[0]].splice(msg_index, 1);
            setTwitManage(false);
            prepareOutput(currentRoom[0]);
        }
        ajax_x("DELETE", "/delete", msg_hash, "");
    }

    function msgCtrl(message_index) {
        //console.log('messages change');
        selected_message_index.current = message_index;
        setTwitManage(true);
    }

    
    function sendCallback(xhr, random_hash) {
        //storage.current[currentRoom[0]][temp.current[random_hash]].id = JSON.parse(xhr.response);
        //console.dir(storage.current[currentRoom[0]]);
        //console.log("Message sent successfully")
    }
    
    function get_random_string(str_len) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < str_len; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));;
        }
        return result;
    }

    function handlePointerDown(e) {
        //console.log('messages change');
        let send = e.target.closest("#sendButtonSVG");
        if (send) {
            if(!msg || !currentRoom[0]) return;
            let data = {
                "type": msg_codes.MSG_TYPE_MESSAGE,
                "creator": currentUser.id,
                "text": msg,
                "roomId": currentRoom[0],
                "hash" : get_random_string(24),
            }; 
            ajax_x("POST", "/save", data, sendCallback);
            pushMsg(data);
            conn.publish(currentRoom[0], data); //don't send event if other user is not online!
            setInputButton(false);
            setMsg("");
            msg_content.current[currentRoom[0]] = "";
            change_last_msg(msg);
        }
    }
/*
    useEffect(() => {
        if (inputButton) {

        } else {
            sendButtonApi.stop();
            //sendButtonApi.update();
        }
    }, [inputButton]);
*/
    switch (view) {
        case "waiting_data":
            return (
                <div id="mainSideBar">
                    <div id="nothing">
                        <p>Waiting data from server...</p>
                    </div>
                </div>
            );

        case "ok":
            if (isLoad) {
                return (
                    <div id="messages" onPointerDown={() => {setTwitManage(false);}}>
                    
                        <div id="field" ref={field}>
                            <animated.div id="wrapper" ref={wrapper} {...listGestures()} style={listProps}>
                                {outState}
                            </animated.div>
                        </div>

                        <TwitManage visible={twitManage} storage={storage.current} currentRoom={currentRoom} target_msg={selected_message_index.current} api={removeMsg} />

                        {currentRoom[1]["deleted_at"] ?
                            <div id="msgSend" ref={sendArea_ref}></div>
                            : <div id="msgSend" ref={sendArea_ref} onPointerDown={handlePointerDown} >
                                <input type="text" id="msg" value={msg} placeholder="...type something..." onChange={handleChange} />
                                {inputButton ? <SendButton /> : null}
                            </div>}
                    </div>
                    
                );
            } else {
                return (
                    <div id="mainSideBar">
                        <div id="nothing">
                            <p>Loading messages...</p>
                        </div>
                    </div>
                );
            }
    }
    return null;
}
