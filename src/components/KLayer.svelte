<script lang="ts">
	import { mapOffset } from './state';

	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;
	export let nodeId: string;
	export let name: string;
	export let label: string;
	export let params: { [name: string]: any };
	export let dragging: boolean;

	$: dx = x + $mapOffset.x - width / 2;
	$: dy = y + $mapOffset.y - height / 2;

	$: style = {
		width: width + 'px',
		height: height + 'px',
		transform: `translate(${dx}px, ${dy}px)`,
		transition: dragging ? 'none' : '0.3s cubic-bezier(0.01, 0.95, 0.26, 1.01)'
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
	}
</style>
