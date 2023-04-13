<script lang="ts">
	import SearchPanel from '../components/Search.svelte';
	import Params from '../components/Params.svelte';
	import Tree from '../components/Tree.svelte';
	import InfoBulle from '../components/InfoBulle.svelte';
	import { NavigationAPI } from '../components/NavigationAPI';
	let width;
	let height;
</script>

<svelte:head>
	<title>NeuralDash</title>
	<meta name="description" content="Think Fast !" />
</svelte:head>

<svelte:window on:keyup={NavigationAPI.keyUpListener} />
<div bind:clientWidth={width} bind:clientHeight={height}>
	<SearchPanel />
	<Tree {height} {width} />
	<Params params={[]} />
	<InfoBulle />
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
