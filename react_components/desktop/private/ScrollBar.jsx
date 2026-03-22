import {useEffect, useRef, useState} from "react";
import { useSpring, animated } from '@react-spring/web';

export default function ScrollBar({visible, control, wrapperHeight}) {
    const last = useRef(0);
    const parent = useRef(null);
    const kid = useRef(null);

    useEffect(()=>{
        if (visible) {
            api.start({y: 0, immediate: true});
        }
    }, [visible]);
    
    if (visible) {
        return (
            <div id="scrollBar" ref={parent}>
                <animated.div id="scrollBrick" ref={kid} {...bind()} style={{y}} />
            </div>
        );
    } else {
        return null;
    }
}