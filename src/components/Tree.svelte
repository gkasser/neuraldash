<script lang="ts">
	import { Canvas, Layer } from 'svelte-canvas';
	import { Draw } from './draw';
	import KLayer from './KLayer.svelte';
	import { mapOffset, targetLayout } from './state';

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
</script>

<Canvas {width} {height}>
	<Layer {render} />
</Canvas>
<div class="box-container" on:mouseout={console.log} on:mousemove={console.log}>
	{#each $targetLayout.layers as cl}
		<KLayer {...cl} />
	{/each}
</div>

<!-- 
	class:hovering={hoveringOverBasket === basket.name}
	on:drop={event => drop(event, basketIndex)}
  ondragover="return false" -->

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
