<script>
	import Panel from '../components/Panel.svelte';
	import { state } from '../components/state';
	import Tree from '../components/Tree.svelte';
	import deftree from '../example.json';
	$: tree = deftree;
	state.subscribe((s) => {
		tree = s.tree;
	});
</script>

<svelte:head>
	<title>NeuralDash</title>
	<meta name="description" content="Think Fast !" />
</svelte:head>

<section>
	<Panel />
	<Tree {tree} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		height: 90vh;
		width: 90vw;
	}
</style>
