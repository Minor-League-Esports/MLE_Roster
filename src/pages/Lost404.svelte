<script>
    import {link} from "svelte-routing";
    import Body from "../components/layout/Body.svelte";
    import {Card, Flex, Button} from "svelte-uikit3";
    import Icon from "../components/uikit/Icon.svelte";

    const back = () => {
        window.history.back();
    }
</script>

<Body>
    <Card width="2-3" color="secondary">
        <h1>Sorry!</h1>
        <span class="uk-text-large">We can't find that page</span>
        <Flex justification="between" class="uk-margin-medium-top">
            <Button width="2-5" on:click={back}>Back <Icon icon="history"/></Button>
            <a use:link href="/" class="uk-width-2-5"><Button width="1-1">Home <Icon icon="home"/></Button></a>
        </Flex>
    </Card>


</Body>