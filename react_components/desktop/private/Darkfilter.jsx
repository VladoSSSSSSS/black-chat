import { useSpring, animated, config } from '@react-spring/web';

export default function Darkfilter({api}) {
    const background_api = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 0.7
        },
        config: {
            duration: 150,
        }
    });
    return (
        <animated.div id="deleteUserBackground" className="wide_window" onPointerDown={()=> api()} style={background_api}></animated.div>
    );
}