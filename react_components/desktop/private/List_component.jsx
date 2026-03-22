import {useEffect, useRef, useState} from "react";
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

export default function List_component({data}) {
    const [scrollbar, set_scrollbar] = useState(false);

    const wrapper = useRef(null);
    const field = useRef(null);
    const scrollparent = useRef(null);
    const scrollkid = useRef(null);
    const allowOnChange = useRef(false);
    const metrics = useRef({});
    const gotBottom = useRef(false);
    const timer = useRef({});
    const gotTop = useRef(false);

    const [list_styles, list_api] = useSpring(() => ({
        y: 0,
        /* onChange: (result, spring) => {
            if (allowOnChange.current) {
                let innerRect = wrapper.current.getBoundingClientRect();
                let outerRect = field.current.getBoundingClientRect();
                if (innerRect.y - outerRect.y >= 20) {
                    //allowOnChange.current = false;
                    //console.log(currentRoom[0]);
                    list_api.start({
                        y: getSizes().wrapperTop,
                        config: {
                            mass: 0.5,
                            friction: 5,
                            tension: 12,
                        }
                    });
                } else if (outerRect.bottom - innerRect.bottom >= 20) {
                    //console.log(currentRoom);
                    allowOnChange.current = false;
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
        }, */        
    }));

    const [scrollbrick_styles, scrollbrick_api] = useSpring(() => ({
        y: 0,
        /* onChange: (result, spring) => {

        } */
    }));

    const scrollbar_styles = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: scrollbar ? 0.7 : 0
        }
    });

    const list_gestures = useGesture(
        {
            onDrag: ({movement: [, my], direction: [, dirY], velocity: [, vy], down, cancel}) => {
                if(metrics.current.heightDiff <= 0) return;
                let innerRect = wrapper.current.getBoundingClientRect();
                let outerRect = field.current.getBoundingClientRect();
                if (innerRect.y - outerRect.y >= 10 && dirY > 0) {
                    gotTop.current = true;
                    cancel();
                } else if (outerRect.bottom - innerRect.bottom >= 10 && dirY < 0) {
                    gotBottom.current = true;
                    cancel();
                } else {
                    //console.log(vy);
                    if ((vy > 1.5) && (!scrollbar)) {
                        set_scrollbar(true);
                        timer.current = setTimeout(() => set_scrollbar(false), 4000);
                    }
                    let targetPosition = metrics.current.lastPosition + my;
                    list_api.start({y: targetPosition, immediate: down});
                    scrollbrick_api.start({y: -targetPosition * metrics.current.scrollDiff, immediate: true});
                }
            },

            onDragEnd: ({direction: [, dirY], velocity: [, vy]}) => {
                if(metrics.current.heightDiff <= 0) return;
                if (gotTop.current) {
                    gotTop.current = false;
                    list_api.start({
                        y: 0,
                        config: {
                            mass: 0.5,
                            friction: 5,
                            tension: 12,
                        }
                    });
                    metrics.current.lastPosition = 0;
                    metrics.current.lastScrollPosition = 0;
                    scrollbrick_api.start({y: 0, immediate: true});
                } else if (gotBottom.current) {
                    gotBottom.current = false;
                    list_api.start({
                        y: metrics.current.wrapperTop,
                        config: {
                            mass: 0.5,
                            friction: 5,
                            tension: 12,
                        }
                    });
                    metrics.current.lastPosition = -metrics.current.heightDiff;
                    metrics.current.lastScrollPosition = -(metrics.current.lastPosition * metrics.current.scrollDiff);
                    scrollbrick_api.start({y: metrics.current.lastScrollPosition, immediate: true});
                } else {
                    //console.log(currentRoom[0]);
                    metrics.current.lastPosition = wrapper.current.getBoundingClientRect().top - field.current.getBoundingClientRect().top;
                    metrics.current.lastScrollPosition = -(metrics.current.lastPosition * metrics.current.scrollDiff);
                    console.log('new');
                    /* list_api.start({
                        config: {
                            decay: 0.999,
                            velocity: vy * dirY,
                        }
                    }); */
                }
            },
            
            onPointerDown: ({event}) => {
                metrics.current.lastPosition = wrapper.current.getBoundingClientRect().top - field.current.getBoundingClientRect().top;
                metrics.current.lastScrollPosition = -(metrics.current.lastPosition * metrics.current.scrollDiff);
            },
        },

        {
            drag: { axis: "y" }
        }
    );

    const scrollBar_gestures = useGesture(
        {
            onDrag: ({movement: [, my], direction: [, dirY], down, cancel}) => {
                let scrollBar = scrollparent.current.getBoundingClientRect();
                let scrollBrick = scrollkid.current.getBoundingClientRect();
                if (scrollBrick.top <= scrollBar.top && dirY < 0) {
                    cancel();
                    list_api.start({
                        y: 0,
                        config: {
                            mass: 0.5,
                            friction: 5,
                            tension: 12,
                        }
                    });
                    scrollbrick_api.start({y: 0, immediate: true});
                    //scrollbrick_api.start({y: small, immediate: down});
                    //list_api.start({y: big, immediate: down});
                } else if (scrollBrick.bottom >= scrollBar.bottom && dirY > 0) {
                    cancel();
                    list_api.start({
                        y: metrics.current.wrapperTop,
                        config: {
                            mass: 0.5,
                            friction: 5,
                            tension: 12,
                        }
                    });
                    scrollbrick_api.start({y: metrics.current.scrollbrick_bottom, immediate: true});
                    //scrollbrick_api.start({y: small, immediate: down});
                    //list_api.start({y: big, immediate: down});
                } else {
                    let small = metrics.current.lastScrollPosition + my;
                    let big = -(small / metrics.current.scrollDiff);
                    scrollbrick_api.start({y: small, immediate: down});
                    list_api.start({y: big, immediate: down});
                }
            },

            onDragEnd: ({movement: [, my]}) => {
                metrics.current.lastScrollPosition += my;
            },
            
            onPointerDown: ({event}) => {
                /* metrics.current.lastPosition = wrapper.current.getBoundingClientRect().top - field.current.getBoundingClientRect().top;
                metrics.current.lastScrollPosition = -(metrics.current.lastPosition * metrics.current.scrollDiff); */
            },
        }
    );

    function updateSizes() {
        metrics.current.heightDiff = wrapper.current.offsetHeight - field.current.offsetHeight;
        metrics.current.wrapperTop = (metrics.current.heightDiff <= 0) ? 0 : -metrics.current.heightDiff;
        metrics.current.scrollbrick_bottom = field.current.offsetHeight - scrollkid.current.offsetHeight;
        metrics.current.scrollDiff = (scrollparent.current.offsetHeight - scrollkid.current.offsetHeight) / metrics.current.heightDiff;
        metrics.current.lastPosition = wrapper.current.getBoundingClientRect().top - field.current.getBoundingClientRect().top;
        metrics.current.lastScrollPosition = -(metrics.current.lastPosition * metrics.current.scrollDiff);
        //console.log(`startPoint updated: ${metrics.current[currentRoom].startPoint}`);
        //console.log(`WrapperTop updated: ${metrics.current[currentRoom[0]].wrapperTop}`);
    }

    function scrollbar_event_handler(e) {
        if(metrics.current.heightDiff <= 0) return;
        switch (e.type) {
            case "pointerover":
                set_scrollbar(true);
                clearTimeout(timer.current);
            break;

            case "pointerleave":
                set_scrollbar(false);
            break;
        }
    }

    useEffect(()=>{
        if (data) {
            //list_api.start({y: metrics.current.lastPosition, immediate: true});
            //console.log(metrics.current[currentRoom].lastPosition);
            updateSizes();
        }
    }, [data]);

    return (
        <div className="list_container">
            {/* gradient opacity layer should be here */}
            <div className="border" ref={field}>
                <animated.div className="draggable_list" ref={wrapper} style={list_styles} {...list_gestures()}>{data}</animated.div>
                <animated.div className="scroll_bar" onPointerLeave={scrollbar_event_handler} onPointerOver={scrollbar_event_handler} ref={scrollparent} style={scrollbar_styles}>
                    <animated.div className="draggable_bar" ref={scrollkid} style={scrollbrick_styles} {...scrollBar_gestures()}></animated.div>
                </animated.div>
            </div>
        </div>
    );
}