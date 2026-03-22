import {useState, useRef} from "react";
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

export default function CreateTwit({listPosition, dataHash, meta, twit, type, message_api}) {
    const message = useRef(null);

    let className = (type == "mine") ? "posRight" : "posLeft";
    let metaclass = (type == "mine") ? "metaRight" : "metaLeft";
    const [{x}, api] = useSpring(() => ({x: 0}));

    const bind = useDrag(({movement: [mx], cancel, active, direction: [dx], event}) => {
        //console.log(dx);
        if (dx !== -1) {
            event.preventDefault();
            api.start({ x: active ? mx : 0, immediate: active });
            //console.log(mx);
            if (mx > 30 && active) {
                //console.log(`Message hash is: ${message.current.dataset.id}`);
                //ui(message.current.dataset.id);
                message_api(listPosition);
                cancel();
            };
        } else {
            cancel();
        }
    }
    );

    return (
        <div
            ref={message}
            className={className}
            data-hash={dataHash}
            data-position={listPosition}>

            <animated.div className="subtwit" {...bind()} style={{x, touchAction: 'none'}}>
                <div className={metaclass}>
                    {meta}
                </div>
                <div className="text">
                    {twit}
                </div>
            </animated.div>
        </div>
    );
}
