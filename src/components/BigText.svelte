<script>
    export let fontSize = "2em";
    export let label = "";
    let _class = "";
    export {_class as class};

</script>


<div class={_class}>
    <span class="label">{label}</span>
    <span style="font-size:{fontSize};line-height:1em;">
        <slot/>
    </span>
</div>

<style>
    div{
        display:flex;
        flex-direction:column;
        text-align:center;
    }
    .label{
        font-size:.8em;
        text-align:center;
        width:100%;
        margin:0;
    }
</style>