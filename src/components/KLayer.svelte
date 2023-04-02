<script lang="ts">
	import type { IDrawLayer } from './types';

	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;
	export let nodeId: string;
	export let name: string;
	export let params: { [name: string]: any };

	$: style = {
		width: width,
		height: height,
		top: x,
		left: y
	};
	$: cssVarStyles = Object.entries(style)
		.map(([key, value]) => `${key}:${value}px`)
		.join(';');

	console.log(style);
</script>

<div id={nodeId} style={cssVarStyles}>
	{name}
</div>

<style>
	div {
		background-color: cyan;
		position: absolute;
	}
</style>
