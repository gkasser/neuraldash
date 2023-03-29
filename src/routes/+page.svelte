<script lang="ts">
	import SearchPanel from '../components/Search.svelte';
	import Params from '../components/Params.svelte';
	import Tree from '../components/Tree.svelte';

	let width;
	let height;
</script>

<svelte:head>
	<title>NeuralDash</title>
	<meta name="description" content="Think Fast !" />
</svelte:head>

<div bind:clientWidth={width} bind:clientHeight={height}>
	<SearchPanel />

	<Tree {height} {width} />
	<Params params={['Bordel']} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		height: 100%;
		width: 100%;
	}
</style>
