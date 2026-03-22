import {useEffect, useRef, useState} from "react";
import ajax_x from "ajax_x";
import Search_results from "./Search_results";
//import List_component from "./List_component";

export default function Search({api, states}) {
    const user = useRef(null);
    const value = useRef("");
    const [button_color, setButton_color] = useState("#606060");
    const [visible, setVisible] = useState("none");
    const [valueState, setValueState] = useState("");

    function handleChange(e) {
        if (e.target.value.length >= 4) {
            setButton_color("orange");
        } else {
            setButton_color("#606060");
        }
        if (e.target.value.length < value.current.length && e.target.value.length == 3 && visible != "none") {
            setVisible("none");
            user.current = "";
        }
        if (e.target.value.length < 11) {
            value.current = e.target.value
            setValueState(value.current);
        }
    }

    function sendCallback(r) {
        if (r.status == 404) {
            setVisible("undefined");
        } else if (r.status == 200) {
            user.current = JSON.parse(r.response);
            setVisible("ok");
        }
    }

    function clickHandler() {
        setVisible("loading");
        if (value.current.length > 10) value.current = value.current.slice(0, 10);
        if (value.current) ajax_x("GET", "/search", value.current, sendCallback);
    }

    switch (states.view) {
        case "none":
            return null;
        
        case "ok":
            return (
                <div id="allPeoples">
                    <div id="search_field">
                        <input type="search" id="search_input" value={valueState} onChange={handleChange} placeholder="Enter username"></input>
                        <div id="search_button" onPointerDown={clickHandler}>
                            <svg id="search_icon" width="0.6cm" height="0.6cm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.65 16.65M11 6C13.7614 6 16 8.23858 16 11M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke={button_color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    
                    <Search_results view={visible} user={user.current} friends={states.friends} api={{createRoom: api.createRoom, setRoom: api.setRoom, headerText: api.headerText}}></Search_results>
                    
                </div>
            );
    }
}