<script lang="ts">
	import Params from './Params.svelte';
	import { Canvas, Layer } from 'svelte-canvas';
	import type { Render } from 'svelte-canvas';
	import { Draw } from './draw';

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
		context.fillStyle = `hsl(${10 / 40}, 100%, 50%)`;
		context.beginPath();
		context.arc(150, 100, 100, 0, Math.PI * 2);
		context.fill();

		const b = new Draw(1, 0, 0, context, width, height);
		b.drawBlock({}, { x: 360, y: 200 });
	};
</script>

<Canvas {width} {height}>
	<Layer {render} />
</Canvas>
