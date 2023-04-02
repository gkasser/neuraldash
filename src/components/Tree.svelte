<script lang="ts">
	import { Canvas, Layer } from 'svelte-canvas';
	import { Draw } from './draw';
	import KLayer from './KLayer.svelte';
	import { currentArrows, currentLayers } from './state';

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
		const b = new Draw(1, 300, 50, context, width, height);

		$currentArrows.forEach(({ points }) => {
			b.drawLine(points);
		});

		$currentLayers.forEach((layer) => {
			b.drawBlock({
				height: layer.height,
				width: layer.width,
				x: layer.x,
				y: layer.y,
				label: layer.name
			});
		});
	};
</script>

<Canvas {width} {height}>
	<Layer {render} />
</Canvas>
<!-- {#each $currentLayers as cl}
	<KLayer {...cl} />
{/each} -->
