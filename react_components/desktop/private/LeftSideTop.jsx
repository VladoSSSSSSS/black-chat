import Head from "./Head";
//import BackButton from "D:/Documents/Web_Project/Site/laravel-app/example-app/public/js/components/BackButton";

export default function LeftSideTop({text, css}) {
    return (
        <div id={css.id}>
            <Head text = {text} />
            <svg id="leftSideBarTopGradient" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="lgrad" x1="100%" y1="50%" x2="0%" y2="50%" gradientTransform="rotate(90)" >
						<stop offset="0%" stopOpacity="0" />
						<stop offset="50%" stopOpacity="1" />
					</linearGradient>
				</defs>
				<rect width="100%" height="100%" fill="url(#lgrad)" />
			</svg>
        </div>
    );
}