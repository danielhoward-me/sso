'use client';

import {ColourScheme, CookieName, DEFAULT_COLOUR_SCHEME} from './../constants';
import {NavBarButton} from './navBarElements';

import ComputerDesktopIcon from '@heroicons/react/24/outline/ComputerDesktopIcon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import {useEffect, useState} from 'react';


export function ColourSchemeButton({colourScheme}: {colourScheme: ColourScheme}) {
	useEffect(handleColourScheme);

	const iconClasses = 'self-center w-5 h-5';
	const icons = {
		[ColourScheme.SYSTEM]: <ComputerDesktopIcon className={iconClasses}/>,
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
		<NavBarButton onClick={changeColourScheme}>
			{icon}
		</NavBarButton>
	);
}

function handleColourScheme() {
	// Light and dark colour schemes are handled server-side
	if (getColourScheme() === ColourScheme.SYSTEM) updateDarkMode();

	const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	darkModeMediaQuery.addEventListener('change', () => {
		if (getColourScheme() !== ColourScheme.SYSTEM) return;
		updateDarkMode();
	});
}

function getColourScheme(): ColourScheme {
	const colourSchemeCookie = parseInt(getCookie(CookieName.COLOUR_SCHEME) ?? '-1');
	return colourSchemeCookie in ColourScheme ? colourSchemeCookie : DEFAULT_COLOUR_SCHEME;
}

function setColourScheme(colourScheme: ColourScheme) {
	const d = new Date();
	d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
	document.cookie = `${CookieName.COLOUR_SCHEME}=${colourScheme}; expires=${d.toUTCString()}; path=/`;

	updateDarkMode();
}
function updateDarkMode() {
	const colourScheme = getColourScheme();
	const darkMode = colourScheme === ColourScheme.SYSTEM ? (
		window.matchMedia('(prefers-color-scheme: dark)').matches
	) : colourScheme === ColourScheme.DARK;

	document.documentElement.classList.toggle('dark', darkMode);
}

function getCookie(name: string): string | undefined {
	const cookies = document.cookie.split(/; */);
	const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
	return cookie?.split('=')[1];
}
