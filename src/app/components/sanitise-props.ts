// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function sanitiseProps(props: {[key: string]: any}, sanitiseProps: string[]): {[key: string]: any} {
	const newProps = {};
	Object.keys(props).forEach((attribute) => {
		if (sanitiseProps.includes(attribute)) return;
		newProps[attribute] = props[attribute];
	});
	return newProps;
}
