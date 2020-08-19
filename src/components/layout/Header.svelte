<script>
    import {Doc, User} from 'sveltefire';
    import {link} from "svelte-routing";
    import LogoutButton from "../auth/LogoutButton.svelte";
    import Icon from "../uikit/Icon.svelte";
    import {Button} from "svelte-uikit3";
</script>


<header>
    <div class="row">
        <a href="https://mlesports.gg" target="_blank">
            <img src="/img/MLE_Primary@2x.png" alt="MLE Logo"/>
        </a>
        <div class="col">
            <a use:link href="/" class="uk-link-reset">
                <h1 class="uk-margin-remove">MLE Reference</h1>
            </a>
            <Doc path="metadata/metadata" let:data once={true}>
                <span class="uk-text-meta uk-text-small">Last Updated: {new Date(data.last_updated)}</span>
            </Doc>
        </div>
    </div>

    <div class="col buttons">
        <a use:link href="/" class="uk-margin-small">
            <Button style="secondary" width="1-1">
                Home
                <Icon icon="home"/>
            </Button>
        </a>
        <User let:user persist={localStorage} let:auth>

            <LogoutButton/>
            <a use:link href="/settings">
                <Button style="secondary" width="1-1">
                    Settings
                    <Icon icon="settings"/>
                </Button>
            </a>
            <div slot="signed-out">
                <!--<a use:link href="signin">
                    <Button style="secondary" width="1-1">
                        Sign In <Icon icon="sign-in"/>
                    </Button>
                </a>-->
            </div>
        </User>
    </div>
</header>


<style lang="scss">
    header {
        background-color: #2a4b82;
        padding: 1em 3em;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        .col {
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #fff;


        }

        > .col:not(:first-child) {
            margin-top: 2em;
        }

        .row {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .buttons {
        }

        h1 {
            color: #fff;
        }

        img, > .row > a {
            height: 8em;
        }

    }

    @media screen and (min-width: 960px) {
        header {
            flex-direction: row;
            height: 10em;

            > .col:not(:first-child) {
                margin-top: unset;
            }

            img {
                height: 80%;
            }

            .row {
                flex-direction: row;
            }
        }
    }
</style>