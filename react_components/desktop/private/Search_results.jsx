import ProfilePreview from "./ProfilePreview";
import {useEffect, useRef, useState} from "react";
import { useSpring, useSpringRef, useSpringValue, animated, config } from '@react-spring/web'

export default function Search_result({view, user, friends, api}) {
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [result, setResult] = useState(false);

    const [results, results_api] = useSpring(() => ({
        from: {
            opacity: "0%",
            top: "5mm"
        }
    }));

    useEffect(() => {
        switch (view) {
            case "none":
                results_api.start({
                    to: {
                        opacity: "0%",
                        top: "5mm"
                    },
                    config: {
                        tension: 480,
                        friction: 40,
                        mass: 1
                    },
                    onRest: () => {
                        setResult(false);
                    }
                });
                setEmpty(false);
            break;
            
            case "loading":
                setEmpty(false);
                setResult(false);
                setLoading(true);
            break;

            case "undefined":
                setLoading(false);
                setEmpty(true);
            break;
            
            case "ok":
                setEmpty(false);
                setLoading(false);
                setResult(true);
                results_api.start({
                    to: {
                        opacity: "100%",
                        top: "0mm"
                    },
                    config: {
                        tension: 480,
                        friction: 40,
                        mass: 1
                    }
                });
            break;
        }
    }, [view]);

    return (
        <div id="search_results">
            {loading ? <span>Loading...</span> : null}
            {empty ? <span>The user in undefined :\</span> : null}
            {result ? 
                <animated.div id="search_results" style={results}>
                    <ProfilePreview user={user} createRoom={api.createRoom} setRoom={api.setRoom} friends={friends} headerText={api.headerText}></ProfilePreview>
                </animated.div>
            : null}
        </div>
    );
}