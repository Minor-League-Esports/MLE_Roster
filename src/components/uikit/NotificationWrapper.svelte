<script>
    import uikit from "uikit";
    import {onDestroy, setContext} from "svelte";
    import {writable} from "svelte/store";

    const notificationStore = writable("");
    const destroyStore = notificationStore.subscribe(value => {
        if(value) {
            if(typeof value === "string"){
                uikit.notification({
                    message: value,
                    pos: 'bottom-right',
                    timeout: 3000
                });
            } else if (typeof value === "object"){
                try{
                    uikit.notification(
                        Object.assign({
                            pos: 'bottom-right',
                            timeout: 3000,
                            status: 'primary'
                        }, value)
                    );
                } catch {}
            }
            notificationStore.set("");
        }
    })

    setContext("notificationStore", notificationStore)

    onDestroy(destroyStore)
</script>


<slot/>