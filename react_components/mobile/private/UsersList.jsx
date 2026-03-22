import {useEffect, useRef, useState} from "react";
import ProfilePreview from "./ProfilePreview";
import List_component from "./List_component";

export default function UsersList({view, users, createRoom}) {
    /* const [isLoad, setIsLoad] = useState(false);
    const [data, setData] = useState(null); */

    /* useEffect(() => {
        if (visible && !data) {
            user.ajax("GET", route, "", responseHandler);
        }
    }, [visible]); */

    /* function responseHandler(xhr) {
        if (xhr.response) {
            let responseData = Object.entries(JSON.parse(xhr.response));
            setIsLoad(true);
            setData(responseData);
        }
    } */

    function clickHandler(e) {
       
    }

    switch (view) {
        case "none":
        return null;
            
        case "loading":
        return (
            <div className="globally inner">Please wait...</div>
        );

        case "ok":
        const list = [];
        for (const user_id of Object.keys(users)) {
            list.push(
                <ProfilePreview key={user_id} friendData={[user_id, users[user_id][0], users[user_id][1]]} createRoom={createRoom} />
            );
        }

        return (
            <div id="allPeoples" onPointerDown={clickHandler}>
                <List_component data={list}></List_component>
            </div>
        );
    }    
}