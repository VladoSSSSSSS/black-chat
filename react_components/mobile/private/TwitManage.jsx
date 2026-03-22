import {useEffect, useState, useRef} from "react";
import { useSpring, animated } from '@react-spring/web';

export default function TwitManage({visible, storage, currentRoom, target_msg, api}) {
    const [show, setShow] = useState(false);
    const prev_room = useRef(null);

    const [springs_styles, springs_api] = useSpring(() => ({
        from: {
            y: 0,
            opacity: "0%",
        },
    }));

    useEffect(()=>{
        if (visible) {
            setShow(true);
            springs_api.start({
                to: {
                    y: -5,
                    opacity: "100%"
                },
                config: {
                    duration: 200
                }
            });
        } else {
            springs_api.start({
                to: {
                    y: 0,
                    opacity: "0%"
                },
                config: {
                    duration: 150
                },
                onRest: () => {
                    setShow(false);
                }
            });
        }

    }, [visible]);

    useEffect(() => {
        if (currentRoom[0] != prev_room.current) {
            setShow(false);
            springs_api.start({
                to: {
                    y: 0,
                    opacity: "0%"
                },
                immediate: true
            });
            prev_room.current = currentRoom[0];
        }
    }, [currentRoom]);


    function clickHandler(event) {
        event.stopPropagation();
            api(target_msg, storage[currentRoom[0]][target_msg]["hash"]);
    }

    function responseHandler(xhr) {

    }

    function format(input) {
        //2025-12-16 00:53:00
        let year = input.slice(0, 4);
        let month = input.slice(5, 7);
        let day = input.slice(8, 10);
        let time = input.slice(11, 16);

        let months = {
            "01": "Jan",
            "02": "Feb",
            "03": "Mar",
            "04": "Apr",
            "05": "May",
            "06": "Jun",
            "07": "Jul",
            "08": "Aug",
            "09": "Sep",
            "10": "Oct",
            "11": "Nov",
            "12": "Dec"
        }

        if (day[0] === "0") {
            day = day[1];
        }

        return " " + time + ", " + day + " " + months[month] + " " + year;
    }

    if (currentRoom[0] in storage && target_msg in storage[currentRoom[0]] && show) {
        if (currentRoom[1]["deleted_at"]) {
            return(
                <animated.div style={springs_styles} id="twitmanage_">
                    <div id="actions">
                        <div className="just_sth">Message info</div>
                    </div>
                    <div id="msg_created_at">
                        <span className="param">Created at:</span>
                        <span className="param_value">{format(storage[currentRoom[0]][target_msg]["putdate"])}</span>
                    </div>
                </animated.div>
            );
        } else {
            return (
                <animated.div style={springs_styles} id="twitmanage">
                    <div id="actions">
                        <div className="just_sth">Message info</div>
                    </div>
                    <div id="msg_created_at">
                        <span className="param">Created at:</span>
                        <span className="param_value">{format(storage[currentRoom[0]][target_msg]["putdate"])}</span>
                    </div>
                    <div id="delete" onPointerDown={clickHandler}>
                        <div id="delete_text" className="just_sth">Delete message</div>
                    </div>
                </animated.div>
            );
        }
    } else {
        return null;
    }

}