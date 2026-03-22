"use strict"

import {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import { useSpring, useSpringRef, useChain, animated, config } from '@react-spring/web'
import BlackChat from "./BlackChat";
import Form from "./Form";

export default function Lending() {
    const [logo_state, set_logo_state] = useState(true);
    const [form_state, set_form_state] = useState(false);
    const [foot, setFooter] = useState(false);
    const [background_state, set_background_state] = useState(true);
    const back = useSpringRef();

    const background = useSpring({
        ref: back,
        from: {
            background: "radial-gradient(ellipse at center, #ffffff 0%, #ffffff 100%)"
        },
        to: {
            background: background_state
            ? "radial-gradient(ellipse at center, #000000 0%, #000000 100%)"
            : "radial-gradient(ellipse at center, #006262ff 0%, #000013ff 120%)",

        },
        onRest: () => {
            set_form_state(true);
            set_logo_state(false);
        }
    });

    return (
        <animated.div id="backg" style={{...background}}>
            {logo_state ? <BlackChat api={{backApi: back, set_logo_state: set_logo_state}} bg = {set_background_state} /> : null}
            <Form states={{visible: form_state}} backApi={back} setFooter={setFooter} />
            {foot ? 
            <div id="footer">
                <div id="links">
                    <a href="https://t.me/gde_vlados"><img id="tg" src="svg/telegram2.svg"></img></a>
                    <a href="https://vk.com/gde_vlados"><img id="vk" src="svg/vk.svg"></img></a>
                </div>
                <div id="b_c">2026 Black Chat</div>
            </div>: null}
        </animated.div>
    );
        
}


const root = createRoot(
    document.querySelector("#root")
);
root.render(<Lending />);