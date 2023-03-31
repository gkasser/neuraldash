<script lang="ts">
	import { Canvas, Layer } from 'svelte-canvas';
	import { Draw } from './draw';
	import { currentLayout } from './state';

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

		$currentLayout.nodes.forEach((n) => {
			b.drawBlock(n);
		});

		$currentLayout.edges.forEach(({ points }) => {
			b.drawLine(points);
		});
	};
</script>

<Canvas {width} {height}>
	<Layer {render} />
</Canvas>
