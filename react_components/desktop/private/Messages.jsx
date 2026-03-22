import {useEffect, useRef, useState} from "react";
import ajax_x from "ajax_x";
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import CreateTwit from "./CreateTwit";
import TwitManage from "./TwitManage";
import MainSideTop from "./MainSideTop";
import SendButton from "./SendButton";

export default function Messages({view, conn, currentUser, currentRoom, message, change_last_msg, msg_codes}) {
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
    const mainSideTop_ref = useRef(null);
    const sendArea_ref = useRef(null);
    const selected_message_index = useRef(null);
    const timer = useRef({});

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
        } else {
            //console.log(view);
            scrollapi.start({y: -(innerRect.bottom + sendArea_ref.current.offsetHeight - outerRect.bottom) * getSizes().scrollDiff, immediate: true});
        }
    }

    const [listProps, listApi] = useSpring(() => ({
        y: 0,
    }));

    const [scrollProps, scrollapi] = useSpring(() => ({
        y: 0,
    }));

    const [scrollbar_styles, scrollbar_api] = useSpring(() => ({
        from: {
            opacity: 0
        },
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
                    if ((vy > 1.5)) {
                        scrollbar_api.start({
                            to: {
                                opacity: 0.7
                            },
                            config: {
                                duration: 100
                            }
                        });
                        timer.current = setTimeout(() => {
                            scrollbar_api.start({
                            to: {
                                opacity: 0
                            },
                            config: {
                                duration: 100
                            }
                        });
                        }, 4000);
                    }
                    let targetPosition = metrics.current[currentRoom[0]].lastPosition + my;
                    listApi.start({y: targetPosition, immediate: down});
                    scrollapi.start({y: -targetPosition * metrics.current[currentRoom[0]].scrollDiff, immediate: down});
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

    const scrollBarGestures = useGesture(
        {
            onDrag: ({xy: [, oy], movement: [mx, my], cancel, direction: [dirX, dirY], down}) => {
                let scrollBar = scrollparent.current.getBoundingClientRect();
                let scrollBrick = scrollkid.current.getBoundingClientRect();
                if ((scrollBrick.top <= scrollBar.top && dirY < 0) || (scrollBrick.bottom >= scrollBar.bottom && dirY > 0)) {
                    cancel();
                } else {
                    let small = metrics.current[currentRoom[0]].lastScrollPosition + my;
                    let big = -(small / metrics.current[currentRoom[0]].scrollDiff);
                    scrollapi.start({y: small, immediate: down});
                    listApi.start({y: big, immediate: down});
                }
            },

            onDragEnd: ({xy: [, oy], movement: [, my]}) => {
                metrics.current[currentRoom[0]].lastScrollPosition += my;
            },
            
            onPointerDown: ({event}) => {

            },
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
        metrics.current[currentRoom[0]].heightDiff = wrapper.current.offsetHeight - (field.current.offsetHeight - mainSideTop_ref.current.offsetHeight - sendArea_ref.current.offsetHeight);
        metrics.current[currentRoom[0]].wrapperTop = (metrics.current[currentRoom[0]].heightDiff <= 0) ? 0 : metrics.current[currentRoom[0]].heightDiff;
        metrics.current[currentRoom[0]].scrollDiff = (scrollparent.current.offsetHeight - scrollkid.current.offsetHeight) / metrics.current[currentRoom[0]].heightDiff;
        metrics.current[currentRoom[0]].lastPosition = wrapper.current.getBoundingClientRect().bottom + sendArea_ref.current.offsetHeight - field.current.getBoundingClientRect().bottom;
        metrics.current[currentRoom[0]].lastScrollPosition = -(metrics.current[currentRoom[0]].lastPosition * metrics.current[currentRoom[0]].scrollDiff);
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
            //setInputButton(false);
            //setMsg("");
            //msg_content.current[currentRoom[0]] = "";
            change_last_msg(msg);
        }
    }

    

    function scrollbar_event_handler(e) {
        if(metrics.current[currentRoom[0]].heightDiff <= 0) return;
        switch (e.type) {
            case "pointerover":
                scrollbar_api.start({
                    to: {
                        opacity: 0.7
                    },
                    config: {
                        duration: 100
                    }
                });
                clearTimeout(timer.current);
            break;

            case "pointerleave":
                scrollbar_api.start({
                    to: {
                        opacity: 0
                    },
                    config: {
                        duration: 100
                    }
                });;
            break;
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
        case "no_room":
            return (
                <div id="mainSideBar">
                    <div id="codeSVG">
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.89001 9C7.87001 9.49 8.71001 10.23 9.32001 11.15C9.67001 11.67 9.67001 12.34 9.32001 12.86C8.71001 13.77 7.87001 14.51 6.89001 15" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 15H17" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div id="nothing">
                        <p>No chats selected</p>
                    </div>
                </div>
            );

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
                    <div id="mainSideBar">
                        <div id="messages" onPointerDown={() => {setTwitManage(false);}}>
                            <MainSideTop text={currentRoom[1]["login"]} css={{id: "mainHeadline"}} reference={mainSideTop_ref} />
                        
                            <div id="field" ref={field}>
                                
                                <animated.div id="wrapper" ref={wrapper} {...listGestures()} style={listProps}>
                                    {outState}
                                </animated.div>
                                
                                <animated.div id="scrollBar" ref={scrollparent} onPointerLeave={scrollbar_event_handler} onPointerOver={scrollbar_event_handler} style={scrollbar_styles}>
                                    <animated.div id="scrollBrick" ref={scrollkid} {...scrollBarGestures()} style={scrollProps} />
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
}
