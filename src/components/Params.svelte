<script lang="ts">
	export let params: Array<any>;
</script>

<div>
	<!-- close -->
	{#each params as param, i}
		<label for={param}>{param}</label>
		<input bind:value={params[i]} tabindex={i + 1} id={param} />
	{/each}
</div>
