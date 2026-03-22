import Chat_SVG from "./Chat_SVG";


export default function NavCell({data}) {
    //console.log(data)
    return (
        <div id={data.id} data-name={data.id} className={"default " + (data.selected ? "selected" : "")}>
            <Chat_SVG icon={data.icon} selected={data.selected } />
            {/*   {data.content}   */}
        </div>
    );
}