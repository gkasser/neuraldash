<script lang="ts">
	import type { Point } from './types';
	import { Canvas, Layer } from 'svelte-canvas';
	import { Draw } from './draw';
	import KLayer from './KLayer.svelte';
	import { mapOffset, targetLayout } from './state';
	import { NavigationAPI } from './NavigationAPI';
	export let width: number;
	export let height: number;

	$: render = ({
		context,
		width,
		height
	}: {
		context: CanvasRenderingContext2D;
		width: number;
		height: number;
	}) => {
		const { x, y } = $mapOffset;
		const b = new Draw(1, x, y, context, width, height);
		$targetLayout.arrows.forEach(({ points }) => {
			b.drawLine(points);
		});
	};

	$: dragging = null as Point | null;

	const mouseDown = (e: MouseEvent) => {
		dragging = {
			x: e.screenX,
			y: e.screenY
		};
	};

	const mouseUp = (e: MouseEvent) => {
		dragging = null;
	};

	const mouseMove = (e: MouseEvent) => {
		if (!!dragging) {
			mapOffset.update((p) => {
				p.x += e.screenX - dragging!.x;
				p.y += e.screenY - dragging!.y;
				return p;
			});
			dragging = {
				x: e.screenX,
				y: e.screenY
			};
		}
	};

	export const keyUp = (e: KeyboardEvent) => {
		console.log(e.key);
		if (e.key == 'Enter') {
			NavigationAPI.Search();
		} else if (e.key == 'e') {
			NavigationAPI.Params();
		}
	};
</script>

<Canvas {width} {height} on:keydown={keyUp}>
	<Layer {render} />
</Canvas>
<div
	class="box-container"
	on:mousemove={mouseMove}
	on:mousedown={mouseDown}
	on:mouseup={mouseUp}
	on:mouseout={mouseUp}
	on:keydown={keyUp}
>
	{#each $targetLayout.layers as cl}
		<KLayer {...cl} dragging={!!dragging} />
	{/each}
</div>

<style>
	.box-container {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		overflow: hidden;
	}
</style>
