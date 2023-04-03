<script lang="ts">
	import { derived, get } from 'svelte/store';
	import { GraphApi } from './graphApi';
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

	$: selected = get(GraphApi.selectedIds).includes(nodeId);
	GraphApi.selectedIds.subscribe((ids) => {
		selected = ids.includes(nodeId);
	});
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

	const selectNode = (id: string) => {
		GraphApi.selectedIds.set([id]);
	};
</script>

<div class="container" id={nodeId} style={cssVarStyles} on:click={() => selectNode(nodeId)}>
	{name}
	{#if selected}
		<div class="connector" />
	{/if}
</div>

<style>
	.container {
		text-align: center;
		background-color: var(--primary-300);
		padding: 7px;
		border: solid 1px var(--text-100);
		border-radius: 7px;
		box-shadow: 3px 3px 5px 0;
		position: absolute;
	}

	.connector {
		--size: 30px;
		background-color: var(--accent-100);
		border-radius: calc(var(--size) / 3);
		border: solid 1px var(--accent-200);
		position: absolute;
		left: calc(50% - var(--size) / 2);
		bottom: calc(-0.5 * var(--size));
		width: var(--size);
		height: var(--size);
	}
</style>
