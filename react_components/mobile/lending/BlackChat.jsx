"use strict"

import { useSpring, useSpringRef, useChain, animated, config } from '@react-spring/web'

export default function BlackChat({api, bg}) {
    const second_api = useSpringRef();
    const first_word = useSpring({
       // ref: first_api,
        from: {
            left: "25vw"
        },
        to: {
            left: "0vw"
        },
        onRest: () => {
            console.log("stopped");
            second_api.start();
        }
        //config: {duration: 3000}
    });

    const second_word = useSpring({
        ref: second_api,
        from: {
            right: "25vw"
        },
        to: {
            right: "0vw"
        },
        onRest: () => {
            api.backApi.start();
            bg(false);
        }
        //config: {duration: 3000}
     });

    return (
        <div>
            <div id="wrapper_one">
                <animated.div id="word_one" style={{...first_word}}>Black</animated.div>
            </div>
            <div id="wrapper_two">
                <animated.div id="word_two" style={{...second_word}}>Chat</animated.div>
            </div>
        </div>
    );
        
}