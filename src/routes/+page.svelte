<script>
	import Tree from '../components/Tree.svelte';
	import tree from '../example.json';
</script>

<svelte:head>
	<title>NeuralDash</title>
	<meta name="description" content="Make Neural Networks" />
</svelte:head>

<section>
	<Tree {tree} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
