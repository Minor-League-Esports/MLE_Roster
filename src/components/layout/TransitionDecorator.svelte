<script>
    import {BaseTransition} from "@sveltech/routify/decorators";
    import {fade, fly, scale} from 'svelte/transition';

    const configs = [
        {
            // New and old route are identical, do nothing
            condition: ({ routes }) => routes[0] === routes[1],
            transition: () => {},
        },
        {
            condition: c => c.toAncestor,
            transition: scale,
            inParams: { start: 1.2 },
            outParams: { start: 0.8 },
        },
        {
            condition: c => c.toDescendant,
            transition: scale,
            inParams: { start: 0.8 },
            outParams: { start: 1.2 },
        },
        {
            condition: (meta) => true,
            transition: fly,
            inParams: {
                duration: 500,
                x:1000
            },
            outParams: {
                duration: 500,
                x: -1000
            }
        },
    ]
</script>

<BaseTransition {configs}>
    <slot/>
</BaseTransition>