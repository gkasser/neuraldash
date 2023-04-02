<script lang="ts">
	import type { IDrawLayer } from './types';

	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;
	export let nodeId: string;
	export let name: string;
	export let label: string;
	export let params: { [name: string]: any };

	$: style = {
		width: width + 'px',
		height: height + 'px',
		transform: `translate(${x}px, ${y}px)`
	};
	$: cssVarStyles = Object.entries(style)
		.map(([key, value]) => `${key}:${value}`)
		.join(';');
</script>

<div id={nodeId} style={cssVarStyles}>
	{name}
</div>

<style>
	div {
		text-align: center;
		background-color: var(--primary-300);
		padding: 7px;
		border: solid 1px var(--text-100);
		border-radius: 7px;
		box-shadow: 3px 3px 5px 0;
		position: absolute;
		transition: 1s ease-in-out;
	}
</style>
