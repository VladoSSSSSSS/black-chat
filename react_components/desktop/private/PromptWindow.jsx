import {useRef, useState} from "react";
import ajax_x from "ajax_x";
import { useSpring, useSpringRef, animated, config } from '@react-spring/web';

export default function PromptWindow({api}) {
    const counter = useRef(4);
    const [button_text, set_button_text] = useState("Yes");
    const [progress, set_progress] = useState(0);

    const prompt_api = useSpring({
        from: {
            opacity: 0,
            y: 0
        },
        to: {
            opacity: 1,
            y: -10
        },
        config: config.stiff
    });

    const [button_styles, button_api] = useSpring(() => ({
        from: {
            scale: 1,
        },
        /* onRest: (result, spring) => {
            if (result.value.scale == 0.95) {
                console.log(result);
                button_api.start({
                    scale: 1.05,
                    config: {
                        tension: 200,
                        friction: 5
                    }
                })
            }
        } */
    }));

    const progressbar_style = useSpring({
        from: {
            width: "0",
        },
        to: {
            width: String(progress) + "%",
        },
        config: config.stiff
    });

    function button_pointer_handler(e) {
        console.log(e.type);
        switch (e.type) {
            case "pointerover":
            button_api.start({
                to: {
                    scale: 1.05
                },
                config: {
                    duration: 100
                }
            });
            break;

            case "pointerdown":
                /* button_api.start({
                    from: {
                        scale: 1.05
                    },
                    to: [
                        {scale: 1.05},
                        {scale: 0.95},
                    ],
                    config: {
                        duration: 100
                    },
                }); */

                /* let uri = selector_state ? "/access" : "/registration";
                let data = {
                    "login": login_input,
                    "password": password_input
                };
                user.ajax("POST", uri, data, function(xhr) {
                    document.location.href = xhr.getResponseHeader("Content-Location");
                }); */
                //progressbar_api.start();
                if (progress < 100) {
                    set_progress(progress + 20);
                    if (progress == 80) {
                        set_button_text("Delete");
                    } else {
                        set_button_text(". . . " + String(counter.current--));
                    }
                } else {
                    ajax_x("DELETE", "/deleteProfile", "", function(xhr) {
                        document.location.href = xhr.getResponseHeader("Content-Location");
                    });
                }
            break;
            
            case "pointerleave":
                button_api.start({scale: 1});
            break;
        }
    }

    return (
        <animated.div id="deleteUserPrompt" style={prompt_api}>
            <div id="deleteText">
                Delete account?
            </div>

            <animated.div id="button_wrapper" onPointerLeave={button_pointer_handler} onPointerDown={button_pointer_handler} onPointerOver={button_pointer_handler} style={button_styles}>
                <animated.div id="delete_progress_bar" style={progressbar_style}></animated.div>
                <div id="button_text">{button_text}</div>
                <input style={{cursor: "pointer"}} type="button" onPointerDown={api} />
            </animated.div>
        </animated.div>
    );
}