export default function BackButton({func}) {
    return (
        <div id="backButton" onPointerDown={func}></div>
    );
}