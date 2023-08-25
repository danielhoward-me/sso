'use client';

import {ColourScheme, CookieName, DEFAULT_COLOUR_SCHEME} from './../constants';
import {NavbarButton} from './navbar-elements';

import ComputerDesktopIcon from '@heroicons/react/24/outline/ComputerDesktopIcon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import {useEffect, useState} from 'react';


export function ColourSchemeButton({colourScheme}: {colourScheme: ColourScheme}) {
	useEffect(handleColourScheme);

	const iconClasses = 'self-center w-5 h-5';
	const icons = {
		[ColourScheme.BROWSER]: <ComputerDesktopIcon className={iconClasses}/>,
		[ColourScheme.LIGHT]: <SunIcon className={iconClasses}/>,
		[ColourScheme.DARK]: <MoonIcon className={iconClasses}/>,
	};

	const [icon, setIcon] = useState(icons[colourScheme]);

	function changeColourScheme() {
		const colourScheme = getColourScheme();
		const newColourScheme = (colourScheme + 1) % (Object.keys(ColourScheme).length / 2);
		setColourScheme(newColourScheme);
		setIcon(icons[newColourScheme]);
	}

	return (
		<NavbarButton onClick={changeColourScheme}>
			{icon}
		</NavbarButton>
	);
}

function handleColourScheme() {
	// Light and dark colour schemes are handled server-side
	if (getColourScheme() === ColourScheme.BROWSER) updateDarkMode();

	const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	darkModeMediaQuery.addEventListener('change', () => {
		if (getColourScheme() !== ColourScheme.BROWSER) return;
		updateDarkMode();
	});
}

function getColourScheme(): ColourScheme {
	const colourSchemeCookie = parseInt(getCookie(CookieName.COLOUR_SCHEME) ?? '-1');
	return colourSchemeCookie in ColourScheme ? colourSchemeCookie : DEFAULT_COLOUR_SCHEME;
}

function setColourScheme(colourScheme: ColourScheme) {
	setCookie(CookieName.COLOUR_SCHEME, colourScheme.toString(), 365);
	updateDarkMode();
}
function updateDarkMode() {
	const colourScheme = getColourScheme();
	const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	setCookie(CookieName.BROWSER_PREFERED_SCHEME, (darkModeMediaQuery.matches ? ColourScheme.DARK : ColourScheme.LIGHT).toString(), 365);

	const darkMode = colourScheme === ColourScheme.BROWSER ? darkModeMediaQuery.matches : colourScheme === ColourScheme.DARK;
	document.documentElement.classList.toggle('dark', darkMode);
}

function getCookie(name: string): string | undefined {
	const cookies = document.cookie.split(/; */);
	const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
	return cookie?.split('=')[1];
}
function setCookie(name: string, value: string, days: number) {
	const d = new Date();
	d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
	document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}
