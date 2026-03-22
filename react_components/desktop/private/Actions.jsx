import { useSpring, animated, config } from '@react-spring/web';

export default function Actions({deleteRoom, roomId, setClose}) {

    const styles = useSpring({
        from: {
            opacity: "0%",
            //top: "0px",
            //right: "0px",
            //width: "0",
            //height: "0",
            //size: "0%"
        },
        to: {
            opacity: "100%",
            //top: "0px",
            //right: "0px",
            //width: "3cm",
            //height: "3cm",
            //size: "100%"
        },
        config: config.stiff
    });

    const [close_styles, close_api] = useSpring(() => ({
        from: {
            scale: 1
        }
    }));

    function handleDown(e) {
        e.stopPropagation();
        let trueTarget = e.target.closest("[data-type]");
        if (trueTarget) {
            console.log(trueTarget.dataset.type);
            switch(trueTarget.dataset.type) {
                case "delete":
                deleteRoom(roomId);
                break;

                case "close":
                    close_api.start({
                        to: [
                            {scale: 0.9},
                            {scale: 1}
                        ],
                        config: {
                            duration: 100
                        },
                        onRest: () => {
                            setClose(false);
                        }
                    });
                break;
            }
        }
    }

        return (
            <animated.div className="actionsBox" style={{cursor: "pointer", ...styles}} onPointerDown={handleDown} >
                <div className="actionsR" data-type="delete">
                    <div className="actionSVG">
                        <div className="svgbox">
                            <svg fill="#808080" width="100%" height="100%" viewBox="0 0 24 24" id="delete-user-left-5" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" className="icon line-color">
                                <line id="secondary" x1="3" y1="18" x2="6" y2="15" style={{fill: "none", stroke: "#808080", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2}}>
                                </line>

                                <line id="secondary-2" data-name="secondary" x1="6" y1="18" x2="3" y2="15" style={{fill: "none", stroke: "#808080", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2}}>
                                </line>

                                <circle id="primary" cx="13" cy="8" r="5" style={{fill: "none", stroke: "#808080", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5}}>
                                </circle>
                                
                                <path id="primary-2" data-name="primary" d="M10,20.81A22,22,0,0,0,13,21c6,0,8-2,8-2V18a5,5,0,0,0-5-5H10" style={{fill: "none", stroke: "#808080", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5}}>
                                </path>
                            </svg>
                        </div>
                    </div>
                    <div className="action_one" style={{color: "#808080"}}>Delete</div>
                </div>

                <div className="actionsR" data-type="hide" style={{cursor: "not-allowed"}}>
                    <div className="actionSVG">
                        <div className="svgbox">
                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="Edit / Hide">
                                    <path id="Vector" d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.5C12.9702 13.8112 12.5071 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.4605 10.2135 10.9711 10.5608 10.6113" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className="action_one" style={{color: "#404040"}}>Hide</div>
                </div>

                <div className="actionsR" data-type="sounds" style={{cursor: "not-allowed"}}>
                    <div className="actionSVG">
                        <div className="svgbox">
                            <svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
                                <path stroke="#404040" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 21H8a1 1 0 01-1-1v-8a1 1 0 011-1h7l5-5 1.586-1.586C22.846 3.154 25 4.047 25 5.828V6m-8 17l4.586 4.586c1.26 1.26 3.414.367 3.414-1.414V14.5M7 28L29 6"/>
                            </svg>
                        </div>
                    </div>
                    <div className="action_one" style={{color: "#404040"}}>Mute</div>
                </div>

                <animated.div className="close_actions" data-type="close" style={close_styles}>
                    <div className="close_text">Close</div>
                </animated.div>
            </animated.div>
        );
    }