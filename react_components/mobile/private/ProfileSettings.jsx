import {useEffect, useRef, useState} from "react";
import ajax_x from "ajax_x";
import { useSpring, useSpringRef, useChain, animated, config } from '@react-spring/web';
import DeleteConfirmation from "./DeleteConfirmation";
import List_component from "./List_component";
import Darkfilter from "./Darkfilter";
import PromptWindow from "./PromptWindow";

export default function ProfileSettings({visible, data}) {
    const [open, setOpen] = useState(false);
    const [loginState, setLogin] = useState(data.login);
    const [nameState, setName] = useState((data.name === null) ? "" : data.name);
    const [show_prompt, set_show_prompt] = useState(false);

    const filterRef = useSpringRef();
    const addApi = useSpringRef();
    const delApi = useSpringRef();

    const login = useRef(data.login);
    const name = useRef((data.name === null) ? "" : data.name);
    const block = useRef(false);

    const filter_api = useSpring({
        ref: filterRef,
        config: config.stiff,
        from: { opacity: '0' },
        to: {
            opacity: open ? '0.75' : '0',
        },
    });

    const addButtonApi = useSpring({
        ref: addApi,
        from: {
            opacity: 0,
            top: "30px",
            scale: "100%"
        },
        to: {
            opacity: open ? 1 : 0,
            top: open ? "0px" : "20px",
            scale: "100%"
        },
        config: {duration: 170}
    });

    const delButtonApi = useSpring({
        ref: delApi,
        from: {
            opacity: 0,
            top: "30px",
            scale: "100%"
        },
        to: {
            opacity: open ? 1 : 0,
            top: open ? "0px" : "20px",
            scale: "100%"
        },
        config: {duration: 170}
    });

    useChain(open ? [filterRef, addApi, delApi] : [delApi, addApi, filterRef], [0, 1, 2], 150);

    function sendButtonClickHandler(e) {
        //block.current = true;
        let out = {};
        if (login.current && login.current != data.login) {
            if (login.current.length < 4) {
                //wrong - too short!
            } else {
                out["login"] = login.current;

                if (name.current && name.current != data.name) {
                    out["name"] = name.current;
                }

                console.log("update!");
                ajax_x("POST", "/update", out, updateCallback);
            }
        } else {
            if (name.current && name.current != data.name) {
                out["name"] = name.current;
            }

            if (out) {
                console.log("update!");
                ajax_x("POST", "/update", out, updateCallback);
            }
        }
    }

    function show_handler_true() {
        set_show_prompt(true);
    }

    function show_handler_false() {
        set_show_prompt(false);
    }

    function logout_handler() {
        ajax_x("GET", "/logout", "", (e) => {
            if (e.status == 301) {
                document.location.href = e.getResponseHeader("Content-Location");
            }
        });
    }

    function updateCallback(request) {
        let result = JSON.parse(request.response);
        if (result) {
            if (result === 1) {
                data.login = login.current;
            } else if (result === 2) {
                data.name = name.current;
            } else {
                data.login = login.current;
                data.name = name.current;
            }
        }
        //block.current = false;
    }

    function typeHandler(e) {
        if (!block.current) {
            switch (e.target.name) {
                case "login":
                    if (e.target.value.length - login.current.length == -1) {
                        login.current = e.target.value;
                        setLogin(login.current);
                    } else if (e.target.value.length - login.current.length == 1) {
                        if (e.target.value.length < 11) {
                            login.current = e.target.value;
                            setLogin(login.current);
                        }
                    } else if (e.target.value > login.current) {
                        let new_value = login.current + e.target.value;
                        if (new_value.length > 10) {
                            login.current = new_value.slice(0, 10);
                            setLogin(login.current);
                        }
                    } else {
                        login.current = e.target.value;
                        setLogin(login.current);
                    }
                break;

                case "name":
                    if (e.target.value.length - name.current.length == -1) {
                        name.current = e.target.value;
                        setName(name.current);
                    } else if (e.target.value.length - name.current.length == 1) {
                        if (e.target.value.length < 16) {
                            name.current = e.target.value;
                            setName(name.current);
                        }
                    } else if (e.target.value > name.current) {
                        let new_value = name.current + e.target.value;
                        if (new_value.length > 15) {
                            name.current = new_value.slice(0, 15);
                            setName(name.current);
                        }
                    } else {
                        name.current = e.target.value;
                        setName(name.current);
                    }
                break;
            }
        }
    }

    function onLeave(event) {
        //event.stopPropagation;
        if (!event.relatedTarget.closest("#profilePicture")) setOpen(false);
    }

    function onClick(event) {
        switch(event.currentTarget.id) {
            case "add":
            addApi.start({
                to: [
                {scale: "80%"},
                {scale: "100%"},
                ],
                config: {duration: 80}
            });
            break;
            case "del":
            delApi.start({
                to: [
                {scale: "80%"},
                {scale: "100%"},
                ],
                config: {duration: 80}
            });
            break;
        }
    }

    async function upload_photo(e) {
        ajax_x("POST", "/upload_pic", {"send_avatar": e.currentTarget.files[0]}, (e) => data.pic_orig = JSON.parse(e.response).path);
    }
    
    if (visible != "none") {
        return (
            <div id="profileSettings">
                <List_component data={[
                    <div id="container_one" key="0">
                        <div id="profilePicture" onPointerDown={() => setOpen(!open)}>
                            {data.pic_orig ? <img className="profileImg" src={data.pic_orig}></img> : <div className="profileImg"><div className="username"> {data.name ? data.name.slice(0, 1) : "Username"}</div></div>}
                            <animated.div className="imageFilter" style={filter_api}></animated.div>
                            <div id="avatarSet">    
                                <animated.div id="add" style={addButtonApi} className="avatarUp" onPointerDown={onClick} >
                                    <input type="file" accept="image/jpeg, image/png, image/gif, image/webp" id="send_avatar" name="send_avatar" className="avatars_ui" encType="multipart/form-data" onChange={upload_photo} />
                                    <label htmlFor="send_avatar" className="input_label">
                                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#808080" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <g>
                                                <path d="M18 2V8L20 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M18 8L16 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </g>
                                            <path d="M2.66992 18.9501L7.59992 15.6401C8.38992 15.1101 9.52992 15.1701 10.2399 15.7801L10.5699 16.0701C11.3499 16.7401 12.6099 16.7401 13.3899 16.0701L17.5499 12.5001C18.3299 11.8301 19.5899 11.8301 20.3699 12.5001L21.9999 13.9001" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </label>
                                </animated.div>
                                <animated.div id="del" style={delButtonApi} className="avatarDel" onPointerDown={onClick} >
                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#808080" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <g>
                                            <path d="M16.5605 6.94006L20.4405 3.06006" strokeWidth="1.5" strokeLinecap="round"/>
                                            <path d="M20.4405 6.94006L16.5605 3.06006" strokeWidth="1.5" strokeLinecap="round"/>
                                        </g>
                                        <path d="M2.66992 18.9501L7.59992 15.6401C8.38992 15.1101 9.52992 15.1701 10.2399 15.7801L10.5699 16.0701C11.3499 16.7401 12.6099 16.7401 13.3899 16.0701L17.5499 12.5001C18.3299 11.8301 19.5899 11.8301 20.3699 12.5001L21.9999 13.9001" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </animated.div> 
                            </div>
                        </div>
                    </div>,

                    <div id="container_two" key="1">
                        <div className="inputDiv">
                            <label className="labels">Login</label>
                            <div className="inputWrapper">
                                <input type="text" name="login" className="inputs" value={loginState} onChange={typeHandler}></input>
                            </div>
                            <div className="important_notice">Уникальный никнейм. Является ключом для поиска пользователя</div>
                        </div>
                    </div>,

                    <div id="container_three" key="2">
                        <div className="inputDiv">
                            <label className="labels">Name</label>
                            <div className="inputWrapper">
                                <input type="text" name="name" className="inputs" value={nameState} onChange={typeHandler}></input>
                            </div>
                            <div className="important_notice">Имя или псевдоним пользователя. Отображается в списках чатов собеседников</div>
                        </div>
                    </div>,

                    <div id="container_four" key="3">
                        <div id="savePersonal">
                            <input type="submit" id="savePersonalButton" value="Save" onPointerDown={sendButtonClickHandler}></input>
                        </div>
                    </div>,

                    <div id="container_five" key="4">
                        <DeleteConfirmation show_prompt={show_prompt} api={show_handler_true}/>
                        <div id="logout" onPointerDown={logout_handler}>Выйти</div>
                    </div>
                ]}></List_component>

                {show_prompt ? <div className="wide_window">
                    <Darkfilter api={show_handler_false} />  
                    <PromptWindow />
                </div> : null}
            </div>
        );
    }
    return null;
}