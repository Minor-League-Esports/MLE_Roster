<script>
    export let height = "4em";
    export let includeBorder = false;
    let _class = "";
    export {_class as class};
</script>

<div class="team-logo {_class}" style="height: {height}; width: {height}" class:include-border={includeBorder}>
    <div></div>
</div>

<style lang="scss">
    div.team-logo {
        &.include-border{
            &::before {
                display: block;
                content: "";
                background-color: var(--away-secondary);
                width: 80%;
                height: 80%;
                z-index: 0;
                position: absolute;
                border-radius: 100%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            background-color: var(--away-primary);
        }
        margin-right: .5em;
        border-radius: 50%;
        padding: .5em;
        background-color: rgba(0, 0, 0, 0.2);

        position:relative;
        div {
            background-image: var(--team-url);
            height: 100%;
            width: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            position:relative;
            z-index:1;
        }
    }
</style>