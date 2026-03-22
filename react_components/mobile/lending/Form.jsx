"use strict"

import {useEffect, useRef, useState} from "react";
import ajax_x from "ajax_x";
import { useSpring, useSpringRef, useSpringValue, animated, config } from '@react-spring/web'

export default function Form({states, backApi, setFooter}) {
    const [inputs_state, set_inputs_state] = useState(false);
    const [signIn_class, set_signIn_class] = useState("active");
    const [signUp_class, set_signUp_class] = useState("def");
    
    const [button_text, set_button_text] = useState("Go!");
    const [login_color, set_login_color] = useState("green");
    const [confirm_color, set_confirm_color] = useState("green");
    const [name_color, set_name_color] = useState("green");

    const [login_input, set_login_input] = useState("");
    const [name_input, set_name_input] = useState("");
    const [password_input, set_password_input] = useState("");
    const [confirm_input, set_confirm_input] = useState("");

    const [cursor, setCursor] = useState("pointer");

    const form_api = useSpringRef();
    const selector_api = useSpringRef();

    //const form_login_api = useSpringRef();
    //const form_name_api = useSpringRef();
    //const form_password_api = useSpringRef();
    //const form_confirm_api = useSpringRef();

    const springs = useRef(true);
    const login = useRef("");
    const name = useRef("");
    const password = useRef("");
    const confirm = useRef("");
    const selector = useRef(false);
    const config = useRef({
        tension: 480,
        friction: 40,
        mass: 1
    });
    const first_incorrect = useRef(0);

    useEffect(() => {
        //console.log('messages change');
        if (states.visible) {
            form_api.start({
                to: {
                    opacity: "1"
                },
            });
            setFooter(true);
            backApi.start();
        }
    }, [states.visible]);

    const form_styles = useSpring({
        ref: form_api,
        from: {
            opacity: "0"
        }
    });

    const selector_styles = useSpring({
        ref: selector_api,
        from: {
            left: "0",
            width: "50%",
            opacity: "1"
        }
    });

    const [form_login_styles, form_login_api] = useSpring(() => ({
        x: 0,
        //ref: form_login_api,
        from: {
            top: "45%",
        },
        /* config: {
            mass: 1,
            friction: 20,
            tension: 800,
        } */
    }));

    const [form_name_styles, form_name_api] = useSpring(() => ({
        x: 0,
        //ref: form_name_api,
        from: {
            left: "10%",
            opacity: "0%"
        }
    }));

    const [form_password_styles, form_password_api] = useSpring(() => ({
        x: 0,
        //ref: form_password_api,
        from: {
            top: "65%",
        }
    }));

    const [form_confirm_styles, form_confirm_api] = useSpring(() => ({
        x: 0,
        velocity: 0
        //ref: form_confirm_api,
        /* from: {
            left: "20%",
            opacity: "0%"
        } */
    }));

    const [button_styles, button_api] = useSpring(() => ({
        scale: 1,
        /* config: {
            tension: 200,
            friction: 5
        }, */
        from: {
            width: "3cm",
            left: "calc(50% - 1.5cm)"
        },
    }));

    function button_pointer_handler(e) {
        //console.log(e.type);
        if (!login.current) {
            wrong("Enter your login!", form_login_api);
        } else if (login.current.length < 4) {
            wrong("Login is too short!", form_login_api, set_login_color);
        } else if (selector.current && !name.current) {
            wrong("Enter your name!", form_name_api);
        } else if (selector.current && name.current.slice(0, 1) == "#") {
            wrong("'#' is not allowed", form_name_api, set_name_color);
        } else if (!password.current) {
            wrong("Enter your password!", form_password_api);
        } else if (password.current.length < 5) {
            wrong("Minimum 5 characters!", form_password_api, set_confirm_color);
        } else if (selector.current && !confirm.current) {
            wrong("Confirm your password!", form_confirm_api);
        } else if (selector.current && (password.current != confirm.current)) {
            wrong("Password and confirm\nare not equal!", [form_password_api, form_confirm_api], set_confirm_color, false);
        } else {
            button_api.start({
                to: [
                    {scale: 0.9},
                    {scale: 1}
                ],
                config: {
                    mass: 1,
                    friction: 20,
                    tension: 800,
                },
            });

            let uri = selector.current ? "/registration" : "/access";
            let data = {
                "login": login.current,
                "password": password.current
            };

            if (selector.current) {
                data["name"] = name.current;
                data["confirm"] = confirm.current;
            }

            console.log(data["login"]);
            if (selector.current) console.log(data["name"]);
            console.log(data["password"]);

            ajax_x("POST", uri, data, function(xhr) {
                switch (xhr.status) {
                    case 301:
                        document.location.href = xhr.getResponseHeader("Content-Location");
                    break;
                    
                    case 400:
                        wrong(xhr.responseText);
                    break;

                    case 404:
                        wrong(xhr.responseText);
                    break;
                }
            });
        }
    }

    function wrong(text, api = false, color = false, back = true) {
        setCursor("nocursor");
        button_api.start({
            to: {
                width: "4cm",
                left: "calc(50% - 2cm)",
            },
            config: config.current
        });

        set_button_text(text);
        if (color) {
            if (Array.isArray(color)) {
                for (let paint of color) {
                    paint("red");
                }
            } else {
                color("red");
            }
        }

        /* if (api) {
            if (Array.isArray(api)) {
                for (let move of api) {
                    move.start({
                        config: {
                            velocity: springs.current ? 1 : -1,
                            mass: 1,
                            friction: 20,
                            tension: 800,
                        }
                    });
                }
                springs.current = !springs.current;
            } else {
                api.start({
                    config: {
                        velocity: springs.current ? 1 : -1,
                        mass: 1,
                        friction: 20,
                        tension: 800,
                    },
                });
                springs.current = !springs.current;
            }
        } */

        setTimeout(() => {
            if (back) {
                if (color) {
                    if (Array.isArray(color)) {
                        for (let paint of color) {
                            paint("green");
                        }
                    } else {
                        color("green");
                    }
                }
            }
            setCursor("pointer");
                set_button_text("Go!");
                button_api.start({
                    to: {
                        width: "3cm",
                        left: "calc(50% - 1.5cm)",
                    },
                    config: config.current,
                });
        }, 2000);
    }

    function input_onChange_handler(e) {
        switch (e.target.offsetParent.id) {
            case "form_login":
                if (e.target.value.length - login.current.length == 1) {
                    if (e.target.value.length < 11) {
                        login.current = e.target.value;
                        set_login_input(login.current);
                    }
                } else if (e.target.value.length - login.current.length == -1) {
                    login.current = e.target.value;
                    set_login_input(login.current);
                } else if (e.target.value.length > 10) {
                    login.current = e.target.value.slice(0, 10);
                    set_login_input(login.current);
                } else {
                    login.current = e.target.value;
                    set_login_input(login.current);
                }
            break;

            case "form_name":
                if (e.target.value.length - name.current.length == 1) {
                    if (e.target.value.length < 16) {
                        name.current = e.target.value;
                        set_name_input(name.current);
                    }
                } else if (e.target.value.length - name.current.length == -1) {
                    name.current = e.target.value;
                    set_name_input(name.current);
                } else if (e.target.value.length > 15) {
                    name.current = e.target.value.slice(0, 15);
                    set_name_input(name.current);
                } else {
                    name.current = e.target.value;
                    set_name_input(name.current);
                }
            break;

            case "form_password":
                if (confirm.current) {
                    if ((e.target.value.length - password.current.length) == 1) {
                        if (e.target.value.length > confirm.current.length) {
                            if (e.target.value.length < 17) {
                                set_confirm_color("red");
                                password.current = e.target.value;
                                set_password_input(password.current);
                            }
                        } else {
                            if (!first_incorrect.current) {
                                if (e.target.value.slice(-1) !== confirm.current.charAt(e.target.value.length - 1)) {
                                    first_incorrect.current = e.target.value.length;
                                    set_confirm_color("red");
                                } else {
                                        if (e.target.value.length == confirm.current.length) {
                                            set_confirm_color("lime");
                                        } else {
                                            set_confirm_color("green");
                                        }
                                    }
                                    password.current = e.target.value;
                                    set_password_input(password.current);
                            } else {
                                    password.current = e.target.value;
                                    set_password_input(password.current);
                                }
                        }
                    } else if ((e.target.value.length - password.current.length) == -1) {
                            if (e.target.value.length > confirm.current.length) {
                                password.current = e.target.value;
                                set_password_input(password.current);
                            } else {
                                if (!first_incorrect.current) {
                                    if (e.target.value.length == confirm.current.length) {
                                        set_confirm_color("lime");
                                    } else {
                                        set_confirm_color("green");
                                    }
                                    password.current = e.target.value;
                                    set_password_input(password.current);
                                } else {
                                    if ((e.target.value.length) < first_incorrect.current) {
                                        first_incorrect.current = 0;
                                        set_confirm_color("green");
                                        password.current = e.target.value;
                                        set_password_input(password.current);
                                    } else {
                                        password.current = e.target.value;
                                        set_password_input(password.current);
                                    }
                                }
                            }
                        }
                } else {
                        if (e.target.value.length - password.current.length == 1) {
                            if (e.target.value.length < 17) {
                                password.current = e.target.value;
                                set_password_input(password.current);
                            }
                        } else if (e.target.value.length > 16) {
                                password.current = e.target.value.slice(0, 16);
                                set_password_input(password.current);
                            } else {
                                    password.current = e.target.value;
                                    set_password_input(password.current);
                                }
                    }
            break;

            case "form_confirm":
                if (password.current) {
                    if ((e.target.value.length - confirm.current.length) == 1) {
                        if (e.target.value.length > password.current.length) {
                            if (e.target.value.length < 17) {
                                set_confirm_color("red");
                                confirm.current = e.target.value;
                                set_confirm_input(confirm.current);
                            }
                        } else {
                            if (!first_incorrect.current) {
                                if (e.target.value.slice(-1) !== password.current.charAt(e.target.value.length - 1)) {
                                    first_incorrect.current = e.target.value.length;
                                    set_confirm_color("red");
                                } else {
                                    if (e.target.value.length == password.current.length) {
                                        set_confirm_color("lime");
                                    } else {
                                        set_confirm_color("green");
                                    }
                                }
                                confirm.current = e.target.value;
                                set_confirm_input(confirm.current);
                            } else {
                                confirm.current = e.target.value;
                                set_confirm_input(confirm.current);
                            }
                        }
                    } else {
                        if ((e.target.value.length - confirm.current.length) == -1) {
                            if (e.target.value.length > password.current.length) {
                                set_confirm_color("red");
                                confirm.current = e.target.value;
                                set_confirm_input(confirm.current);
                            } else {
                                if (!first_incorrect.current) {
                                    if (e.target.value.length == password.current.length) {
                                        set_confirm_color("lime");
                                    } else {
                                        set_confirm_color("green");
                                    }
                                    confirm.current = e.target.value;
                                    set_confirm_input(confirm.current);
                                } else {
                                    if ((e.target.value.length) < first_incorrect.current) {
                                        first_incorrect.current = 0;
                                        set_confirm_color("green");
                                        confirm.current = e.target.value;
                                        set_confirm_input(confirm.current);
                                    } else {
                                        confirm.current = e.target.value;
                                        set_confirm_input(confirm.current);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (!(Math.abs(e.target.value.length - confirm.current.length) > 1)) {
                        if (e.target.value.length < 17) {
                            confirm.current = e.target.value;
                            set_confirm_input(confirm.current);
                        }
                    }
                }
            break;
        }
    }

    function selector_changer(e) {
        if ((e.currentTarget.id == "new_account") && !selector.current) {
            selector.current = !selector.current;
            set_signIn_class("def");
            set_signUp_class("active")
            /* selector_api.start({
                to: [
                    {left: "0", width:"100%",  opacity: "0.2"},
                    {left: "50%", width:"50%",  opacity: "1"}
                ],
                config: config.current
            }); */

            form_login_api.start({
                to: {
                    top: "40%",
                },
                config: config.current,
                onRest: () => {
                    set_inputs_state(!inputs_state);
                    form_name_api.start({
                        to: {
                            left: "5%",
                            opacity: "100%"
                        },
                        config: config.current,
                    });
                    form_confirm_api.start({
                        to: {
                            left: "5%",
                            opacity: "100%"
                        },
                        config: config.current,
                    });
                }
            });

            form_password_api.start({
                to: {
                    top: "60%",
                },
                config: config.current,
            });
        } else if ((e.currentTarget.id == "sign_in") && selector.current) {
            selector.current = !selector.current;
            confirm.current = "";
            set_confirm_color("green");
            set_signIn_class("active");
            set_signUp_class("def")

            selector_api.start({
                to: [
                    {left: "0", width:"100%",  opacity: "0.2"},
                    {left: "0%", width:"50%",  opacity: "1"}
                ],
                config: config.current
            });

            form_name_api.start({
                to: {
                    left: "10%",
                    opacity: "0%"
                },
                config: config.current,
                onRest: () => {
                    set_confirm_input("");
                    set_inputs_state(!inputs_state);

                    form_login_api.start({
                        to: {
                            top: "45%",
                        },
                        config: config.current
                    });

                    form_password_api.start({
                        to: {
                            top: "65%",
                        },
                        config: config.current
                    });
                }
            });

            form_confirm_api.start({
                to: {
                    left: "10%",
                    opacity: "0%"
                },
                config: config.current,
            });
        }
    }

    if(states.visible) {
        return(
            <animated.div id="main_form" style={form_styles}>
                <div id="form_title"><div id="title_text">Who are you?</div></div>

                <animated.div id="form_login" style={form_login_styles}>
                        <input type="text" value={login_input} onChange={input_onChange_handler} placeholder="Login" className={login_color}></input>
                </animated.div>

                {inputs_state ? 
                    <animated.div id="form_name" style={form_name_styles}>
                        <input type="text" value={name_input} onChange={input_onChange_handler} placeholder="Name" className={name_color}></input>
                    </animated.div>
                :null}
                
                <animated.div id="form_password" style={form_password_styles}>
                    <input type="text" value={password_input} onChange={input_onChange_handler} placeholder="Password" className={confirm_color}></input>
                </animated.div>

                {inputs_state ?
                    <animated.div id="form_confirm" style={form_confirm_styles}>
                        <input type="text" value={confirm_input} onChange={input_onChange_handler} placeholder="Confirm password" className={confirm_color}></input>
                    </animated.div> 
                :null}

                <div id="request_type_selector">
                   {/*  <animated.div id="type_selector" style={selector_styles}></animated.div> */}
                    <div id="sign_in" className="pointer" onPointerDown={selector_changer}><div className={signIn_class}>Sign In</div></div>
                    <div id="new_account" className="pointer" onPointerDown={selector_changer}><div className={signUp_class}>Sign Up</div></div>
                </div>

                <animated.div id="input_button" onPointerDown={button_pointer_handler} style={button_styles}><input type="button" value={button_text} className={cursor} /></animated.div>
            </animated.div>
        );
    }
    return null;
}