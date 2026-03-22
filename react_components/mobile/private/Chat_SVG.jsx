export default function Chat_SVG({icon, selected}) {
    let colour = selected ? "orange" : "#353535";
    //console.log(selected)
    switch (icon) {
        case "chats":
            return (
                <svg stroke={colour} className="iconsNavi" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2H8C4 2 2 4 2 8V21C2 21.55 2.45 22 3 22H16C20 22 22 20 22 16V8C22 4 20 2 16 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 9.5H17" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 14.5H14" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        break;

        case "explore":
            return (
                <svg stroke={colour} className="iconsNavi" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.41016 22C3.41016 18.13 7.26018 15 12.0002 15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.2 21.4C19.9673 21.4 21.4 19.9673 21.4 18.2C21.4 16.4327 19.9673 15 18.2 15C16.4327 15 15 16.4327 15 18.2C15 19.9673 16.4327 21.4 18.2 21.4Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 22L21 21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        break;

        case "settings":
            return (
                <svg stroke={colour} className="iconsNavi" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <g>
                        <path d="M15.5703 18.4996V14.5996" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.5703 7.45V5.5" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.5697 12.6502C17.0057 12.6502 18.1697 11.4861 18.1697 10.0502C18.1697 8.61426 17.0057 7.4502 15.5697 7.4502C14.1338 7.4502 12.9697 8.61426 12.9697 10.0502C12.9697 11.4861 14.1338 12.6502 15.5697 12.6502Z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.42969 18.4998V16.5498" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.42969 9.4V5.5" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.43008 16.5496C9.86602 16.5496 11.0301 15.3855 11.0301 13.9496C11.0301 12.5137 9.86602 11.3496 8.43008 11.3496C6.99414 11.3496 5.83008 12.5137 5.83008 13.9496C5.83008 15.3855 6.99414 16.5496 8.43008 16.5496Z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                </svg>
            );
        break;

    }
}