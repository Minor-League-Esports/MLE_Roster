import App from './App.svelte';

const app = new App({
	target: document.body
});

history.pushState = new Proxy(history.pushState, {
	apply (target, thisArg, argumentsList) {
		scrollTo(0,0)
		Reflect.apply(target, thisArg, argumentsList)
	}
})

export default app;