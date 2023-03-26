<script>
	import Panel from '../components/Panel.svelte';
	import Tree from '../components/Tree.svelte';
	import tree from '../example.json';
</script>

<svelte:head>
	<title>NeuralDash</title>
	<meta name="description" content="Make Neural Networks" />
</svelte:head>

<section>
	<Panel />
	<Tree {tree} />
</section>

<style>
	section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		height: 90vh;
		width: 90vw;
	}
</style>
