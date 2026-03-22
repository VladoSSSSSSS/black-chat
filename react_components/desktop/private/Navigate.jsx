import NavCell from "./NavCell";
import Separator from "./Separator";

export default function Navigate({visible, api, triggers}) {
    function handlePointerDown(e) {
        e.stopPropagation();
        let trueTarget = e.target.closest("[data-name]");
        api.select(trueTarget.id);
        switch (trueTarget.id) {
            case "dialogs":
                api.rooms("ok");
                api.search("none");
                api.settings("none");
                api.headerText("Messages");
            break;
    
            case "peoples":
                api.rooms("none");
                api.settings("none");
                api.search("ok");
                api.headerText("Search");
                break;

            case "settings":
                api.rooms("none");
                api.search("none");
                api.settings("ok");
                api.headerText("Settings");
            break;
        }
    }

    if (visible) {
        return (
            <div id="lineID" className="line" onPointerDown={handlePointerDown}>
                <NavCell data={{id: "dialogs", selected: triggers[0][1], content: "Чаты", icon: "chats"}} />
                <Separator id="sep_one" />
                <NavCell data={{id: "peoples", selected: triggers[1][1], content: "Все люди", icon: "explore"}} />
                <Separator id="sep_two" />
                <NavCell data={{id: "settings", selected: triggers[2][1], content: "Настройки", icon: "settings"}} />
            </div>
        );
    } else {
        return null;
    }
}