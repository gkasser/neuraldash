<script lang="ts">
	import backbones from '../lib/models/all.json';
	let fileInput: HTMLInputElement;
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		const file = target.files[0];
		const reader = new FileReader();

		reader.onload = function (event) {
			if (!event.target) return;
			const contents = event.target.result as string;
			const jsonData = JSON.parse(contents);
			console.log(jsonData);
		};

		reader.readAsText(file);
	}
</script>

<svelte:head>
	<title>NeuralDash</title>
	<meta name="description" content="Think Fast !" />
</svelte:head>

<div>
	<h1>NeuralDash</h1>
	<h2>Create & Edit neural networks</h2>
	Create a new neural network from a backbone:
	<select>
		{#each backbones as backbone}
			<option>{backbone}</option>
		{/each}
	</select>

	or

	<button
		on:click={() => {
			fileInput.click();
		}}
	>
		Upload a keras model.json
	</button>

	<input
		type="file"
		accept=".json"
		style="display:none"
		bind:this={fileInput}
		on:change={handleFileSelect}
	/>
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
