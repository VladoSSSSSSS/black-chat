//import {useEffect, useRef, useState} from "react";
//import { useSpring, useTrail, useSpringRef, useChain, animated, config } from '@react-spring/web';
//import Darkfilter from "./Darkfilter";
//import PromptWindow from "./PromptWindow";

export default function DeleteConfirmation({show_prompt, api}) {
    if (show_prompt) {
        return null;
    }

    return (
        <div id="delete_account" onPointerDown={api}>Delete account</div>
    );
}