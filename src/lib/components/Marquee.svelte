<script lang="ts">
	let {
		text,
		reps = 4,
		duration = 22,
		reverse = false,
		alternate = false
	}: { text: string; reps?: number; duration?: number; reverse?: boolean; alternate?: boolean } =
		$props();
</script>

<div class="marquee" class:reverse style="--marquee-dur: {duration}s">
	{#each [false, true] as hidden (hidden)}
		<div class="track" aria-hidden={hidden ? 'true' : undefined}>
			{#each Array(reps) as _, i (i)}
				<span class="v-display" class:outlined={alternate && i % 2 === 1}>{text}</span>
			{/each}
		</div>
	{/each}
</div>

<style>
	span {
		font-size: clamp(20px, 4vw, 64px);
		padding-block: 0.15em;
	}
</style>
