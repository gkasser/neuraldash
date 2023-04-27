<script lang="ts">
	import { NavigationAPI } from '../components/NavigationAPI';
	import { graphApi } from '../components/state';
	import backbones from '../lib/models/all.json';

	let fileInput: HTMLInputElement;
	let selectedName = '';

	const validateJsonFile = (json_content: string) => {
		console.log(json_content);
		console.log('Loaded json content, start validation');
		graphApi.loadJson(json_content);
		NavigationAPI.Tree();
		window.location.href = '/edit';
	};

	const handleSelecter = (e: Event & { currentTarget: EventTarget & HTMLSelectElement }) => {
		selectedName = `/models/${e.currentTarget.value}.json`;

		fetch(selectedName)
			.then((response) => response.json())
			.then((data) => {
				validateJsonFile(data);
			});
	};

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files) return;
		const file = target.files[0];
		const reader = new FileReader();

		selectedName = file.name;

		reader.onload = function (event) {
			if (!event.target) return;
			const contents = event.target.result as string;
			const jsonData = JSON.parse(contents);
			validateJsonFile(jsonData);
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
	Create a new neural network from a classic backbone:
	<select class="selecter" on:change={handleSelecter}>
		{#each backbones as backbone}
			<option>{backbone}</option>
		{/each}
	</select>

	or

	<button
		class="uploader"
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
		on:change={handleFileUpload}
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

	.selecter {
		margin: 35px;
		height: 45px;
		width: 225px;
		text-align: center;
		font-size: 16px;
	}

	.uploader {
		margin: 35px;
		height: 45px;
		width: 225px;
		text-align: center;
		font-size: 16px;
	}
</style>
